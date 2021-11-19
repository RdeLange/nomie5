/**
 * Period Store
 
 */

// Svelte
import { writable } from "svelte/store";

// utils
import Logger from "../utils/log/log";
import math from "../utils/math/math";
import snakeCase from "../utils/snake-case/snake-case";
import NomieLog from "../modules/nomie-log/nomie-log";

// Vendors
import Storage from "../modules/storage/storage";

// Get Config
import config from "../config/appConfig";

import { LedgerStore } from "./ledger";
import { Interact } from "./interact";
import { Lang } from "./lang";

import dayjs from "dayjs";

import Period from "../modules/period/period";

const console = new Logger("⏳ $PeriodStore");

const toPeriodname = (periodname) => {
  periodname = periodname.replace("~", "").trim();
  periodname = snakeCase(periodname);
  return periodname.toLowerCase();
};

function getState() {
  let returnState;
  update((state) => {
    returnState = state;
    return state;
  });
  return returnState;
}

const searchForPeriods = async () => {
  let loadingFinished = Interact.loading("Finding ~periods...");
  const logs = await LedgerStore.query({ start: dayjs().subtract(3, "month") });

  let periods = [];
  logs.forEach((log) => {
    let meta = log.getMeta();
    // Array of periodnames.
    meta.periods.forEach((periodElement) => {
      let periodname = periodElement.id.toLowerCase();
      periods.push({ periodname, last: new Date(log.end) });
    });
    
  });

  let map = {};
  periods.forEach((period) => {
    map[period.periodname] = map[period.periodname] || { periodname: period.periodname, dates: [] };
    map[period.periodname].dates.push(period.last);
  });

  let final = Object.keys(map).map((periodname) => {
    let dates = map[periodname].dates.sort((a, b) => {
      a > b ? 1 : -1;
    });
    return {
      periodname,
      last: dates[0],
    };
  });

  loadingFinished();
  return final;
};

/**
 * PERIODS STORE
 * Used for global period things!
 * August 25 2021 - the Coronavirus COVID-19 is still being crazy.
 */

const PeriodsInit = () => { 
  const PeriodsState = {
    periods: {},
    stats: {},
  };
  const { update, subscribe, set } = writable(PeriodsState);

  const methods = {
    async init() {
      await methods.getPeriods();
      // Refresh the periods every minute
      // This should help with blockstack users
      setInterval(() => {
        methods.getPeriods();
      }, 1000 * 60 * 5);
    },
    savePeriod(period) {
      update((state) => {
        state.periods[period.periodname] = period;
        this.write(state.periods);
        return state;
      });
    },
    async deletePeriod(period) {
      update((state) => {
        if (typeof period == "string") {
          delete state.periods[period];
        } else {
          delete state.periods[period.periodname];
        }
        return state;
      });
      return methods.writeState();
    },
    get(name) {
      let period;
      update((state) => {
        if (state.periods.hasOwnProperty(name)) {
          period = state.periods[name];
        } else {
          period = new Period(name);
        }
        return state;
      });
      return period;
    },
    async getPeriods() {
      // Get periods from storage
      let periods = await Storage.get(`${config.data_root}/${config.data_periods_key}.json`);
      // Update State
      update((state) => {
        let statePeriods = state.periods;
        if (periods) {
          // Turn it in to a Period Object
          Object.keys(periods)
            .filter((row) => row)
            .forEach((periodKey) => {
              statePeriods[periodKey.toLowerCase()] = new Period(periods[periodKey]);
            });
        }
        state.periods = statePeriods;
        return state;
      });
      return periods;
    },
    async saveFoundPeriods(periodsArray) {
      update((state) => {
        state.periods = state.periods || {};
        let changed = false;

        // Loop over array of periods { periodname: x, last: date }
        periodsArray.forEach((period) => {
          if (typeof period != "string") {
            // If this is a new period
            if (!state.periods.hasOwnProperty(period.periodname)) {
              state.periods[period.periodname] = new Period(period.periodname);
              state.periods[period.periodname].last = period.last || new Date();
              changed = true;
            } else {
              // If the current LAST date is less than (older) than the one provided
              // use the one provided, otherwise do nothing.
              if (state.periods[period.periodname].last < period.last) {
                state.periods[period.periodname].last = period.last;
                changed = true;
              }
            }
          } else {
            // Should no longer ever happen
            Interact.alert("Error", "Sorry savePeriods was called with just a string. Please report this!");
          }
        });

        // Has Changes?
        if (changed) {
          this.write(state.periods);
        }
        // Return state to update
        return state;
      });
    },
    async addByName(periodName) {
      let period;
      let _state;
      if (periodName) {
        let periodname = toPeriodname(periodName).toLowerCase();
        let added = false;
        update((state) => {
          state.periods = state.periods || {};
          if (!state.periods.hasOwnProperty(periodname)) {
            period = new Period({ periodname: periodname, displayName: periodName });
            state.periods[periodname] = period;
            added = true;
          }
          _state = state;
          return state;
        });
        if (added) {
          this.write(_state.periods);
          return _state.periods[periodname];
        } else {
          throw new Error("That periodname is already taken, please try another name.");
        }
      }
      return period;
    },
    async writeState() {
      update((state) => {
        methods.write(state.periods);
        return state;
      });
    },
    async write(payload) {
      return Storage.put(`${config.data_root}/${config.data_periods_key}.json`, payload);
    },
    // async stats(options = {}) {
    //   return await getRecentPeriodsStats();
    // },
    async searchForPeriods() {
      let periods = await searchForPeriods();
      if (periods.length) {
        const confirm = await Interact.confirm(`${periods.length} ~periodname's found`, "Add them to your Period list?");
        if (confirm) {
          await methods.saveFoundPeriods(periods);
          Interact.alert("👍 Periods list updated!");
        }
      } else {
        Interact.alert(`Sorry, no ~periodname's found in the last 6 months`);
      }
    },
  };

  return {
    update,
    subscribe,
    set,
    ...methods,
  };
};

export const PeriodsStore = PeriodsInit();

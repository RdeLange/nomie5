/**
 * Journal Store
 
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

import Journal from "../modules/journal/journal";

const console = new Logger("🗺 $JournalStore");

const toJournalname = (journalname) => {
  journalname = journalname.replace("§", "").trim();
  journalname = snakeCase(journalname);
  return journalname.toLowerCase();
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getState() {
  let returnState;
  update((state) => {
    returnState = state;
    return state;
  });
  return returnState;
}

const searchForJournals = async () => {
  let loadingFinished = Interact.loading("Finding §journals...");
  const logs = await LedgerStore.query({ start: dayjs().subtract(3, "month") });

  let journals = [];
  logs.forEach((log) => {
    let meta = log.getMeta();
    // Array of journalnames.
    meta.journals.forEach((journalElement) => {
      let journalname = journalElement.id.toLowerCase();
      journals.push({ journalname, last: new Date(log.end) });
    });
    
  });

  let map = {};
  journals.forEach((journal) => {
    map[journal.journalname] = map[journal.journalname] || { journalname: journal.journalname, dates: [] };
    map[journal.journalname].dates.push(journal.last);
  });

  let final = Object.keys(map).map((journalname) => {
    let dates = map[journalname].dates.sort((a, b) => {
      a > b ? 1 : -1;
    });
    return {
      journalname,
      last: dates[0],
    };
  });

  loadingFinished();
  return final;
};

/**
 * JOURNAL STORE
 * Used for global journal things!
 * November 5 2021 - the Coronavirus COVID-19 is still crazy.
 */

const JournalsInit = () => { 
  const JournalsState = {
    journals: {},
    stats: {},
  };
  const { update, subscribe, set } = writable(JournalsState);

  const methods = {
    async init() {
      await methods.getJournals();
      // Refresh the journals every minute
      // This should help with blockstack users
      setInterval(() => {
        methods.getJournals();
      }, 1000 * 60 * 5);
    },
    saveJournal(journal) {
      update((state) => {
        state.journals[journal.journalname] = journal;
        this.write(state.journals);
        return state;
      });
    },
    async deleteJournal(journal) {
      update((state) => {
        if (typeof journal == "string") {
          delete state.journals[journal];
        } else {
          delete state.journals[journal.journalname];
        }
        return state;
      });
      return methods.writeState();
    },
    get(name) {
      let journal;
      update((state) => {
        if (state.journals.hasOwnProperty(name)) {
          journal = state.journals[name];
        } else {
          journal = new Journal(name);
        }
        return state;
      });
      return journal;
    },
    async getJournals() {
      // Get journals from storage
      let journals = await Storage.get(`${config.data_root}/${config.data_journals_key}.json`);
      // Update State
      update((state) => {
        let stateJournals = state.journals;
        if (journals) {
          // Turn it in to a Journal Object
          Object.keys(journals)
            .filter((row) => row)
            .forEach((journalKey) => {
              stateJournals[journalKey.toLowerCase()] = new Journal(journals[journalKey]);
            });
        }
        state.journals = stateJournals;
        return state;
      });
      return journals;
    },
    async saveFoundJournals(journalsArray) {
      update((state) => {
        state.journals = state.journals || {};
        let changed = false;

        // Loop over array of journals { journalname: x, last: date }
        journalsArray.forEach((journal) => {
          if (typeof journal != "string") {
            // If this is a new journal
            if (!state.journals.hasOwnProperty(journal.journalname)) {
              state.journals[journal.journalname] = new Journal(journal.journalname);
              state.journals[journal.journalname].last = journal.last || new Date();
              changed = true;
            } else {
              // If the current LAST date is less than (older) than the one provided
              // use the one provided, otherwise do nothing.
              if (state.journals[journal.journalname].last < journal.last) {
                state.journals[journal.journalname].last = journal.last;
                changed = true;
              }
            }
          } else {
            // Should no longer ever happen
            Interact.alert("Error", "Sorry saveJournals was called with just a string. Please report this!");
          }
        });

        // Has Changes?
        if (changed) {
          this.write(state.journals);
        }
        // Return state to update
        return state;
      });
    },
    async addByName(journalName) {
      let journal;
      let _state;
      if (journalName) {
        let journalname = toJournalname(journalName).toLowerCase(); // rdl: lower und uppercase word journal is correct
        let journalDisplayName = capitalizeFirstLetter(journalname);
        let added = false;
        update((state) => {
          state.journals = state.journals || {};
          if (!state.journals.hasOwnProperty(journalname)) {
            journal = new Journal({ journalname: journalname, displayName: journalDisplayName });
            state.journals[journalname] = journal;
            added = true;
          }
          _state = state;
          return state;
        });
        if (added) {
          this.write(_state.journals);
          return _state.journals[journalname];
        } else {
          throw new Error("That journal name is already taken, please try another name.");
        }
      }
      return journal;
    },
    async addByTemplate(journalTemplate) {
      let journal;
      let _state;
      if (journalTemplate.journalname) {
        let journalname = toJournalname(journalTemplate.journalname).toLowerCase(); // rdl: lower und uppercase word journal is correct
        let journalDisplayName = capitalizeFirstLetter(journalname);
        let added = false;
        update((state) => {
          state.journals = state.journals || {};
          if (!state.journals.hasOwnProperty(journalname)) {
            journal = new Journal({ journalname: journalname, displayName: journalDisplayName, avatar: journalTemplate.avatar,last: journalTemplate.last,notes: journalTemplate.notes,prompts: journalTemplate.prompts });
            state.journals[journalname] = journal;
            added = true;
          }
          _state = state;
          return state;
        });
        if (added) {
          this.write(_state.journals);
          return _state.journals[journalname];
        } else {
          throw new Error("That journal name is already taken, please try another name.");
        }
      }
      return journal;
    },
    async writeState() {
      update((state) => {
        methods.write(state.journals);
        return state;
      });
    },
    async write(payload) {
      return Storage.put(`${config.data_root}/${config.data_journals_key}.json`, payload);
    },
    // async stats(options = {}) {
    //   return await getRecentJournalsStats();
    // },
    async searchForJournals() {
      let journals = await searchForJournals();
      if (journals.length) {
        const confirm = await Interact.confirm(`${journals.length} §journal name's found`, "Add them to your Journals list?");
        if (confirm) {
          await methods.saveFoundJournals(journals);
          Interact.alert("👍 Journals list updated!");
        }
      } else {
        Interact.alert(`Sorry, no §journal name's found in the last 6 months`);
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

export const JournalsStore = JournalsInit();

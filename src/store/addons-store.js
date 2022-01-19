/**
 * Addons Store
 
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

import Addon from "../modules/addon/addon";

const console = new Logger("🧱 $AddonStore");

const toAddonname = (addonname) => {
  addonname = addonname.replace("^", "").trim();
  addonname = snakeCase(addonname);
  return addonname.toLowerCase();
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

//const searchForJournals = async () => {
//  let loadingFinished = Interact.loading("Finding §journals...");
//  const logs = await LedgerStore.query({ start: dayjs().subtract(3, "month") });

//  let journals = [];
//  logs.forEach((log) => {
//    let meta = log.getMeta();
//    // Array of journalnames.
//    meta.journals.forEach((journalElement) => {
//      let journalname = journalElement.id.toLowerCase();
//      journals.push({ journalname, last: new Date(log.end) });
//    });
//    
//  });
//
//  let map = {};
//  journals.forEach((journal) => {
//    map[journal.journalname] = map[journal.journalname] || { journalname: journal.journalname, dates: [] };
//    map[journal.journalname].dates.push(journal.last);
//  });

//  let final = Object.keys(map).map((journalname) => {
//    let dates = map[journalname].dates.sort((a, b) => {
//      a > b ? 1 : -1;
//    });
//    return {
//      journalname,
//      last: dates[0],
//    };
//  });

//  loadingFinished();
//  return final;
//};

/**
 * ADDON STORE
 * Used for global addon things!
 * December 3 2021 - the Coronavirus COVID-19 is getting more crazy with the new omikron variant.
 */

const AddonsInit = () => { 
  const AddonsState = {
    addons: {},
    stats: {},
  };
  const { update, subscribe, set } = writable(AddonsState);

  const methods = {
    async init() {
      await methods.getAddons();
      // Refresh the journals every minute
      // This should help with blockstack users
      setInterval(() => {
        methods.getAddons();
      }, 1000 * 60 * 5);
    },
    saveAddon(addon) {
      update((state) => {
        state.addons[addon.addonname] = addon;
        this.write(state.addons);
        return state;
      });
    },
    async deleteAddon(addon) {
      update((state) => {
        if (typeof addon == "string") {
          delete state.addons[addon];
        } else {
          delete state.addons[addon.addonname];
        }
        return state;
      });
      return methods.writeState();
    },
    get(name) {
      let addon;
      update((state) => {
        if (state.addons.hasOwnProperty(name)) {
          addon = state.addons[name];
        } else {
          addon = new Addon(name);
        }
        return state;
      });
      return addon;
    },
    async getAddons() {
      // Get addons from storage
      let addons = await Storage.get(`${config.data_root}/${config.data_addons_key}.json`);
      // Update State
      update((state) => {
        let stateAddons = state.addons;
        if (addons) {
          // Turn it in to a Addon Object
          Object.keys(addons)
            .filter((row) => row)
            .forEach((addonKey) => {
              stateAddons[addonKey.toLowerCase()] = new Addon(addons[addonKey]);
            });
        }
        state.addons = stateAddons;
        return state;
      });
      return addons;
    },
    async saveFoundAddons(addonsArray) {
      update((state) => {
        state.addons = state.addons || {};
        let changed = false;

        // Loop over array of addonss { addonname: x, last: date }
        addonsArray.forEach((addon) => {
          if (typeof addon != "string") {
            // If this is a new addon
            if (!state.addons.hasOwnProperty(addon.addonname)) {
              state.addons[addon.addonname] = new Addon(addon.addonname);
              state.addons[addon.addonname].last = addon.last || new Date();
              changed = true;
            } else {
              // If the current LAST date is less than (older) than the one provided
              // use the one provided, otherwise do nothing.
              if (state.addons[addon.addonname].last < addon.last) {
                state.addons[addon.addonname].last = addon.last;
                changed = true;
              }
            }
          } else {
            // Should no longer ever happen
            Interact.alert("Error", "Sorry saveAddonss was called with just a string. Please report this!");
          }
        });

        // Has Changes?
        if (changed) {
          this.write(state.addons);
        }
        // Return state to update
        return state;
      });
    },
    async addByName(addonName) {
      let addon;
      let _state;
      if (addonName) {
        let addonname = toAddonname(addonName).toLowerCase(); // rdl: lower und uppercase word addon is correct
        let addonDisplayName = capitalizeFirstLetter(addonname);
        let added = false;
        update((state) => {
          state.addons = state.addons || {};
          if (!state.addons.hasOwnProperty(addonname)) {
            addon = new Addon({ addonname: addonname, displayName: addonDisplayName });
            state.addons[addonname] = addon;
            added = true;
          }
          _state = state;
          return state;
        });
        if (added) {
          this.write(_state.addons);
          return _state.addons[addonname];
        } else {
          throw new Error("That addon name is already taken, please try another name.");
        }
      }
      return addon;
    },
    async addByCatalogue(catalogue_addon) {
      let addon;
      let _state;
      if (catalogue_addon.addonname) {
        let addonname = toAddonname(catalogue_addon.addonname).toLowerCase(); // rdl: lower und uppercase word addon is correct
        let addonDisplayName = catalogue_addon.displayName;
        let added = false;
        update((state) => {
          state.addons = state.addons || {};
          if (!state.addons.hasOwnProperty(addonname)) {
            addon = new Addon({ addonname: addonname, displayName: addonDisplayName, avatar: catalogue_addon.avatar,last: catalogue_addon.last,notes: catalogue_addon.notes,configuration: catalogue_addon.configuration });
            state.addons[addonname] = addon;
            added = true;
          }
          _state = state;
          return state;
        });
        if (added) {
          this.write(_state.addons);
          return _state.addons[addonname];
        } else {
          throw new Error("This addon is already installed");
        }
      }
      return addon;
    },
    async writeState() {
      update((state) => {
        methods.write(state.addons);
        return state;
      });
    },
    async write(payload) {
      return Storage.put(`${config.data_root}/${config.data_addons_key}.json`, payload);
    },
    
    async searchForAddons() {
      let addons = await searchForAddons();
      if (addons.length) {
        const confirm = await Interact.confirm(`{addons.length} ^addon name's found`, "Add them to your Addons list?");
        if (confirm) {
          await methods.saveFoundAddons(addons);
          Interact.alert("👍 Addons list updated!");
        }
      } else {
        Interact.alert(`Sorry, no ^addon name's found in the last 6 months`);
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

export const AddonsStore = AddonsInit();

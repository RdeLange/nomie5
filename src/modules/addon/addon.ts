export interface IAddon {
  addonname: string;
  displayName: string;
  avatar?: string;
  last: Date;
  notes: string;
  configuration: any;
  addoncolor: string;
}

export default class Addon {
  addonname: string;
  displayName: string;
  avatar?: string;
  last: Date;
  notes: string;
  configuration: any;
  addoncolor: string;

  constructor(starter: any = {}) {
    if (typeof starter == "string") {
      this.addonname = starter;
      this.displayName = starter;
      this.last = new Date();
      this.notes = "";
      this.configuration = [];
      this.addoncolor = "#66BB6A";
      starter = {};
    } else if (typeof starter == "object") {
      this.addonname = starter.addonname ? starter.addonname.toLowerCase() : "unknown";
      this.displayName = starter.displayName || starter.addonname;
      this.avatar = starter.avatar;
      this.last = starter.last ? new Date(starter.last) : new Date();
      this.notes = starter.notes || "";
      this.configuration = starter.configuration || [];
      this.addoncolor = starter.addoncolor || "#66BB6A";
    }
  }

  setLast(date): void {
    date = date || new Date();
    this.last = date;
  }
  getLast(): Date {
    return this.last;
  }

  setAddonname(addonname: string): void {
    this.addonname = addonname;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }

  setAddonColor(addoncolor: string): void {
    this.addoncolor = addoncolor;
  }

  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  getAddonname(): string {
    return this.addonname;
  }

  getDisplayName(): string {
    return this.displayName || this.addonname;
  }

  getAddonColor(): string {
    return this.addoncolor;
  }

  getAvatar(): string {
    return this.avatar;
  }
 
  getConfiguration(): any {
    return this.configuration;
  }

  setConfiguration(configuration: any): void {
    this.configuration = configuration;
  }


}

export interface IPeriod {
  periodname: string;
  displayName: string;
  icon?: string;
  start: Date;
  end: Date;
  last: Date;
  notes: string; 
  periodcolor: string;
}

export default class Person {
  periodname: string;
  displayName: string;
  icon?: string;
  start: Date;
  end: Date;
  last: Date;
  notes: string;
  periodcolor: string;

  constructor(starter: any = {}) {
    if (typeof starter == "string") {
      this.periodname = starter;
      this.displayName = starter;
      this.last = new Date();
      this.start = new Date();
      this.end = new Date();
      this.notes = "";
      this.periodcolor = "#66BB6A";
      starter = {};
    } else if (typeof starter == "object") {
      this.periodname = starter.periodname ? starter.periodname.toLowerCase() : "unknown";
      this.displayName = starter.displayName || starter.periodname;
      this.icon = starter.icon;
      this.last = starter.last ? new Date(starter.last) : new Date();
      this.start = starter.start ? new Date(starter.start) : new Date();
      this.end = starter.end ? new Date(starter.end) : new Date();
      this.notes = starter.notes || "";
      this.periodcolor = starter.periodcolor || "#66BB6A";
    }
  }

  setLast(date): void {
    date = date || new Date();
    this.last = date;
  }
  getLast(): Date {
    return this.last;
  }

  setStart(date): void {
    date = date || new Date();
    this.start = date;
  }
  getStart(): Date {
    return this.start;
  }

  setEnd(date): void {
    date = date || new Date();
    this.end = date;
  }
  getEnd(): Date {
    return this.end;
  }

  setPeriodname(periodname: string): void {
    this.periodname = periodname;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }

  setPeriodColor(periodcolor: string): void {
    this.periodcolor = periodcolor;
  }

  setIcon(icon: string): void {
    this.icon = icon;
  }

  getPeriodname(): string {
    return this.periodname;
  }

  getDisplayName(): string {
    return this.displayName || this.periodname;
  }

  getPeriodColor(): string {
    return this.periodcolor;
  }

  getIcon(): string {
    return this.icon;
  }
}

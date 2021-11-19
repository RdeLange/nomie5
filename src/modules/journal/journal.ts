export interface IJournal {
  journalname: string;
  displayName: string;
  avatar?: string;
  last: Date;
  notes: string;
  prompts: any;
  journalcolor: string;
}

export default class Journal {
  journalname: string;
  displayName: string;
  avatar?: string;
  last: Date;
  notes: string;
  prompts: any;
  journalcolor: string;

  constructor(starter: any = {}) {
    if (typeof starter == "string") {
      this.journalname = starter;
      this.displayName = starter;
      this.last = new Date();
      this.notes = "";
      this.prompts = [];
      this.journalcolor = "#66BB6A";
      starter = {};
    } else if (typeof starter == "object") {
      this.journalname = starter.journalname ? starter.journalname.toLowerCase() : "unknown";
      this.displayName = starter.displayName || starter.journalname;
      this.avatar = starter.avatar;
      this.last = starter.last ? new Date(starter.last) : new Date();
      this.notes = starter.notes || "";
      this.prompts = starter.prompts || [];
      this.journalcolor = starter.journalcolor || "#66BB6A";
    }
  }

  setLast(date): void {
    date = date || new Date();
    this.last = date;
  }
  getLast(): Date {
    return this.last;
  }

  setJournalname(journalname: string): void {
    this.journalname = journalname;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }

  setJournalColor(journalcolor: string): void {
    this.journalcolor = journalcolor;
  }

  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  getJournalname(): string {
    return this.journalname;
  }

  getDisplayName(): string {
    return this.displayName || this.journalname;
  }

  getJournalColor(): string {
    return this.journalcolor;
  }

  getAvatar(): string {
    return this.avatar;
  }
 
  getPrompts(): any {
    return this.prompts;
  }

  setPrompts(prompts: any): void {
    this.prompts = prompts;
  }


}

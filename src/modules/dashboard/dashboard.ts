import nid from "../nid/nid";
import { Widget } from "./widget";
import type { WidgetConfig } from "./widget";
import dayjs, { Dayjs, OpUnitType } from "dayjs";

/**
 * Dashboard Date
 * The blockdate is either the start or end of a TimeFrame
 * They can have a hard coded date, or be dynamically set
 * using add, subtract, startOf and endOf
 */
 export interface DashboardDateConfig {
  date?: Dayjs;
  add?: Array<any>;
  subtract?: Array<any>;
  startOf?: OpUnitType;
  endOf?: OpUnitType;
}

export class DashboardDate {
  date?: Dayjs;
  add?: Array<any>;
  subtract?: Array<any>;
  startOf?: OpUnitType;
  endOf?: OpUnitType;

  constructor(part: DashboardDateConfig) {
    if (part) {
      this.date = part.date;
      this.subtract = part.subtract;
      this.add = part.add;
      this.endOf = part.endOf;
      this.startOf = part.startOf;
    }
  }
  
  public toDate(): Dayjs {
    let date = this.date ? this.date : dayjs();
    if (this.subtract instanceof Array) {
      date = date.subtract(this.subtract[0], this.subtract[1]);
    }
    if (this.add instanceof Array) {
      date = date.add(this.subtract[0], this.subtract[1]);
    }
    if (this.startOf) {
      date = date.startOf(this.startOf);
    }
    if (this.endOf) {
      date = date.endOf(this.endOf);
    }
    
    return date;
  }
}

/**
 * Time Frame
 * A Timeframe is a start and end DashboardDate
 * as well as a label, and ID to allow for easily
 * setting up pre-defined settings
 */

export interface DashboardTimeFrameConfig {
  id?: string;
  label?: string;
  start?: DashboardDateConfig;
  end?: DashboardDateConfig;
}

export class DashboardTimeFrame {
  id?: string;
  label?: string;
  start: DashboardDate;
  end: DashboardDate;

  constructor(payload: DashboardTimeFrameConfig) {
    this.label = payload.label;
    this.start = new DashboardDate(payload.start);
    this.end = new DashboardDate(payload.end);
    this.id = payload.id || nid();
  }

  public getLabel(): string {
    //let defaultDate = this.start.date ? `${this.start.date.format("MMM DD")} to ${this.end.date.format("MMM DD YYYY")}` : "Unknown";
    //return this.label || defaultDate;
    return this.label;
  }
}



export class Dashboard {
  label: string;
  widgets: Array<Widget>;
  id: string;
  created?: Date;
  forceTimeRange?: boolean;
  timeRange?: DashboardTimeFrame;
 

  //constructor(starter: any = {}) {
  constructor(starter?: any ) {  
    starter = starter || {};
    this.label = starter.label || "My Stats";
    this.id = starter.id || nid();
    this.created = starter.created ? new Date(starter.created) : new Date();
    this.forceTimeRange = starter.forceTimeRange || false;
    // If a timeRange
    if (starter.timeRange) {
      this.timeRange = new DashboardTimeFrame(starter.timeRange);
    }
    else {
      this.timeRange = new DashboardTimeFrame({
        id: "last-30",
        label: "Last 30 days",
        start: {
          subtract: [29, "day"],
          startOf: "day",
        },
        end: {
          endOf: "day",
        },
      })
    }

    // Migrate from Blocks
    if (starter.blocks) {
      starter.widgets = starter.blocks;
      delete starter.blocks;
    }

    this.widgets = (starter.widgets || []).map((widget: WidgetConfig) => {
      return widget instanceof Widget ? widget : new Widget(widget);
    });
  }
}

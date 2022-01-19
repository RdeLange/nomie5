import TrackableElement from "../../../modules/trackable-element/trackable-element";
import type { ITrackableElement } from "../../../modules/trackable-element/trackable-element";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import nid from "../../../modules/nid/nid";
import NDate from "../../../utils/ndate/ndate";

/**
 * Calculation Value Date
 * The blockdate is either the start or end of a TimeFrame
 * They can have a hard coded date, or be dynamically set
 * using add, subtract, startOf and endOf
 */
export interface CalculationDateConfig {
  date?: Dayjs;
  add?: Array<any>;
  subtract?: Array<any>;
  startOf?: OpUnitType;
  endOf?: OpUnitType;
}

export class CalculationDate {
  date?: Dayjs;
  add?: Array<any>;
  subtract?: Array<any>;
  startOf?: OpUnitType;
  endOf?: OpUnitType;

  constructor(part: CalculationDateConfig) {
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
 * A Timeframe is a start and end CalculationDate
 * as well as a label, and ID to allow for easily
 * setting up pre-defined settings
 */

export interface CalculationTimeFrameConfig {
  id?: string;
  label?: string;
  start?: CalculationDateConfig;
  end?: CalculationDateConfig;
}

export class CalculationTimeFrame {
  id?: string;
  label?: string;
  start: CalculationDate;
  end: CalculationDate;

  constructor(payload: CalculationTimeFrameConfig) {
    this.label = payload.label;
    this.start = new CalculationDate(payload.start);
    this.end = new CalculationDate(payload.end);
    this.id = payload.id || nid();
  }

  public getLabel(): string {
    //let defaultDate = this.start.date ? `${this.start.date.format("MMM DD")} to ${this.end.date.format("MMM DD YYYY")}` : "Unknown";
    //return this.label || defaultDate;
    return this.label;
  }
}

/**
 * Calculation
 * This defines a single calculation
 */

export interface CalculationConfig {
  element?: ITrackableElement;
  id?: string;
  timeRange?: CalculationTimeFrame;
  minscale?:number;
  maxscale?:number;
  weight?:number;
  statistics?:string;
  reverseScale?:boolean;
}

export class Calculation {
  public id?: string;
  public element?: TrackableElement;
  public timeRange?: CalculationTimeFrame;
  public minscale?: number;
  public maxscale?: number;
  public weight?: number;
  public statistics?: string;
  public reverseScale?: boolean;
  
  constructor(payload?: CalculationConfig) {
    payload = payload || {};
    this.minscale = payload.minscale || 1;
    this.maxscale = payload.maxscale || 10;
    this.weight = payload.weight || 1;
    this.statistics = payload.statistics || "avg";
    this.reverseScale = payload.reverseScale || false;
    this.id = payload.id || nid();
    if (payload.timeRange) {
      this.timeRange = new CalculationTimeFrame(payload.timeRange);
    }
    // If an element
    if (payload.element) {
      this.element = new TrackableElement({ id: payload.element.id, type: payload.element.type });
    }
    
  }
  
  private getStartOfWeek(weekStartsOn: "1" | "2"): Dayjs {
    let start = NDate.setFirstDayOfWeek(weekStartsOn).getFirstDayOfWeek();
    let startOfWeek = dayjs(start).startOf("day");
    return startOfWeek;
  }

  private getEndOfWeek(weekStartsOn: "1" | "2"): Dayjs {
    let end = NDate.setFirstDayOfWeek(weekStartsOn).getLastDayOfWeek();
    let endOfWeek = end.endOf("day");
    return endOfWeek;
  }

  getStartDate(weekStartsOn: "1" | "2"): Dayjs { 
    if (this.timeRange && ["this-week", "last-week"].indexOf(this.timeRange.id) > -1) {
      // This is hacky
      let startOfWeek = this.getStartOfWeek(weekStartsOn);
      switch (this.timeRange.id) {
        case "this-week":
          return startOfWeek.startOf("day");
          break;
        case "last-week":
          return startOfWeek.startOf("day").subtract(7, "day");
          break;
      }
    } else if (this.timeRange && this.timeRange.start && this.timeRange.start.date) {
      // If a set Date
      return dayjs(this.timeRange.start.date);
    } else if (this.timeRange && this.timeRange.start) {
      return this.timeRange.start.toDate();
    } else {
      return dayjs().startOf("day");
    }
  }

  getEndDate(weekStartsOn: "1" | "2") {
    if (this.timeRange && ["this-week", "last-week"].indexOf(this.timeRange.id) > -1) {
      // This is hacky
      let endOfWeek = this.getEndOfWeek(weekStartsOn);
      switch (this.timeRange.id) {
        case "this-week":
          return endOfWeek.endOf("day");
          break;
        case "last-week":
          return endOfWeek.subtract(1, "week").endOf("day");
          break;
      }
    } else if (this.timeRange && this.timeRange.end && this.timeRange.end.date) {
      return dayjs(this.timeRange.end.date);
      //return this.timeRange.end.date;
    } else if (this.timeRange && this.timeRange.end) {
      return this.timeRange.end.toDate();
    } else {
      return dayjs().endOf("day");
    }
  }

  getDateRange(weekStartsOn: "1" | "2") {
    return [this.getStartDate(weekStartsOn), this.getEndDate(weekStartsOn)];
  }


}

/**
 * Category
 * This defines a single category
 */

export interface CategoryConfig {
  label?: "string";
  scale?: number;
  calculated?: boolean;
  calculations?: Array<Calculation>;
}

export class Category {
  public label?: string;
  public scale?: number;
  public calculated?: boolean;
  public calculations?: Array<Calculation>;
  
  constructor(payload?: CategoryConfig) {
    payload = payload || {};
    this.label = payload.label || "To be defined";
    this.scale = payload.scale || 0.1;
    this.calculated = payload.calculated || false;
    this.calculations = payload.calculations || [new Calculation()];
  }}

/**
 * Config
 * This defines the config
 */

 export interface WolConfig {
  cat1?: Category;
  cat2?: Category;
  cat3?: Category;
  cat4?: Category;
  cat5?: Category;
  cat6?: Category;
  cat7?: Category;
  cat8?: Category;
}

export class Wolcnf {
  public cat1?: Category; 
  public cat2?: Category;
  public cat3?: Category;
  public cat4?: Category;
  public cat5?: Category;
  public cat6?: Category;
  public cat7?: Category;
  public cat8?: Category;
  
  constructor(payload?: WolConfig) {
    payload = payload || {};
    this.cat1 = payload.cat1 || new Category;
    this.cat2 = payload.cat1 || new Category;
    this.cat3 = payload.cat1 || new Category;
    this.cat4 = payload.cat1 || new Category;
    this.cat5 = payload.cat1 || new Category;
    this.cat6 = payload.cat1 || new Category;
    this.cat7 = payload.cat1 || new Category;
    this.cat8 = payload.cat1 || new Category;
  }}  


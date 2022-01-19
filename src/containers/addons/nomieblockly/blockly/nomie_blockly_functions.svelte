<script context="module" lang="ts">

import StatsProcessor from "../../../../modules/stats/statsV5";
import TrackableElement from "../../../../modules/trackable-element/trackable-element";
import { TrackerStore } from "../../../../store/tracker-store";
import { LedgerStore } from "../../../../store/ledger.js";
import dayjs from "dayjs"; 
import NomieLog from "../../../../modules/nomie-log/nomie-log";
import tick from "../../../../utils/tick/tick";


export async function logDailyTrackerValue(value,tracker ,day){
    let result = false;
    let lognote = "#"+tracker+"("+value+")";
    const timezonecorrection = (new Date().getTimezoneOffset())*-1;
    try {
      let log = new NomieLog({
        note: lognote
      });
      // Set Date
      if (day == "today"){
        day = new Date()
        day = new Date(day.getTime() + timezonecorrection * 60000);
        day = day.toISOString().slice(0, 10);
      }
      else if (day == "yesterday"){
        day = new Date()
        day.setDate(day.getDate() - 1);
        day = new Date(day.getTime() + timezonecorrection * 60000);
        day = day.toISOString().slice(0, 10);
        
      }
      let logdate = day+"T13:00:00";
      let start = new Date(logdate);
      log.end = start.getTime();
      
      // Save to Ledger
      let saved = await LedgerStore.saveLog(log);
      // Wait for 600 ms
      await tick(600);
      result = true;
      
    } catch (e) {
      result = false;
    }
return result;
}

export async function getDailyTrackerValue(tracker,date,stats) {
  tracker=tracker.replace(/[()]/g, '');
  date=date.replace(/[()]/g, '');
  stats=stats.replace(/[()]/g, '');
  //DEFINE DATE TO WORK WITH
  if (date == "today"){
    date = new Date().toISOString().slice(0, 10);
  }
  else if (date == "yesterday"){
    let tmpdate = new Date()
    tmpdate.setDate(tmpdate.getDate() - 1);
    date = tmpdate.toISOString().slice(0, 10);
  }
  
  let startdate = date+"T00:00:00";
  const statsV5 = new StatsProcessor({});
  let element = TrackerStore.byTag(tracker); 
  let trackable_element = new TrackableElement({type:"tracker",id:tracker,raw:"#"+tracker,prefix:"#"});

  let start = new Date(startdate);
  let end = new Date(start);
  end.setDate(end.getDate() + 1);
  const fromDate = dayjs(start);
  const toDate = dayjs(end);
  let mode = "d" //mode to day
  let logs = await getLogs("tracker",trackable_element.id, start, end);
  let calculationmath = "sum";
        if (element.math == "sum"){
          calculationmath = "sum"}
        else {calculationmath = "mean"} 
        const statsConfig: any = {
          rows: logs[0],
          fromDate,
          toDate,
          mode,
          math: calculationmath, 
          trackableElement: trackable_element,
        };
     
  // Generate the Stats
  let trackerstats = statsV5.generate(statsConfig);

  ////GET STATS
  let result = 0;
  if (stats == "sum") {
    result = trackerstats.sum;}
  else if (stats == "avg") {
    result = trackerstats.avg;}  
  else if (stats == "max") {
    result = trackerstats.max.value;} 
  else if (stats == "min") {
    result = trackerstats.min.value;}  

  return result;
}


/**
   * Get the Logs for a calculation
   */
   async function getLogs(type,id,startdate,enddate): Promise<Array<any>> {
    let logs = []; // Holder of the logs
    let start = startdate; // get  start
    let end = enddate; // get end

    
    // Get the Logs based on the Type provided
    if (type == "tracker") {
      // Tracker Search
      logs[0] = await LedgerStore.queryTag(id, start, end);
    } else if (type == "person") {
      // Person Search
      logs[0] = await LedgerStore.queryPerson(id, start, end);
    } else if (type == "context") {
      // Context Search
      logs[0] = await LedgerStore.queryContext(id, start, end);
    } else  {
      // Generic Search
      logs[0] = await LedgerStore.queryAll(id, start, end);
    }
    return logs;
  }

</script>
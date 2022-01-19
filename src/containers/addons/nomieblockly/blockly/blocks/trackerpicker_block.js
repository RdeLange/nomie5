import Blockly from 'blockly/core.js';
import Interpreter from 'js-interpreter';
import { TrackerStore } from "../../../../../store/tracker-store";

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly block representing the trackers avaialble
 *
 * See https://neil.fraser.name/software/JS-Interpreter/docs.html
 */


//Let's first load all available trackers
let trackerlist = [];
trackerlist = loadTrackers;

Blockly.defineBlocksWithJsonArray([
  {
    "type": "s4e_trackers",
    "message0": "T: %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "Trackers",
        "options": trackerlist,
      }
    ],
    "inputsInline": false,
    "output": "Tracker",
    "colour": 195,
    "tooltip": "",
    "helpUrl": ""
  
}]);

/**
 * TRACKER BLOCK code
 */
 Blockly.JavaScript['s4e_trackers'] = function(block) {
  var dropdown_trackers = block.getFieldValue('Trackers');
  // TODO: Assemble JavaScript into code variable.
  var code = '"'+dropdown_trackers+'"';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

//// ADITIONAL FUNCTION TO LOAD THE TRACKERS ////
function loadTrackers(){
  if(trackerlist.length == 0){ 
    let trackers = TrackerStore.getAsArray() ;
    let alltrackers = [];
  for (var i = 0; i < trackers.length; i++) { 
    alltrackers.push([trackers[i].emoji +trackers[i].label,trackers[i].tag]) }
  return alltrackers;}
  else {return trackerlist}
  }

import Blockly from 'blockly/core.js';
import Interpreter from 'js-interpreter';
import { TrackerStore } from "../../../../../store/tracker-store";

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly block to select day (today/yesterday) instead of specific date
 *
 * See https://neil.fraser.name/software/JS-Interpreter/docs.html
 */




Blockly.defineBlocksWithJsonArray([
  {
    "type": "s4e_daypicker",
    "message0": "Day %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "Day",
        "options": [
          [
            "Today",
            "today"
          ],
          [
            "Yesterday",
            "yesterday"
          ]
        ]
      }
    ],
    "output": "Day",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]);

/**
 * DAY BLOCK code
 */
 Blockly.JavaScript['s4e_daypicker'] = function(block) {
  var dropdown_day = block.getFieldValue('Day');
  // TODO: Assemble JavaScript into code variable.
  //var code = '"'+dropdown_day+'"';
  var code = 'getdate("'+dropdown_day+'",loop)';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

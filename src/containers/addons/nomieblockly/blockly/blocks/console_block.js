import Blockly from 'blockly/core.js';
import Interpreter from 'js-interpreter';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Example "display" block that will display results in the blockly addon console. 
 *
 */

 Blockly.defineBlocksWithJsonArray([{
  "type": "pushto_console",
  "message0": "Push to Console %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "Value",
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 160,
  "tooltip": "",
  "helpUrl": ""
  }]);

  /**
 * Generator for wait block creates call to new method
 * <code>waitForSeconds()</code>.
 */

   Blockly.JavaScript['pushto_console'] = function(block) {
    var value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'alert('+value_value+');';
    return code;
  };

  //export function initInterpreterPushtoConsole(interpreter, globalObject) {
  //  // Ensure function name does not conflict with variable names.
  //  Blockly.JavaScript.addReservedWords('pushtoConsole');
  //
  //  var wrapper = 
  //      function(txttoconsole) { 
  //      console.log(txttoconsole)
  //    };

  //  interpreter.setProperty(globalObject, 'pushtoConsole', wrapper);
  //  }

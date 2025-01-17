import Blockly from 'blockly/core.js';
import Interpreter from 'js-interpreter';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview HTTP request Blockly to fetch data frok api's 
 *
 */

 Blockly.defineBlocksWithJsonArray([{
  "type": "s4e_httprequest",
  "message0": "Fetch data from following API %1 API %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "Value",
      "check": "String"
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
}]);

  /**
 * Generator for wait block creates call to new method
 */

   Blockly.JavaScript['s4e_httprequest'] = function(block) {
    var value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'httpRequest('+value_value+')';
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  export function initInterpreterHttpRequest(interpreter, globalObject) {
    // Ensure function name does not conflict with variable names.
    Blockly.JavaScript.addReservedWords('httpRequest');
  
    var wrapper = interpreter.createAsyncFunction(
      function(input,callback) { 
        let xhr = new XMLHttpRequest();
        xhr.open('GET', input, false);
        try {
          xhr.send();
          if (xhr.status != 200) {
            callback(interpreter.createPrimitive(`Error ${xhr.status}: ${xhr.statusText}`));
            //return(`Error ${xhr.status}: ${xhr.statusText}`);
          } else {
            callback(interpreter.createPrimitive(xhr.response));
            //return(xhr.response);
          }
        } catch(err) { // instead of onerror
          callback(interpreter.createPrimitive("Request failed"));
          //return("Request failed");
        }
    }
  );

    interpreter.setProperty(globalObject, 'httpRequest', wrapper);
    }



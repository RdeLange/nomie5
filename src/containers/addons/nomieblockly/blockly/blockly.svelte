<script lang="ts">
	import Blockly from 'blockly/core.js';
	import En from 'blockly/msg/en.js';
	import De from 'blockly/msg/de.js';
	import 'blockly/blocks.js';
	import 'blockly/javascript.js';
	import 'blockly/javascript_compressed.js';
	import '@blockly/field-date';
	//import { ntoolbox }  from './nomie_toolbox_OLD.svelte';
	import BlocklyComponent, { Locale, Transform } from 'svelte-blockly';
	import { onMount } from 'svelte';
	import { Interact } from "../../../../store/interact";
    import darkTheme from "@blockly/theme-dark";
	import appconfig from "../../../../config/appConfig";
	import { TrackerStore } from "../../../../store/tracker-store";
    //import { getDailyTrackerValue, getData } from './nomie_blockly_functions.svelte';
    //import { loadBlocks } from './nomie_blocks_OLD.svelte';
	import Interpreter from 'js-interpreter';
	import { ntoolbox } from './toolbox.svelte';
	import { initInterpreterWaitForSeconds } from './blocks/wait_block';
	import { initInterpreterGetPromise } from './blocks/test_block';
	import { initInterpreterFetchDayValue } from './blocks/dayvalue_block';
	import { initInterpreterLogValue } from './blocks/logvalue_block';
	import { initInterpreterHttpRequest} from './blocks/httprequest_block';
	import './blocks/console_block';
	import './blocks/weblogconsole_block';
	import './blocks/datepicker_block';
	import './blocks/trackerpicker_block';
	import './blocks/daypicker_block';
	import './blocks/statspicker_block';
	import './blocks/display_block';
	import './blocks/mainwrapper_block';
	import './blocks/httprequest_block';
	import './blocks/objects_blocks';
    
    export let activetransformation: { scrollX: number; scrollY: number; scale: number; };
	export let activeworkspace: string;
	export let code = "Meaning_of_Life=42;";
    export let buttonpushed = false;
	export let consoleoutput: string;


	let background = localStorage.getItem(appconfig.theme_key);
    let theme = null;
	let trackerlist = [];
    let lastbuttonpushed = buttonpushed;
    let coderunning = false;

	$: if(buttonpushed !== lastbuttonpushed){
        if(buttonpushed == true && coderunning == false){
            runCode(code,new Date(),new Date(),false);
        }
        lastbuttonpushed = buttonpushed;
    }

	$: if(background == "dark") {
        config.theme = darkTheme;}
     else {config.theme = null}
  
	////start new code

	//interpreter prep start
    var test = initInterpreterWaitForSeconds;
	var test2 = initInterpreterGetPromise;
	var import_initInterpreterFetchDayValue = initInterpreterFetchDayValue;
	var import_initInterpreterLogValue  = initInterpreterLogValue ;
	var import_initInterpreterHttpRequest = initInterpreterHttpRequest;
    var myInterpreter = null;
    var runner;
	let runButton = {disabled:'enabled'};
	let schedule_startdate = new Date();
	let schedule_enddate = new Date();
	let schedule_active = false;
	
    //interpreter prep end
	
	const en: Locale = {
		rtl: false,
		msg: {
			CAT_LOGIC: 'Logic',
			CAT_LOOPS: 'Loops',
			CAT_MATH: 'Math',
			CAT_LISTS: 'Lists',
			CAT_VARIABLES: 'Variables',
			CAT_FUNCTIONS: 'Functions',
			CAT_TEXT: 'Text',
			...En,
		},
	};
	const de: Locale = {
		rtl: false,
		msg: {
			CAT_LOGIC: 'Logik',
			CAT_LOOPS: 'Schleifen',
			CAT_MATH: 'Mathe',
			CAT_LISTS: 'Listen',
			CAT_VARIABLES: 'Variablen',
			CAT_FUNCTIONS: 'Funktionen',
			CAT_TEXT: 'Text',
			...De,
		},
	};
	const locales: Record<string, Locale> = { en, de };
	const toolbox: Blockly.utils.toolbox.ToolboxDefinition = ntoolbox;

	var config = {
		toolbox,
		toolboxPosition: 'end',
        horizontalLayout: true,
		move: {
			scrollbars: false,
			drag: true,
			wheel: false,
		},
		zoom: {
			controls: true,
			wheel: true,
			maxScale: 1.5,
			minScale: 0.4,
			scaleSpeed: 1.02,
			startScale: 0.8,
		},
		grid: {
			spacing: 20,
			length: 3,
			colour: '#ccc',
			snap: true,
		},
		trashcan: true,
		theme: theme,
	};
	let showparams = false;
	let locale = 'en';
	let transform: Transform;
	let workspace: Blockly.WorkspaceSvg;
	let saved: [string, Transform] | undefined = undefined;
	//let code = '';

	function initWorkspace(){
		if(background == "dark") {
        config.theme = darkTheme;}
     else {config.theme = null}
		if(activeworkspace !=""){
	Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(activeworkspace), workspace);
	transform = activetransformation;}}

	function handleSave() {
		const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
		saved = [xml, transform];
	}
	function handleRestore() {
		Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(saved[0]), workspace);
		transform = saved[1];
	}
	function onChange() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		activeworkspace = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
		activetransformation = transform;
		const lang = (Blockly as any)['JavaScript'];
		try {
			code = lang.workspaceToCode(workspace);
			generateCodeAndLoadIntoInterpreter();
		} catch (_err) {
			// Happens e.g. when deleting a function that is used somewhere.
			// Blockly will quickly recover from this, so it's not a big deal.
			// Just make sure the app doesn't crash until then.
		}
	}


    // JS-INTERPRETER CODE START
    // ===================================================================================


	let outputArea = {value:""};

function initApi(interpreter, globalObject) {
  // Add an API function for the alert() block, generated for "text_print" blocks.
   var wrapper = function(text) {
    text = text ? text.toString() : '';
    outputArea.value = outputArea.value + '\n' + text;
	consoleoutput = consoleoutput + '\n' + text;
  };
  interpreter.setProperty(globalObject, 'alert',
      interpreter.createNativeFunction(wrapper));
  
  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(globalObject, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the consolelog() function.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    console.log(text);
  };
  interpreter.setProperty(globalObject, 'consolelog',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the s4eprompt window.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    Interact.alert("Message", text);
  };
  interpreter.setProperty(globalObject, 'display',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for determine the absolute date to take into account.
  var wrapper = function(daypicked,date) {
	
    	if (daypicked == "today") {
      		let newdate = new Date(date); 
      		newdate.setDate(newdate.getDate());
      		return newdate.toISOString().slice(0, 10);} 
      	else {
        	let newdate = new Date(date);
        	newdate.setDate(newdate.getDate() - 1);
        	return newdate.toISOString().slice(0, 10);};
  };
  
  interpreter.setProperty(globalObject, 'getdate',
      interpreter.createNativeFunction(wrapper));
    
// Add an API function to validate if runcode is triggered by automated scheduler
var wrapper = function() {
    return schedule_active;
  };
  interpreter.setProperty(globalObject, 'scheduler_activated',
      interpreter.createNativeFunction(wrapper));	  	  
    
// Add an API function to validate startdate if runcode is triggered by automated scheduler
var wrapper = function() {
    return schedule_startdate;
  };
  interpreter.setProperty(globalObject, 'scheduler_start',
      interpreter.createNativeFunction(wrapper));
	  
// Add an API function to validate enddate if runcode is triggered by automated scheduler
var wrapper = function() {
    return schedule_enddate;
  };
  interpreter.setProperty(globalObject, 'scheduler_end',
      interpreter.createNativeFunction(wrapper));	  
    	  

  // Add an API for the wait block.  See wait_block.js
  test(interpreter, globalObject);
  
  // Add an API for the getPromise block.  See test_block.js
  test2(interpreter, globalObject);

  // Add an API for the dayvalue block.
  import_initInterpreterFetchDayValue(interpreter, globalObject);

  // Add an API for the logvalue block.
  import_initInterpreterLogValue(interpreter, globalObject);
  
  // Add an API for the logvalue block.
  import_initInterpreterHttpRequest(interpreter, globalObject);
  
  
  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(globalObject, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
}

var highlightPause = false;

function highlightBlock(id) {
  workspace.highlightBlock(id);
  highlightPause = true;
}

function resetStepUi(clearOutput) {
  workspace.highlightBlock(null);
  highlightPause = false;
  runButton.disabled = '';
  coderunning = false;

  if (clearOutput) {
    outputArea.value = 'Program output:\n=================';
	consoleoutput = 'Program output:\n=================';

  }
}

function generateCodeAndLoadIntoInterpreter() {
  // Generate JavaScript code and parse it.
  
  const lang = (Blockly as any)['JavaScript'];
  lang.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  lang.addReservedWords('highlightBlock');
  //console.log(lcode);
  
  resetStepUi(true);
}

function resetInterpreter() {
  myInterpreter = null;
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
}

function runCode(codetorun,start,end,active) {

	if (typeof start == "undefined") {schedule_startdate = new Date()}
	else {schedule_startdate = start}
	if (typeof end == "undefined") {schedule_enddate = new Date()}
	else {schedule_enddate = end}
	if (typeof active == "undefined") {schedule_active = false}
	else {schedule_active = true}
	
	//schedule_startdate = new Date("2022-01-03");
	//schedule_enddate = new Date("2022-01-08");
	//schedule_active = true;
	
  if (!myInterpreter) {
    // First statement of this code.
    // Clear the program output.
    resetStepUi(true);
    runButton.disabled = 'disabled';
    coderunning = true;

    // And then show generated code in an alert.
    // In a timeout to allow the outputArea.value to reset first.
    setTimeout(function() {
      //alert('Ready to execute the following code\n' +
      //  '===================================\n' +
      //  code);

      // Begin execution
      highlightPause = false;
      myInterpreter = new Interpreter(codetorun, initApi);
      runner = function() {
        if (myInterpreter) {
          var hasMore = myInterpreter.run();
          if (hasMore) {
            // Execution is currently blocked by some async call.
            // Try again later.
            setTimeout(runner, 10);
          } else {
            // Program is complete.
            outputArea.value += '\n\n<< Program complete >>';
			consoleoutput += '\n\n<< Program complete >>';
            resetInterpreter();
            resetStepUi(false);
          }
        }
      };
      runner();
    }, 1);
    return;
  }
}   
    // ===================================================================================
    // JS-INTERPRETER CODE END

	onMount(() => {
    	initWorkspace();
  });
</script>

<main>
	{#if showparams}
		<div>
			<h1>Config</h1>
			<div>
				<select bind:value={locale}>
					{#each Object.keys(locales) as locale}
						<option value={locale}>{locale}</option>
					{/each}
				</select>
				<button on:click={handleSave}>Save Editor</button>
				<button on:click={handleRestore} disabled={saved === undefined}>Restore Editor</button>
                <button on:click={runCode} disabled={runButton.disabled === 'disabled'}>Run Code</button>
			</div>
			<h2>Current JS Code & Transform</h2>
			<p>{JSON.stringify(transform)}</p>
			<pre>{code}</pre>
            <h2>INTERPRETER</h2>
		    <pre>{outputArea.value}</pre>
			<h2>Saved Blockly XML & transform</h2>
			{#if saved !== undefined}
				<p>{JSON.stringify(saved[1])}</p>
				<pre>{saved[0]}</pre>
			{:else}
				<p>(none)</p>
			{/if}
		</div>
	{/if}
	<div>
		<div class="blockly-container">
			<BlocklyComponent
				{config}
				locale={locales[locale]}
				bind:workspace
				bind:transform
				on:change={onChange}
			/>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
	}
	main > div {
		width: 100%;
		padding: 0;
	}
	.blockly-container {
		height: 63vh;
		max-height: 70vh;
		/* height: 420px;*/
		border: 1px solid black;
	}

	pre {
		overflow-x: auto;
	}
</style>

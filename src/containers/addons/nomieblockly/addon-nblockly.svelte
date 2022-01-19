<script lang="ts">
  // Components
  import { onMount } from 'svelte';
  import Modal from "../../../components/modal/modal.svelte";
  import NToolbar from "../../../components/toolbar/toolbar.svelte";
  import NIcon from "../../../components/icon/icon.svelte";
  import NToolbarGrid from "../../../components/toolbar/toolbar-grid.svelte";
  import ButtonGroup from "../../../components/button-group/button-group.svelte";
  import Text from "../../../components/text/text.svelte";
  //import SvgIcon from '../../components/icon/SvgIcon.svelte';
  import { Interact } from "../../../store/interact";
  import { Lang } from "../../../store/lang";
  import Button from "../../../components/button/button.svelte";
  //import { addonCatalogue } from "../containers/addons/addonCatalogue";
  import Dymoji from "../../../components/dymoji/dymoji.svelte";
  import tick from "../../../utils/tick/tick";
  import { AddonsStore } from "../../../store/addons-store";
  import Addon from "../../../modules/addon/addon";
  import BlocklyList from "./nblockly-list.svelte";
  import Input from "../../../components/input/input.svelte";
  import Divider from "../../../components/divider/divider.svelte";
  import ListItem from "../../../components/list-item/list-item.svelte";
  import ToggleSwitch from "../../../components/toggle-switch/toggle-switch.svelte";
  import Nblockly from "./blockly/blockly.svelte";
  import nid from "../../../modules/nid/nid";
  import snakeCase from "../../../utils/snake-case/snake-case";
  import { runCode }  from "./blockly/nomie_blockly_executer.svelte";
  import DateTimeBar from "./blockly-date-time-bar.svelte";
  import dayjs from "dayjs"; 
  import DateRangeSelect from "../../../components/date-range-select/DateRangeSelect.js";
  import { writable } from 'svelte/store';
  import { ExecuterConsole, SingleExecuterConsole, ExecuterRunning } from './blockly/nomie_blockly_executer.svelte';
  
  
	let tempxml = '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="Id^|ebDg)v~9]7OwAH0/">Meaning of Life</variable></variables><block type="variables_set" id="jq;8i6!`[5_Yur!a=RAA" x="-170" y="10"><field name="VAR" id="Id^|ebDg)v~9]7OwAH0/">Meaning of Life</field><value name="VALUE"><block type="math_arithmetic" id="o6xW$V!JjL?sI=ovZpf7"><field name="OP">ADD</field><value name="A"><block type="math_number" id="R9u3Hf3GKpCy))d_`V)y"><field name="NUM">40</field></block></value><value name="B"><block type="math_number" id=";hL)Id6A51S(.@IM$`3J"><field name="NUM">2</field></block></value></block></value></block></xml>';
  let temptransform = {"scrollX":148.5,"scrollY":208,"scale":0.8};
  let tempjscode = "Meaning-of_Life=42;";

  let domVisible = false; 
  let activeAddon;
  let activeAddonChanged = false;
  let lastActiveAddonKey;
  let BlocklyArray =[{id:nid(),blocklyname:"example",displayName:"Example",active:true,schedule:"daily",latestrun:new Date().getTime(),workspaceBlocks:tempxml,workspacePosition:temptransform,jscode:tempjscode,description:"This is an example as there are no workspaces defined"}];
  let activeBlocklyIndex = 0;
  let lastActiveBlocklyIndex = 0;
  let activeBlockly = {id:nid(),blocklyname:"example",displayName:"Example",active:true,schedule:"daily",latestrun:new Date().getTime(),workspaceBlocks:tempxml,workspacePosition:temptransform,jscode:tempjscode,description:"This is an example as there are no workspaces defined"};
  let listdata = ["testa", "testb", "testc", "testc"];
  let workspacesexisting = false;
  let activeIndexrefreshed = true;
  let selected = false;
  let buttonpushed = false;
  let showconsole = false;
  let showconsole2 = true;
  let showmanualrun = false;
  let consoleoutput = "";
  let singleconsoleoutput = "";
  let scheduleenddate = new Date().getTime();
  let schedulestartdate = new Date().getTime();
  let executionrunning = false;

  ExecuterConsole.subscribe(value => {
		consoleoutput = value;
	});
  SingleExecuterConsole.subscribe(value => {
		singleconsoleoutput = value;
	});

  ExecuterRunning.subscribe(value => {
		executionrunning = value;
	});

  $: if(executionrunning || !executionrunning){
    if (executionrunning == true){
    console.log("execution started")}
    else {console.log("execution stopped")}
  }
  
  $: if(BlocklyArray) {
    let list = [];
    let i = 0;
    for (i = 0; i < BlocklyArray.length; i++) { 
      list.push(BlocklyArray[i].displayName); }
    listdata = list;  
    if(BlocklyArray.length > 0) {
      workspacesexisting = true;}
    else {workspacesexisting = false;
    activeBlockly = {id:nid(),blocklyname:"example",displayName:"Example",active:true,schedule:"daily",latestrun:new Date().getTime(),workspaceBlocks:tempxml,workspacePosition:temptransform,jscode:tempjscode,description:"This is an example as there are no workspaces defined"};
  } 
  
  }

  $: if(activeAddon) {
    activeAddonChanged = true}

  $: if(activeBlocklyIndex !== lastActiveBlocklyIndex){
      activeBlockly = BlocklyArray[activeBlocklyIndex]
      lastActiveBlocklyIndex=activeBlocklyIndex; 
      workspacesexisting = true;
      scheduleenddate = new Date().getTime();
      //schedulestartdate = activeBlockly.latestrun+((3600 * 1000 * 24));
      activeIndexrefreshed = false;
      setTimeout(()=>{activeIndexrefreshed = true}, 3);
  }
  
  $: if (
    $Interact.addons.active &&
    lastActiveAddonKey !== $Interact.addons.active)
     {
    lastActiveAddonKey = $Interact.addons.active;
    domVisible = true;
    activeAddon = new Addon($AddonsStore.addons[$Interact.addons.active]);
    activeAddonChanged = false;
    BlocklyArray = activeAddon.configuration.workspaces;
    if(BlocklyArray.length > 0) {
      workspacesexisting = true;}
    else {workspacesexisting = false;} 
  }


  const state = {
      view: "main",
    };
  
  const bstate = {
      view: "parameters",
    };

  
  function updateArray(index) {
    let list = [];
    let i = 0;
    for (i = 0; i < BlocklyArray.length; i++) { 
      list.push(BlocklyArray[i].displayName); }
    listdata = list;  
    activeBlocklyIndex = index;
    activeBlockly = BlocklyArray[activeBlocklyIndex];
    if(BlocklyArray.length > 0) {
      workspacesexisting = true;}
    else {workspacesexisting = false;
    activeBlockly = {id:nid(),blocklyname:"example",displayName:"Example",active:true,schedule:"daily",latestrun:new Date().getTime(),workspaceBlocks:tempxml,workspacePosition:temptransform,jscode:tempjscode,description:"This is an example as there are no workspaces defined"};
  } 
  }

  async function close() {
    domVisible = false;
    await tick(200);
    Interact.addon(null,null);
  }

  async function changeView(view) {
    ExecuterConsole.set("");
    state.view = view;
  }

  async function switchBview() {
    if (bstate.view == "parameters") {
      bstate.view = "workspace"}
    else {bstate.view = "parameters";
      showconsole = false;
    }
    
  }


  function executeCode(){
    if (bstate.view !== "parameters"){
    buttonpushed = true;
      setTimeout(()=>{buttonpushed = false}, 3);}
    else{
    runCode(activeBlockly.jscode,new Date(),new Date(),false);
  }
  }

  function switchConsoleView(){
    if (bstate.view !== "dummy"){
    if (showconsole == true){
      showconsole = false;
    }
    else {showconsole = true}}
  }

  function switchConsole2View(){
    if (bstate.view !== "dummy"){
    if (showconsole2 == true){
      showconsole2 = false;
    }
    else {showconsole2 = true}}
  }

  function switchManualRunView(){
    
    if (showmanualrun == true){
      showmanualrun = false;
    }
    else {showmanualrun = true;
    }
  }
  
  async function deleteActiveWorkspace(){
    let confirmed = await Interact.confirm(
      `Remove Blockly Workspace?`,
      "This will delete the current Blockly Workspace."
    );
    if (confirmed) {
    /////////start after confirmed deletion//////
    let targetArrayWorkspace =  BlocklyArray.findIndex((t) => t.id == activeBlockly.id);
    BlocklyArray.splice(targetArrayWorkspace,1);
    saveActiveAddon(false);
    Interact.toast("Workspace Deleted");
    updateArray(0);
  }}

  async function addWorkspace(){
    const toWorkspacename = (workspacename) => {
      workspacename = workspacename.trim();
      workspacename = snakeCase(workspacename);
      return workspacename.toLowerCase();
    };
    try {
      let workspacename = String(await Interact.prompt("Create New Blockly Workspace","Please provide a name for your new Blockly Workspace"));
      if (workspacename) {
        let newworkspace = {id:nid(),blocklyname:toWorkspacename(workspacename).toLowerCase(),displayName:workspacename.charAt(0).toUpperCase() + workspacename.slice(1),active:false,blockly:"daily",workspaceBlocks:"",workspacePosition:{"scrollX":148.5,"scrollY":208,"scale":0.8},jscode:"",description:"No description available yet"};
        activeAddon.configuration.workspaces.push(newworkspace);
        saveActiveAddon(false);
        Interact.toast("New Workspace Created");
        updateArray(BlocklyArray.length-1)
      }
    } catch (e) {
      Interact.alert("Error", e.message);
  }}
  
  function saveActiveWorkspace(){
    let targetWorkspace =  activeAddon.configuration.workspaces.findIndex((t) => t.id == activeBlockly.id);
    if (targetWorkspace !== -1) {
      activeAddon.configuration.workspaces[targetWorkspace]= activeBlockly;
      saveActiveAddon(true)
    } else {
      console.log("NOT FOUND!");
  }}

  async function saveActiveAddon(showtoast=true) {
    if (showtoast) {
    try {
      await AddonsStore.saveAddon(activeAddon);
      activeAddonChanged = false;
      Interact.toast("Saved");
    } catch (e) {
      Interact.alert("Error", e.message);
    }}
    else {await AddonsStore.saveAddon(activeAddon);
      activeAddonChanged = false;}
  }

  async function runSchedule(id:string){
    
    // as we want to make this function independend from active blockly for global use, we have the blockly_id as variable.
    // let's first load the complete blockly addon dataset, including the blockly workspaces
    let blocklyaddon = {};
    blocklyaddon = AddonsStore.get("nblockly");
    //now let's load the specific workspace
    let wspace_id = blocklyaddon.configuration.workspaces.findIndex((t) => t.id == id);
    let wspace = blocklyaddon.configuration.workspaces[wspace_id];
    let jscode = wspace.jscode;
    runCode(jscode,schedulestartdate,scheduleenddate,true);
    Interact.toast("Run Schedule Started");
}

function runBlocklyScheduler(){
ExecuterConsole.set("");
consoleoutput = "";
console.log("Scheduler Started")
let blocklyaddon = {};
blocklyaddon = AddonsStore.get("nblockly");
let wspaces = blocklyaddon.configuration.workspaces;

for (var i = 0; i < wspaces.length; i++) {
  let jscode = wspaces[i].jscode;
  let blastrundate = wspaces[i].latestrun;
  let lastrundate = new Date();
  if (blastrundate == undefined) {lastrundate =new Date("2022-01-01")}
  else {lastrundate = new Date(blastrundate)}
  let enddate = new Date();
  enddate.setDate(enddate.getDate() - 1);
  let startsingle = function() {
    if (executionrunning) {
      // Execution is currently bussy.
      // Try again later.
      setTimeout(startsingle, 10);
    } else {
      // execute and queue next execution
      let result = runCode(jscode,lastrundate,enddate,true);
      /// save lastrundate
      
      //wspaces[i].latestrun = new Date();
      //blocklyaddon.configuration.workspaces[i]  = wspaces[i];
      //AddonsStore.saveAddon(blocklyaddon);

    }
  }
  startsingle() 
  wspaces[i].latestrun = new Date();
  blocklyaddon.configuration.workspaces[i]  = wspaces[i];
  AddonsStore.saveAddon(blocklyaddon); }
  blocklyaddon.configuration.lastcentralschedule = new Date();
  if (blocklyaddon.configuration.centralscheduleslist !== undefined) {blocklyaddon.configuration.centralscheduleslist += "Schedule Finished on "+ String(new Date())+"\n"}
  else {blocklyaddon.configuration.centralscheduleslist = "Schedule Finished on "+ String(new Date())+"\n"}
  AddonsStore.saveAddon(blocklyaddon);
  Interact.toast("Scheduler Finished");
  }

function runShowValidSchedules(){
ExecuterConsole.set("");
consoleoutput = "";
let overview = "OVERVIEW OF WORKSPACES WITH VALID SCHEDULES\n";
  overview += "===========================================\n\n";
console.log("Show Valid Schedules Started")
let blocklyaddon = {};
blocklyaddon = AddonsStore.get("nblockly");
let wspaces = blocklyaddon.configuration.workspaces;

for (var i = 0; i < wspaces.length; i++) {
  let jscode = wspaces[i].jscode;
  if (jscode.includes('s4eblocklyframe = "activated"') && !jscode.includes('var schedule = "none"')){
    overview += "Workspace: "+wspaces[i].displayName+" ==> VALID SCHEDULE\n";
  }
  else {overview += "Workspace: "+wspaces[i].displayName+" ==> NON VALID SCHEDULE\n";}
}
ExecuterConsole.set(overview);
}

function showexecutedschedules(){
  let blocklyaddon = {};
  blocklyaddon = AddonsStore.get("nblockly");
  let schedulesexecuted = "OVERVIEW OF EXECUTED SCHEDULES\n";
  schedulesexecuted += "==============================\n\n";
  schedulesexecuted += blocklyaddon.configuration.centralscheduleslist;
  ExecuterConsole.set(schedulesexecuted);

}

  function updateDate(evt){
   activeBlockly.latestrun = new Date(evt).getTime();
  }

  function updateDate2(evt){
   activeAddon.configuration.lastcentralschedule = new Date(evt).getTime();
   AddonsStore.saveAddon(activeAddon)
   ;
  }

  function updateStartDate(evt){
   schedulestartdate = new Date(evt).getTime();
  }

  function updateEndDate(evt){
   scheduleenddate = new Date(evt).getTime();
  }

  onMount(() => {
    if (workspacesexisting) {
    activeBlockly = BlocklyArray[activeBlocklyIndex];}
  });
</script>

<style lang="scss">
  
  :global(.person-checkin .btn-group .active div) {
    font-size: 2em !important;
  }
</style>
<Modal className="addon-modal" bodyClass="bg-bg" show={domVisible} type="bottom-slideup-blockly" ariaLabel="Addon-Template">

  <header class="w-100" slot="header" on:swipedown={close}>
    <NToolbarGrid>
      <div slot="left">
        <Button icon on:click={close}>
          <NIcon name="close" className="fill-primary-bright" />
        </Button>
      </div>
      <div class="main">
        <div class="n-row">
          <Dymoji addon={activeAddon} size={26} radius={0.3} color={activeAddon.addoncolor}/>
          &nbsp; {activeAddon.getDisplayName()}
         
        </div>
      </div>
      
    </NToolbarGrid>
    <NToolbar>
      <ButtonGroup
        size="sm"
        buttons={[{ label: 'Main', active: state.view === 'main', click() {
              changeView('main');
            } }, { label: 'Configuration', active: state.view === 'configuration', click() {
              changeView('configuration');
            } }, { label: 'Documentation', active: state.view === 'documentation', click() {
              changeView('documentation');
            } }]} />
    </NToolbar>
  </header>
  <main>
    {#if state.view == 'main'}
    <Text center={true} bold={true}>BLOCKLY WORKSPACE MANAGER</Text>
      
      <div class="n-toolbar-grid" vertical-align="middle">
        <div width=10%>
          <Button disabled={!workspacesexisting} icon on:click={() => executeCode()} style="top:20%;">
            <NIcon name="play" className="fill-green" size="40"/>
          </Button>
        </div>
        <div width=80%>
          <Input disabled={!workspacesexisting} bind:value={activeBlocklyIndex} type="select" placeholder="Select Blockly" style="max-width:95%;">
            {#each listdata as item, index}
            <option value={index}>{item}</option>
            {/each}
            </Input>
        </div>
        <div width=10% align="right">
          <Button icon on:click={switchBview} style="top:20%;">
            {#if bstate.view == 'parameters'}
              <NIcon name="puzzle" className="fill-primary-bright" size="39"/>
            {:else}  
              <NIcon name="settings" className="fill-primary-bright" size="39"/>
            {/if}  
          </Button>
        </div>
      </div>
      
      {#if !showconsole}
      <Text center={true} on:click={switchConsoleView}>-▽-</Text>
      {/if}
      {#if showconsole}
      <Text center={true} on:click={switchConsoleView}>-△-</Text>
      <Input rows = {4} disabled={true} type="textarea" placeholder="Output Console" style="max-width:90%; margin-left:5%; font-size:8px;" value={singleconsoleoutput}/>
      {/if}
      {#if bstate.view == 'parameters'}
      <Input bind:value={activeBlockly.displayName}
                type="text"
                placeholder="Blockly Name"
                style="max-width:90%; margin-left:5%"
                disabled={!workspacesexisting}>
             </Input>
      <Input disabled={!workspacesexisting} type="textarea" placeholder="Description" style="max-width:90%; margin-left:5%" bind:value={activeBlockly.description} /> 
      <Divider center pad={true}/>
      <Text center={true}>Last time automated WORKSPACE schedule executed:</Text>
      <ListItem solo style="margin:0 auto; width:90%;"> 
        <DateTimeBar style="max-width:100%;" title="<= Adjust" large={true} date={activeBlockly.latestrun} on:change={(evt) => {updateDate(evt.detail)}}/>
        </ListItem>
        {#if !showmanualrun}
        <Text center={true} on:click={switchManualRunView}>.</Text>
        <Text center={true} on:click={switchManualRunView}>--Single manual-▽-iterated Run--</Text>
        {/if}
        {#if showmanualrun}
        <Text center={true} on:click={switchManualRunView}>.</Text>
        <Text center={true} on:click={switchManualRunView}>--Single manual-△-iterated Run--</Text>
        <Divider center pad={true}></Divider>
        <NToolbarGrid style="width:80%; margin:0 auto;">
          <div slot="left">
            <ListItem solo style="margin:auto; width:90%; display:block;"> 
              <Text size="sm">Start</Text>
              <DateTimeBar title="Testing" style="max-width:100%;" large={false} date={schedulestartdate} on:change={(evt) => {updateStartDate(evt.detail)}}/>
              </ListItem>
          </div>
          <div class="main">
            <div class="n-row">
              <Button disabled={!workspacesexisting} icon color="clear" on:click={() => runSchedule(activeBlockly.id)} style="top:0px; left: 0px">
                <NIcon name="fastforward" size="34"/>
              </Button>
              </div>
          </div>
          <div slot="right">
            <ListItem solo style="margin:auto; width:90%; display:block;">
              <Text size="sm">End</Text>
              <DateTimeBar style="max-width:100%;" title=" End" large={false} date={scheduleenddate} on:change={(evt) => {updateEndDate(evt.detail)}}/>
            </ListItem>
          </div>
        </NToolbarGrid>{/if}
        <Divider center pad={true}/>
      <NToolbarGrid style="width:70%; margin:0 auto;">
        <div slot="left">
          <Button block  disabled={!workspacesexisting} style="max-width:100%; background-color:var(--color-red)" on:click={deleteActiveWorkspace}>
            Delete
          </Button>
        </div>
        <div class="main">
          <div class="n-row">
            <Button block  disabled={!workspacesexisting} style="max-width:100%; background-color:var(--color-primary)" on:click={saveActiveWorkspace}>
              Save
            </Button>
          </div>
        </div>
        <div slot="right">
          <Button block style="max-width:100%; background-color:var(--color-primary)" on:click={addWorkspace}>
            New
          </Button>
        </div>
      </NToolbarGrid>
      
      {:else if bstate.view == 'workspace'}
      {#if activeIndexrefreshed}
      <Nblockly bind:consoleoutput={singleconsoleoutput} buttonpushed={buttonpushed} bind:activeworkspace={activeBlockly.workspaceBlocks} bind:activetransformation={activeBlockly.workspacePosition} bind:code={activeBlockly.jscode}></Nblockly>
      {/if}
      {/if}
    {:else if state.view == 'configuration'}
       <Text center={true} bold={true}>CONFIGURE SCHEDULER</Text>
       <Divider center pad={false}></Divider>
       
       <ListItem 
        solo 
        style="margin:auto; width:90%; display:block; padding:5px;"
        className="py-2"
        title="Start Scheduler Manual"
        description="Execute the central scheduler">
        <div slot="right" class="pl-2">
          <Button block style="max-width:100%; background-color:var(--color-primary)" on:click={runBlocklyScheduler}>
            Run
          </Button>
        </div>
  </ListItem>
  <Divider center pad={true}></Divider>
  <ListItem 
        solo 
        style="margin:auto; width:90%; display:block; padding:5px;"
        className="py-2"
        title="Valid Schedules"
        description="Overview of Workspaces with valid schedule">
        <div slot="right" class="pl-2">
          <Button block style="max-width:100%; background-color:var(--color-primary)" on:click={runShowValidSchedules}>
            Show
          </Button>
        </div>
  </ListItem>
  <Divider center pad={true}></Divider>
  <ListItem 
        solo 
        style="margin:auto; width:90%; display:block; padding:5px;"
        className="py-2"
        title="Schedules executed"
        description="Overview of executed schedules">
        <div slot="right" class="pl-2">
          <Button block style="max-width:100%; background-color:var(--color-primary)" on:click={showexecutedschedules}>
            Show
          </Button>
        </div>
  </ListItem>
  <Divider center pad={true}></Divider>
  <Text center={true}>Last time automated CENTRAL schedule executed:</Text>
      <ListItem solo style="margin:0 auto; width:90%;"> 
        <DateTimeBar style="max-width:100%;" title="<= Adjust" large={true} date={activeAddon.configuration.lastcentralschedule } on:change={(evt) => {updateDate2(evt.detail)}}/>
        </ListItem>
  {#if !showconsole2}
      <Text center={true} on:click={switchConsole2View}>-▽-</Text>
      {/if}
      {#if showconsole2}
      <Text center={true} on:click={switchConsole2View}>-△-</Text>
      <Input rows = {16} disabled={true} type="textarea" placeholder="Output Console" style="max-width:90%; margin-left:5%; font-size:8px;" bind:value={consoleoutput}/>
      {/if}
    {:else if state.view == 'documentation'}
      <Text center={true} bold={true}>NOMIE SCHEDULER DOCUMENTATION</Text>
    {/if}
  </main>

</Modal>

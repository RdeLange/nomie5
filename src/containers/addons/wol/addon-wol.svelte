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
  import Button from "../../../components/button/button.svelte";
  import Icon from "../../../components/icon/icon.svelte";
  //import { addonCatalogue } from "../containers/addons/addonCatalogue";
  import Dymoji from "../../../components/dymoji/dymoji.svelte";
  import tick from "../../../utils/tick/tick";
  import { AddonsStore } from "../../../store/addons-store";
  import Addon from "../../../modules/addon/addon";
  import Wol from "./wol.svelte";
  import WolSlider from "./wolslider.svelte";
  import NInput from "../../../components/input/input.svelte";
  import Divider from "../../../components/divider/divider.svelte";
  import WolCardList from "./wol-card-list.svelte";
  import CardEditor from "./wol-card-editor.svelte";
  import { Lang } from "../../../store/lang";
  import { Wolcnf, Calculation } from "./wolconfiguration";
  import { timeFrames } from "../../../containers/dashboard/timeFrames";
  import ListItem from "../../../components/list-item/list-item.svelte";
  import ToggleSwitch from "../../../components/toggle-switch/toggle-switch.svelte";
  import StatsProcessor from "../../../modules/stats/statsV5";
  import { LedgerStore } from "../../../store/ledger.js";
  import { UserStore } from "../../../store/user-store";
  import dayjs from "dayjs"; 
  
  
  let domVisible = false;
  let activeAddon;
  let activeAddonSaved;
  let activeAddonChanged = false;
  let lastActiveAddonKey;
  let cardeditor = false;
  let activecalculation = new Calculation({
            minscale: 0,
            maxscale: 10,
            weight: 1,
            statistics: "sum",
            reverseScale: false,
           id: "dummy",
            element:null})
          
  let activecat;
  let listrefreshed = [false,false,false,false,false,false,false,false];
  let disablesave = true;
  let firstDayOfWeek: "1" | "2" = "1";
  
  

  $: firstDayOfWeek = $UserStore.meta.firstDayOfWeek;

  $: if(activeAddon) {
    activeAddonChanged = true;}
  
 
  $: if (
    $Interact.addons.active &&
    lastActiveAddonKey !== $Interact.addons.active
  ) {
    lastActiveAddonKey = $Interact.addons.active;
    domVisible = true;
    activeAddon = new Addon($AddonsStore.addons[$Interact.addons.active]);
    activeAddonChanged = false;
  }

  

  const state = {
      view: "main",
    };
  
  function toggleExpand(cat) {
    if (listrefreshed[cat]) {listrefreshed[cat] = false;}
    else {
      listrefreshed = [false,false,false,false,false,false,false,false];
      listrefreshed[cat] = true;}
  }

  function enableSave(){
    disablesave = false;
  }

  function disableSave(){
    disablesave = true;
  }

  function cardClicked(id,cat){
    
    activecat = cat;
    activecalculation = id;
    cardeditor = true;
  }

  function addCard(evt,cat){
  let dateType = "last-30";
  let timeFrame = timeFrames.find((t) => t.id == dateType);
  
  //let test = new Wolcnf;
  let newcalc = new Calculation;
  newcalc.timeRange = timeFrame;
  activecat = cat;
  activecalculation = newcalc;
  cardeditor = true;
  }

  async function deleteCard(evt,cat){
    activecat = cat;
    activecalculation = evt;
    let confirmed = await Interact.confirm(
      `Remove this Calculation Configuration?`,
      "This will delete the calculation configuration."
    );
    if (confirmed) {
    /////////start after confirmed deletion//////
    if (activecat == 0) {
      let targetCalculation =  activeAddon.configuration.cat1.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat1.calculations.splice(targetCalculation,1);
      listrefreshed[0] = false;
      setTimeout(()=>{listrefreshed[0] = true}, 10)
     }
     if (activecat == 1) {
      let targetCalculation =  activeAddon.configuration.cat2.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat2.calculations.splice(targetCalculation,1);
      listrefreshed[1] = false;
      setTimeout(()=>{listrefreshed[1] = true}, 10)
     } 
     if (activecat == 2) {
      let targetCalculation =  activeAddon.configuration.cat3.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat3.calculations.splice(targetCalculation,1);
      listrefreshed[2] = false;
      setTimeout(()=>{listrefreshed[2] = true}, 10)
     }
     if (activecat == 3) {
      let targetCalculation =  activeAddon.configuration.cat4.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat4.calculations.splice(targetCalculation,1);
      listrefreshed[3] = false;
      setTimeout(()=>{listrefreshed[3] = true}, 10)
     }
     if (activecat == 4) {
      let targetCalculation =  activeAddon.configuration.cat5.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat5.calculations.splice(targetCalculation,1);
      listrefreshed[4] = false;
      setTimeout(()=>{listrefreshed[4] = true}, 10)
     }
     if (activecat == 5) {
      let targetCalculation =  activeAddon.configuration.cat6.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat6.calculations.splice(targetCalculation,1);
      listrefreshed[5] = false;
      setTimeout(()=>{listrefreshed[5] = true}, 10)
     }
     if (activecat == 6) {
      let targetCalculation =  activeAddon.configuration.cat7.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat7.calculations.splice(targetCalculation,1);
      listrefreshed[6] = false;
      setTimeout(()=>{listrefreshed[6] = true}, 10)
     }
     if (activecat == 7) {
      let targetCalculation =  activeAddon.configuration.cat8.calculations.findIndex((t) => t.id == activecalculation.id);
      activeAddon.configuration.cat8.calculations.splice(targetCalculation,1);
      listrefreshed[7] = false;
      setTimeout(()=>{listrefreshed[7] = true}, 10)
     }
    /////////end after confirmed to delete///////
      Interact.toast(`Calculation Configuration removed`); 
      saveActiveAddon();
    }
   
  }

  function saveCalculation(){
    if (activecat == 0) {
    let targetCalculation =  activeAddon.configuration.cat1.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat1.calculations[targetCalculation]= activecalculation;
    } else {activeAddon.configuration.cat1.calculations.push(activecalculation)}
    calculateScale(0);
    listrefreshed[0] = false;
    setTimeout(()=>{listrefreshed[0] = true}, 10)}
    if (activecat == 1) {
    let targetCalculation =  activeAddon.configuration.cat2.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat2.calculations[targetCalculation]= activecalculation;
    } else {activeAddon.configuration.cat2.calculations.push(activecalculation)}
    calculateScale(1);
    listrefreshed[1] = false;
    setTimeout(()=>{listrefreshed[1] = true}, 10)}
    if (activecat == 2) {
    let targetCalculation =  activeAddon.configuration.cat3.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat3.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat3.calculations.push(activecalculation)}
    calculateScale(2);
    listrefreshed[2] = false;
    setTimeout(()=>{listrefreshed[2] = true}, 10)}
    if (activecat == 3) {
    let targetCalculation =  activeAddon.configuration.cat4.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat4.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat4.calculations.push(activecalculation)}
    calculateScale(3);
    listrefreshed[3] = false;
    setTimeout(()=>{listrefreshed[3] = true}, 10)}
    if (activecat == 4) {
    let targetCalculation =  activeAddon.configuration.cat5.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat5.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat5.calculations.push(activecalculation)}
    calculateScale(4);
    listrefreshed[4] = false;
    setTimeout(()=>{listrefreshed[4] = true}, 10)}
    if (activecat == 5) {
    let targetCalculation =  activeAddon.configuration.cat6.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat6.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat6.calculations.push(activecalculation)}
    calculateScale(5);
    listrefreshed[5] = false;
    setTimeout(()=>{listrefreshed[5] = true}, 10)}
    if (activecat == 6) {
    let targetCalculation =  activeAddon.configuration.cat7.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat7.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat7.calculations.push(activecalculation)}
    calculateScale(6);
    listrefreshed[6] = false;
    setTimeout(()=>{listrefreshed[6] = true}, 10)}
    if (activecat == 7) {
    let targetCalculation =  activeAddon.configuration.cat8.calculations.findIndex((t) => t.id == activecalculation.id);
    if (targetCalculation !== -1) {
      activeAddon.configuration.cat8.calculations[targetCalculation]= activecalculation;
    }else {activeAddon.configuration.cat8.calculations.push(activecalculation)}
    calculateScale(7);
    listrefreshed[7] = false;
    setTimeout(()=>{listrefreshed[7] = true}, 10)}
    saveActiveAddon();
  }

  function clearEditing(){
    cardeditor = false;
  }
  
  async function close() {
    domVisible = false;
    await tick(200);
    Interact.addon(null,null,null);
  }

  async function changeView(view) {
    state.view = view;
  }

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
    cardeditor = false;
  }

  async function initialCalculateScale(){
    
    await calculateScale(0);
    await calculateScale(1);
    await calculateScale(2);
    await calculateScale(3);
    await calculateScale(4);
    await calculateScale(5);
    await calculateScale(6);
    await calculateScale(7);
    
  }

  async function calculateScale(cat){
    let calculationsArray = new Array;
    if (cat == 0){
      calculationsArray = activeAddon.configuration.cat1.calculations
    }
    if (cat == 1){
      calculationsArray = activeAddon.configuration.cat2.calculations
    }
    if (cat == 2){
      calculationsArray = activeAddon.configuration.cat3.calculations
    }
    if (cat == 3){
      calculationsArray = activeAddon.configuration.cat4.calculations
    }
    if (cat == 4){
      calculationsArray = activeAddon.configuration.cat5.calculations
    }
    if (cat == 5){
      calculationsArray = activeAddon.configuration.cat6.calculations
    }
    if (cat == 6){
      calculationsArray = activeAddon.configuration.cat7.calculations
    }
    if (cat == 7){
      calculationsArray = activeAddon.configuration.cat8.calculations
    }

    let totalweight = 0;
    let totalvalue = 0;
    // start looping through the calculations =>
    for (var i = 0; i < calculationsArray.length; i++) { 
    
      activecalculation = new Calculation(calculationsArray[i]);
      let start = activecalculation.getStartDate(firstDayOfWeek);
      let end = activecalculation.getEndDate(firstDayOfWeek);
      
      const statsV5 = new StatsProcessor({});
        // Generate Stats
        activecalculation.statistics = activecalculation.statistics || "sum";
        
        // Get dayjs Start Date
        const fromDate = dayjs(start);
        const toDate = dayjs(end);
        const dayDiff = Math.abs(fromDate.diff(toDate, "day"));
        // Set Default Mode to "Week"
        let mode = "w";
        // Determine Stat Mode based on number of days provided
        if (dayDiff < 1) {
          mode = "d"; // Use hours as the breakdown
        } else if (dayDiff < 8) {
          mode = "w";
        } else if (dayDiff < 89) {
          mode = "m";
        } else if (dayDiff < 365) {
          mode = "q";
        } else if (dayDiff > 364) {
          mode = "y";
        } else {
          mode = "m";
        }
        // Setup the Config to Pass to Stats
        let calculationlogs = await getLogsForCalculation(activecalculation);
        
        let calculationmath = "sum";
        if (activecalculation.statistics == "sum"){
          calculationmath = "sum"}
        else {calculationmath = "mean"} 
        const statsConfig: any = {
          rows: calculationlogs[0],
          fromDate,
          toDate,
          mode,
          math: calculationmath, 
          trackableElement: activecalculation.element,
        };

        // Generate the Stats
        let calculationstats = statsV5.generate(statsConfig);

        // Calculate the scale

        //first we determin the value to start doing the calculations with
        let calculatedvalue = 0;
        if (calculationstats.math == "mean") {calculatedvalue = calculationstats.avg;}
        else {calculatedvalue = calculationstats.sum;}
        // now we make sure that the value is within the min and max scale. Otherwise we change to either minscale or maxscale value
        if (calculatedvalue < activecalculation.minscale) {calculatedvalue = activecalculation.minscale;}
        if (calculatedvalue > activecalculation.maxscale) {calculatedvalue = activecalculation.maxscale;}
        // next step is to determin where on the scale the calculated value is
        let calculatedscale = (calculatedvalue-activecalculation.minscale)/(activecalculation.maxscale-activecalculation.minscale);
        totalweight = totalweight + parseInt(activecalculation.weight);
        totalvalue = totalvalue + (calculatedscale*activecalculation.weight);
       }
      let finalscale = (totalvalue/totalweight);
      
      if (activecalculation.reverseScale){
        finalscale = 1-finalscale;}
      
      if (cat == 0){
      activeAddon.configuration.cat1.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 1){
      activeAddon.configuration.cat2.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 2){
      activeAddon.configuration.cat3.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 3){
      activeAddon.configuration.cat4.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 4){
      activeAddon.configuration.cat5.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 5){
      activeAddon.configuration.cat6.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 6){
      activeAddon.configuration.cat7.calculatedscale = finalscale;
       saveActiveAddon(false);}
       if (cat == 7){
      activeAddon.configuration.cat8.calculatedscale = finalscale;
       saveActiveAddon(false);}
   

  }

  /**
   * Get the Logs for a calculation
   */
   async function getLogsForCalculation(calculation: Calculation): Promise<Array<any>> {
    let logs = []; // Holder of the logs
    let dateRange = calculation.getDateRange($UserStore.meta.firstDayOfWeek); // Get Date Range for this calculation
    let start = dateRange[0]; // get  start
    let end = dateRange[1]; // get end

    
    // Get the Logs based on the Type provided
    if (calculation.element && calculation.element.type == "tracker") {
      // Tracker Search
      logs[0] = await LedgerStore.queryTag(calculation.element.id, start, end);
    } else if (calculation.element && calculation.element.type == "person") {
      // Person Search
      logs[0] = await LedgerStore.queryPerson(calculation.element.id, start, end);
    } else if (calculation.element && calculation.element.type == "context") {
      // Context Search
      logs[0] = await LedgerStore.queryContext(calculation.element.id, start, end);
    } else if (calculation.element) {
      // Generic Search
      logs[0] = await LedgerStore.queryAll(calculation.element.id, start, end);
    }
    return logs;
  }

  onMount(() => {
    initialCalculateScale();
  });
</script>

<style lang="scss">
  
  :global(.person-checkin .btn-group .active div) {
    font-size: 2em !important;
  }

</style>

<Modal className="addon-modal" bodyClass="bg-bg" show={domVisible} type="bottom-slideup" ariaLabel="Addon-Template" padding={true}>
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
      <div slot="right">
        <Button
        disabled={false}
        icon
          on:click={() => {
            saveActiveAddon();
          }}
        >
        {#if activeAddonChanged}
          <NIcon name="save" className="fill-red" />
        {:else}
        <NIcon name="save" className="fill-primary-bright" />
        {/if}
        </Button>
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
    
    <Wol bind:data={activeAddon.configuration}></Wol>
    <Divider></Divider>
    {#if activeAddon.configuration.cat1.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat1.label} bind:slidervalue={activeAddon.configuration.cat1.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat1.label} bind:slidervalue={activeAddon.configuration.cat1.scale}></WolSlider>
    {/if}
    
    {#if activeAddon.configuration.cat2.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat2.label} bind:slidervalue={activeAddon.configuration.cat2.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat2.label} bind:slidervalue={activeAddon.configuration.cat2.scale}></WolSlider>
    {/if}

    {#if activeAddon.configuration.cat3.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat3.label} bind:slidervalue={activeAddon.configuration.cat3.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat3.label} bind:slidervalue={activeAddon.configuration.cat3.scale}></WolSlider>
    {/if}
    
    {#if activeAddon.configuration.cat4.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat4.label} bind:slidervalue={activeAddon.configuration.cat4.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat4.label} bind:slidervalue={activeAddon.configuration.cat4.scale}></WolSlider>
    {/if}

    {#if activeAddon.configuration.cat5.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat5.label} bind:slidervalue={activeAddon.configuration.cat5.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat5.label} bind:slidervalue={activeAddon.configuration.cat5.scale}></WolSlider>
    {/if}

    {#if activeAddon.configuration.cat6.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat6.label} bind:slidervalue={activeAddon.configuration.cat6.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat6.label} bind:slidervalue={activeAddon.configuration.cat6.scale}></WolSlider>
    {/if}

    {#if activeAddon.configuration.cat7.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat7.label} bind:slidervalue={activeAddon.configuration.cat7.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat7.label} bind:slidervalue={activeAddon.configuration.cat7.scale}></WolSlider>
    {/if}

    {#if activeAddon.configuration.cat8.calculated}
    <WolSlider disabled={true} slidername={activeAddon.configuration.cat8.label} bind:slidervalue={activeAddon.configuration.cat8.calculatedscale}></WolSlider>
    {:else}
    <WolSlider disabled={false} slidername={activeAddon.configuration.cat8.label} bind:slidervalue={activeAddon.configuration.cat8.scale}></WolSlider>
    {/if}

    {:else if state.view == 'configuration'}
       <Text center={true} bold={true}>Wheel Of Life Configuration</Text>
       <Divider pad={true}></Divider>
       <ListItem
        className="py-2">
        <NInput
          style="background-color:#ED2527"
          type="text"
          className="mb-2"
          placeholder="First Category"
          bind:value={activeAddon.configuration.cat1.label}
        />
        <div slot="left">
        {#if listrefreshed[0]}
         <Button icon color="clear" on:click={() => {toggleExpand(0);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(0);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[0]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat1.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat1.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,0);}} on:addcard={(evt) => {addCard(evt.detail,0);}}  on:deletecard={(evt) => {deleteCard(evt.detail,0);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#3DB549"
          type="text"
          className="mb-2"
          placeholder="Second Category"
          bind:value={activeAddon.configuration.cat2.label}
        />
        <div slot="left">
        {#if listrefreshed[1]}
         <Button icon color="clear" on:click={() => {toggleExpand(1);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(1);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[1]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat2.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat2.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,1);}} on:addcard={(evt) => {addCard(evt.detail,1);}}  on:deletecard={(evt) => {deleteCard(evt.detail,1);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#2289B4"
          type="text"
          className="mb-2"
          placeholder="Third Category"
          bind:value={activeAddon.configuration.cat3.label}
        />
        <div slot="left">
        {#if listrefreshed[2]}
         <Button icon color="clear" on:click={() => {toggleExpand(2);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(2);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[2]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat3.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat3.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,2);}} on:addcard={(evt) => {addCard(evt.detail,2);}}  on:deletecard={(evt) => {deleteCard(evt.detail,2);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#F79321"
          type="text"
          className="mb-2"
          placeholder="Fourth Category"
          bind:value={activeAddon.configuration.cat4.label}
        />
        <div slot="left">
        {#if listrefreshed[3]}
         <Button icon color="clear" on:click={() => {toggleExpand(3);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(3);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[3]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat4.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat4.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,3);}} on:addcard={(evt) => {addCard(evt.detail,3);}}  on:deletecard={(evt) => {deleteCard(evt.detail,3);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#94AFDC"
          type="text"
          className="mb-2"
          placeholder="Fifth Category"
          bind:value={activeAddon.configuration.cat5.label}
        />
        <div slot="left">
        {#if listrefreshed[4]}
         <Button icon color="clear" on:click={() => {toggleExpand(4);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(4);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[4]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat5.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat5.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,4);}} on:addcard={(evt) => {addCard(evt.detail,4);}}  on:deletecard={(evt) => {deleteCard(evt.detail,4);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#FF5F75"
          type="text"
          className="mb-2"
          placeholder="Sixth Category"
          bind:value={activeAddon.configuration.cat6.label}
        />
        <div slot="left">
        {#if listrefreshed[5]}
         <Button icon color="clear" on:click={() => {toggleExpand(5);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(5);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[5]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat6.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat6.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,5);}} on:addcard={(evt) => {addCard(evt.detail,5);}}  on:deletecard={(evt) => {deleteCard(evt.detail,5);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#00ADEF"
          type="text"
          className="mb-2"
          placeholder="Seventh Category"
          bind:value={activeAddon.configuration.cat7.label}
        />
        <div slot="left">
        {#if listrefreshed[6]}
         <Button icon color="clear" on:click={() => {toggleExpand(6);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(6);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[6]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat7.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat7.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,6);}} on:addcard={(evt) => {addCard(evt.detail,6);}}  on:deletecard={(evt) => {deleteCard(evt.detail,6);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>

       <ListItem
        className="py-2">
        <NInput
          style="background-color:#935FA7"
          type="text"
          className="mb-2"
          placeholder="Eight Category"
          bind:value={activeAddon.configuration.cat8.label}
        />
        <div slot="left">
        {#if listrefreshed[7]}
         <Button icon color="clear" on:click={() => {toggleExpand(7);}}>
            <Icon name="chevronUp" />
          </Button>
        {:else}
        <Button icon color="clear" on:click={() => {toggleExpand(7);}}>
          <Icon name="chevronDown" />
        </Button>
        {/if}
         </div>
      </ListItem>
       {#if listrefreshed[7]}
       <ListItem
          className="py-2"
          title="Automated calculation"
          transparent={true}>
          <div slot="right" class="ml-2">
            <ToggleSwitch bind:value={activeAddon.configuration.cat8.calculated}/>
          </div>
        </ListItem>
       <WolCardList bind:calculations={activeAddon.configuration.cat8.calculations} on:editcard={(evt) => {
        cardClicked(evt.detail,7);}} on:addcard={(evt) => {addCard(evt.detail,7);}}  on:deletecard={(evt) => {deleteCard(evt.detail,7);}}></WolCardList>
       {/if} 
       <Divider pad={true}></Divider>
       
       
       
    {:else if state.view == 'documentation'}
    <Text center={true} bold={true}>Wheel Of Life Documentation</Text>
    <Divider pad={true}></Divider>
    {/if}
  </main>
</Modal>
<Modal show={cardeditor !== false}>
  <div class="n-toolbar-grid" slot="header">
    <div class="left">
      <Button color="primary" type="clear" on:click={clearEditing}>Close</Button
      >
    </div>
    <div class="main">Calculation Editor</div>
    <div class="right">
      <Button disabled={disablesave} color="primary" type="clear" on:click={saveCalculation}>
        {`${Lang.t("general.save", "Save")}`}
      </Button>
    </div>
  </div>
  {#if cardeditor}
    <CardEditor config={activecalculation} on:enablesave={enableSave} on:disablesave={disableSave} on:close={clearEditing} on:save={saveCalculation}/>
  {/if}
  <div slot="footer" />
</Modal>  

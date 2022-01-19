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
  import SchedulerList from "./scheduler-list.svelte";
  import Input from "../../../components/input/input.svelte";
  import Divider from "../../../components/divider/divider.svelte";
  import ListItem from "../../../components/list-item/list-item.svelte";
  import ToggleSwitch from "../../../components/toggle-switch/toggle-switch.svelte";
  import TrackerSmallBlock from "../../../components/tracker-small-block/tracker-small-block.svelte";
  import TrackableElement from "../../../modules/trackable-element/trackable-element";
  
  
  let domVisible = false;
  let activeAddon;
  let lastActiveAddonKey;
  let SchedulerArray =[{schedulername:"firstscheduler",displayName:"First Scheduler",active:true,schedule:"daily",formula:"a+b+c"},
  {schedulername:"secondscheduler",displayName:"Second Scheduler",active:true,schedule:"daily",formula:"a+b+q"},
  {schedulername:"thirdcheduler",displayName:"Third Scheduler",active:true,schedule:"daily",formula:"a+b+3"}];
  let activeScheduleIndex = 0;
  let lastActiveScheduleIndex = 0;
  let activeSchedule = {schedulername:"secondscheduler",displayName:"Second Scheduler",active:true,schedule:"daily",formula:"a+b+q"};
  let listdata = ["testa", "testb", "testc", "testc"];
  

  $: if(SchedulerArray) {
    let list = [];
    console.log(SchedulerArray.length);
    let i = 0;
    for (i = 0; i < SchedulerArray.length; i++) { 
      list.push(SchedulerArray[i].displayName); }
    listdata = list;  
  }

  $: if(activeScheduleIndex !=lastActiveScheduleIndex){
    console.log("ActiveSchedule Changed");
    console.log(activeSchedule);
    activeSchedule = SchedulerArray[activeScheduleIndex]
    lastActiveScheduleIndex=activeScheduleIndex; 
  }
  
  $: if (
    $Interact.addons.active &&
    lastActiveAddonKey !== $Interact.addons.active
  ) {
    lastActiveAddonKey = $Interact.addons.active;
    domVisible = true;
    activeAddon = new Addon($AddonsStore.addons[$Interact.addons.active]);
  }


  const state = {
      view: "main",
    };

  
  async function close() {
    domVisible = false;
    await tick(200);
    Interact.addon(null,null,null);
  }

  async function changeView(view) {
    state.view = view;
  }

  function runSchedule(scheduleindex){
    console.log("Run Schedule Placeholder function");
  }

  function saveActiveSchedule(){
    console.log("Save active Schedule Placeholder function");
  }

  
  function selectType() {
    const generateElementOption = (title, type, icon) => {
      return {
        title,
        icon,
        async click() {
          let selected: any = await Interact.select(type);
          if (selected.length) {
            activeSchedule.element = activeSchedule.element || {
              id: null,
              type: null,
              obj: null,
            };
            activeSchedule.element.obj = selected[0];
            activeSchedule.element.type = type;
            if (type == "tracker") {
              activeSchedule.element.id = activeSchedule.element.obj.tag;
            } else if (type == "person") {
              activeSchedule.element.id = activeSchedule.element.obj.username;
            } else if (type == "context") {
              activeSchedule.element.id = selected[0];
            } else {
              console.error("Fit for other types", selected[0]);
            }
            activeSchedule.element =
              activeSchedule.element instanceof TrackableElement
                ? activeconfig.element
                : new TrackableElement(activeSchedule.element);
          }
        },
      };
    };
    Interact.popmenu({
      title: "What type of item would you like to add?",
      buttons: [
        generateElementOption("Tracker", "tracker", "tracker"),
        generateElementOption("Person", "person", "userCircle"),
        generateElementOption("Context", "context", "bulb"),
      ],
    });
  }
  
  onMount(() => {
    activeSchedule = SchedulerArray[activeScheduleIndex];
  });
</script>

<style lang="scss">
  
  :global(.person-checkin .btn-group .active div) {
    font-size: 2em !important;
  }
</style>

<Modal className="addon-modal" bodyClass="bg-bg" show={domVisible} type="bottom-slideup" ariaLabel="Addon-Template">
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
      <Text center={true} bold={true}>PLAY & CONFIGURE SCHEDULES</Text>
      <SchedulerList height={90} items={listdata} bind:selectedindex={activeScheduleIndex}></SchedulerList>
      <Divider></Divider>
      <Text center={true} bold={true}>Parameters</Text>
      <Input bind:value={activeSchedule.displayName}
                type="text"
                placeholder="Scheduler Name"
                style="max-width:90%; margin-left:5%">
             </Input>
      <Input type="textarea" placeholder="Formula" style="max-width:90%; margin-left:5%" bind:value={activeSchedule.formula} /> 
      <Input bind:value={activeSchedule.schedule} type="select" label="Schedule" style="max-width:90%; margin-left:5%">
        <option>Select</option>
        <option value="daily">Daily</option>
        </Input>
        <ListItem
        className="py-2"
        transparent={true}
        title="Scheduler Activated"
        description="Activate the schedule"
        style="max-width:90%; margin-left:5%">
        <div slot="left">
          <Button icon color="clear" on:click={() => runSchedule(activeScheduleIndex)}>
            <NIcon name="play" size="44"/>
          </Button>
        </div>
        <div slot="right" class="pl-2">
          <ToggleSwitch
          bind:value={activeSchedule.active}/>
        </div>
      </ListItem>  
      <ListItem
            bg="transparent"
            clickable
            delay={0}
            className="px-2 trackable-item"
            on:click={selectType}
            title={`${!activeSchedule.element ? "⚠️ " : ""} ${"Target Trackable Element"}`}
            style="max-width:90%; margin-left:5%"
          >
            <div slot="right">
              {#if activeSchedule.element}
                <TrackerSmallBlock
                  truncate
                  xs
                  element={activeSchedule.element}
                  on:click={selectType}
                  className="px-2"
                  style="background-color:var(--color-solid); min-height:40px; min-width:100px; max-width:150px;"
                />
              {:else}
                <Text className="text-primary-bright"
                  >{Lang.t("general.select")}...</Text
                >
              {/if}
            </div>
          </ListItem>
          <Button block  style="max-width:90%; margin-left:5%; background-color:var(--color-primary)" on:click={saveActiveSchedule}
          >Save {activeSchedule.displayName}</Button
        >
    {:else if state.view == 'configuration'}
       <Text center={true} bold={true}>CONFIGURE SCHEDULER</Text>
    {:else if state.view == 'documentation'}
      <Text center={true} bold={true}>NOMIE SCHEDULER DOCUMENTATION</Text>
    {/if}
  </main>

</Modal>

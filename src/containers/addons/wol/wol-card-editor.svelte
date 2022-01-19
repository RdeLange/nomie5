<script lang="ts">
import Text from "../../../components/text/text.svelte";
import Input from "../../../components/input/input.svelte";
import ButtonGroup from "../../../components/button-group/button-group.svelte";
import { Lang } from "../../../store/lang";
import ListItem from "../../../components/list-item/list-item.svelte";
import TrackerSmallBlock from "../../../components/tracker-small-block/tracker-small-block.svelte";
import { Interact } from "../../../store/interact"; 
import TrackableElement from "../../../modules/trackable-element/trackable-element";
import { timeFrames } from "../../../containers/dashboard/timeFrames";
import { createEventDispatcher, onMount } from "svelte";
import { CalculationTimeFrame } from "./wolconfiguration";
import ToggleSwitch from "../../../components/toggle-switch/toggle-switch.svelte";

export let config;

const dispatch = createEventDispatcher();
let editorView = "options";
let editorButtons = [];
let value =[];
let activeconfig = config;
let dateType;
let lastdateType
let disablesave = true;

/**
   * On Date Type Change
   **/
   $: if (dateType) {
      if (lastdateType != dateType) { 
        lastdateType = dateType;
        if (lastdateType == "Select") {
          activeconfig.timeRange = null;}
        else { 
        let timeFrame = timeFrames.find((t) => t.id == dateType);
            activeconfig.timeRange = new CalculationTimeFrame(timeFrame);}
            
      }
    }
 
  $: if (activeconfig) {
    editorButtons = [
      {
        label: `${Lang.t("general.setup", "Setup")}`,
        active: editorView === "options",
        click() {
          changeView("options");
        },
      },
      {
        label: `${Lang.t("general.documentation", "Documentation")}`,
        active: editorView === "documentation",
        click() {
          changeView("documentation");
        },
      },
      
    ];
  }

  $: if(activeconfig.timeRange && activeconfig.minscale && activeconfig.maxscale && activeconfig.element && activeconfig.weight && activeconfig.statistics) {
    disablesave = false;
    dispatch("enablesave");}
     else {disablesave = true;
      dispatch("disablesave");}

  function changeView(view) {
    editorView = view;
  }  

  function selectType() {
    const generateElementOption = (title, type, icon) => {
      return {
        title,
        icon,
        async click() {
          let selected: any = await Interact.select(type);
          if (selected.length) {
            activeconfig.element = activeconfig.element || {
              id: null,
              type: null,
              obj: null,
            };
            activeconfig.element.obj = selected[0];
            activeconfig.element.type = type;
            if (type == "tracker") {
              activeconfig.element.id = activeconfig.element.obj.tag;
            } else if (type == "person") {
              activeconfig.element.id = activeconfig.element.obj.username;
            } else if (type == "context") {
              activeconfig.element.id = selected[0];
            } else {
              console.error("Fit for other types", selected[0]);
            }
            activeconfig.element =
              activeconfig.element instanceof TrackableElement
                ? activeconfig.element
                : new TrackableElement(activeconfig.element);
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
    if (activeconfig) {
        if (activeconfig.timeRange) {
            dateType = activeconfig.timeRange.id;}}

  });
</script>
  
  
  
  <div class="dashcard-editor">
    <div class="p-2 card-top bg-solid">
      <Text>Header</Text>
      <ButtonGroup
        className="mt-3 card-view-options"
        size="sm"
        buttons={editorButtons}
       />
   
    </div>
        <div class="card-views">
            {#if editorView == "options"}
            <Text>Options</Text>  
            <ListItem
            bg="transparent"
            clickable
            delay={0}
            className="px-2 trackable-item"
            on:click={selectType}
            title={`${!activeconfig.element ? "⚠️ " : ""} ${Lang.t(
              "general.trackable-item",
              "Trackable Item"
            )}`}
          >
            <div slot="right">
              {#if activeconfig.element}
                <TrackerSmallBlock
                  truncate
                  xs
                  element={activeconfig.element}
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
          <ListItem className="p-0" bg="transparent">
            <Input bind:value={dateType} type="select" label="Timeframe">
              <option>Select</option>
              <option value="last-7">Last 7 days</option>
              <option value="last-30">Last 30 days</option>
              <option value="last-90">Last 90 days</option>
              <option value="last-365">Last 365 days</option>
              </Input>
          </ListItem>
          <ListItem className="p-0" bg="transparent">
            <Input bind:value={activeconfig.statistics} type="select" label="Statistics">
              <option value={null}>Select</option>
              <option value="sum">Sum</option>
              <option value="average">Average</option>
              </Input>
          </ListItem>
          <ListItem bg="transparent" className="px-0 pt-2">
            <div class="under" slot="left">
              <div class="text-center">
                <Input bind:value={activeconfig.minscale}
                  pattern="[0-9]*"
                  inputmode="numeric"
                  placeholder="Minimum Scale"
                  style="max-width:140px;"
                />
              </div>
            </div>
            <div class="over" slot="right">
              <div class="text-center">
                <Input bind:value={activeconfig.maxscale}
                  pattern="[0-9]*"
                  inputmode="numeric"
                  placeholder="Maximum Scale"
                  style="max-width:140px;"
                />
              </div>
            </div>
          </ListItem>
          <ListItem
            className="py-2"
            transparent={true}
            title="Reversed scale"
            description="Reverse the scale (the lower the better)">
            <div slot="right" class="pl-2">
              <ToggleSwitch
              bind:value={activeconfig.reverseScale}/>
            </div>
          </ListItem>
          <ListItem bg="transparent" title="Weight Factor" className="p-0">
            <div slot="right">
              <Input bind:value={activeconfig.weight}
                pattern="[0-9]*"
                inputmode="numeric"
                placeholder="Weight Factor"
                style="max-width:140px;">
             </Input>
            </div>
          </ListItem>
          


            {:else if editorView == "documentation"}
            <Text center={true}>Documentation</Text>  
            {/if}
        </div>
    </div>
  
  <style lang="scss">
    .card-top {
      box-shadow: var(--box-shadow-float);
    }
    .dashcard-editor {
      flex-grow: 1;
      flex-shrink: 1;
      min-height: 300px;
      background-color: var(--color-bg);
    }
    .card-views {
      padding: 16px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
    .themed {
      --borderRadius: 10px;
      --border: 0px;
      --multiItemActiveBG: var(--color-primary-bright);
      --multiItemBG: grey;
      --background: var(--color-solid);
      --itemColor: grey;
      --itemHoverBG: var(--color-primary);
      --itemHoverColor: white;
  
    }
  </style>
  
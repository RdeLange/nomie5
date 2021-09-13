<script>
  // Components
  import Modal from "../../components/modal/modal.svelte";
  import NItem from "../../components/list-item/list-item.svelte";
  import NInput from "../../components/input/input.svelte";
  import NLogListLoader from "../../components/log-list/log-list-loader.svelte";
  import NToolbar from "../../components/toolbar/toolbar.svelte";
  import NIcon from "../../components/icon/icon.svelte";
  import NToolbarGrid from "../../components/toolbar/toolbar-grid.svelte";
  import ButtonGroup from "../../components/button-group/button-group.svelte";
  import Dymoji from "../../components/dymoji/dymoji.svelte";
  import LogItem from "../../components/list-item-log/list-item-log.svelte";
  import BarChart from "../../components/charts/bar-chart.svelte";
  import DatePicker from "../../components/date-picker/date-picker.svelte";
  import ListItem from "../../components/list-item/list-item.svelte";
  import Text from "../../components/text/text.svelte";
  import ColorPicker from "../../components/color-picker/color-picker.svelte";
  //import DateRangeSelect from "svelte-date-range-select@1.0.4";
  import DateRangeSelect from "../../components/date-range-select/DateRangeSelect.js";

  // Container Items
  import PeriodObservations from "./period-log-observations.svelte";

  // Modules / Utils
  import tick from "../../utils/tick/tick";
  import Period from "../../modules/period/period";

  // Vendors
  import html2canvas from "html2canvas";
  import domtoimage from "dom-to-image-chrome-fix";
  import dayjs from "dayjs";

  import { LedgerStore } from "../../store/ledger";
  import { Interact } from "../../store/interact";
  import { PeriodsStore } from "../../store/periods-store";
  import Button from "../../components/button/button.svelte";
  export let initialview = "observations";
  let domVisible = false;
  let iconBase64 = null;
  //let periodColor = "#00BCD4";
  let activePeriod;
  let activeStats;
  let lastActivePeriodKey;
  let activeLogs;
  let showDateRangePicker = false;


  let startdate = dayjs();
  let enddate = dayjs();
  
  $: if (activePeriod) {
    startdate = dayjs(activePeriod.start);
    enddate = dayjs(activePeriod.end);
  }


  $: if (
    $Interact.periods.active &&
    lastActivePeriodKey !== $Interact.periods.active
  ) {
    lastActivePeriodKey = $Interact.periods.active;
    domVisible = true;
    activePeriod = new Period($PeriodsStore.periods[$Interact.periods.active]);
  }

  const state = {
    view: initialview,
  };

  function onApply({ detail }) {
    activePeriod.start = detail.startDate;
    activePeriod.end = detail.endDate;
    showDateRangePicker = false;
  }

  function showDaterangePicker() {
    showDateRangePicker = true;
  }

  function datechange(evt, when) {
    if (when == "start") {
      activePeriod.start = new Date(evt.detail);
    } else if (when == "end") {
      activePeriod.end = new Date(evt.detail);
      }
  }

  async function deletePeriod() {
    let confirmed = await Interact.confirm(
      `Remove ${activePeriod.periodname}?`,
      "This only deletes them from your list, NO log data will be deleted."
    );
    if (confirmed) {
      await PeriodsStore.deletePeriod(activePeriod);
      Interact.toast(`${activePeriod.periodname} removed`);
      close();
    }
  }

  async function saveActivePeriod() {
    try {
      await PeriodsStore.savePeriod(activePeriod);
      Interact.toast("Saved");
    } catch (e) {
      Interact.alert("Error", e.message);
    }
  }

  async function getIconImage(imageBase64) {
    let image = document.getElementById("photo-holder-image");
    image.src = imageBase64;
    await tick(200);
    let wrapper = document.getElementById("photo-holder");
    if (image.naturalHeight > image.naturalWidth) {
      wrapper.setAttribute("data-orientation", "vertical");
    } else if (image.naturalHeight < image.naturalWidth) {
      wrapper.setAttribute("data-orientation", "horizontal");
    } else {
      wrapper.setAttribute("data-orientation", "square");
    }

    try {
      await tick(400);
      let canvas = await html2canvas(wrapper, { width: 90, height: 90 });
      let icon64 = canvas.toDataURL("image/jpeg", 0.2);
      return icon64;
    } catch (e) {
      alert(e.message);
      return null;
    }
  }

  async function close() {
    domVisible = false;
    await tick(200);
    Interact.period(null, null);
  }

  async function loadActiveLogs() {
    let active = $Interact.periods.active;
    activePeriod = new Period($PeriodsStore.periods[active]);
    activeLogs = await LedgerStore.queryPeriod(
      active,
      dayjs().subtract(1, "year"),
      dayjs()
    );
  }

  async function selectImage(evt) {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let input = evt.target;
    let files = evt.target.files;
    let iconBase64 = await toBase64(files[0]);
    await tick(20);
    let smallIcon64 = await getIconImage(iconBase64);
    await tick(20);
    document.getElementById("photo-holder-image").src = null;
    await tick(10);
    activePeriod.icon = smallIcon64;
  }

  async function changeView(view) {
    state.view = view;
  }
</script>

<Modal
  className="period-modal"
  bodyClass="bg-bg"
  show={domVisible}
  type="bottom-slideup"
  ariaLabel="Period"
>
  <header class="w-100" slot="header" on:swipedown={close}>
    <NToolbarGrid>
      <div slot="left">
        <Button icon on:click={close}>
          <NIcon name="close" className="fill-primary-bright" />
        </Button>
      </div>
      <div class="main">
        <div class="n-row">
          <Dymoji period={activePeriod} size={26} radius={0.3} color={activePeriod.periodcolor}/>
          &nbsp; {activePeriod.getDisplayName()}
        </div>
      </div>
      <div slot="right">
        <Button
        disabled  
        icon
          on:click={() => {
            close();
            Interact.openStats(`~${activePeriod.getPeriodname()}`);
          }}
        >
          <NIcon name="chart" size="0" className="fill-primary-bright" />
        </Button>
      </div>
    </NToolbarGrid>
    <NToolbar>
      <ButtonGroup
        size="sm"
        buttons={[
          {
            label: "Edit",
            active: state.view === "edit",
            click() {
              changeView("edit");
            },
          },
          {
            label: "Log Observations",
            active: state.view === "observations",
            click() {
              changeView("observations");
            },
          },
          
        ]}
      />
    </NToolbar>
  </header>

  <main>
    {#if state.view == "observations"}
      <PeriodObservations on:loggedObservation={close} />
    {:else if state.view == "edit"}
      <div class="edit p-3">
        <NInput
          style="background-color:{activePeriod.periodcolor}"
          type="text"
          className="mb-2"
          placeholder="Display Name"
          bind:value={activePeriod.displayName}
        />
          <div align="center">
            <DateRangeSelect
            bind:start={activePeriod.start}
            bind:end={activePeriod.end}
            heading={activePeriod.getDisplayName()}
              />
          </div>
        
        <NInput
          type="textarea"
          placeholder="Notes"
          className="mb-2"
          bind:value={activePeriod.notes}
        />

        <NItem className="bg-transparent p-0">
          <div
            slot="left"
            on:click={() => {
              document.getElementById("iconFileInput").click();
            }}
          >
            {#if activePeriod.icon}
            <Dymoji period={activePeriod} size={50} radius={0.3} color={activePeriod.periodcolor}/>
            
            {:else}
            <Dymoji period={activePeriod} size={50} radius={0.3} color={activePeriod.periodcolor}/>
           
            {/if}
          </div>

          <Button
            block
            color="light"
            on:click={() => {
              document.getElementById("iconFileInput").click();
            }}
          >
            Select Image...
          </Button>
          <div class="file-input-wraper">
            <input
              class="form-control pb-2"
              id="iconFileInput"
              placeholder="Avatar"
              type="file"
              accept="png,jpeg,jpg"
              on:change={selectImage}
            />
          </div>
        </NItem>
        
        <Text left faded size="sm" >Period Color:</Text>
        <ColorPicker bind:value={activePeriod.periodcolor} className="mb-1 tracker-color" />
        <Button block className="mt-5 mb-2" on:click={saveActivePeriod}
          >Save ~{activePeriod.periodname}</Button
        >

        <NItem
          className="bg-transparent text-solid-3 text-sm text-center"
          on:click={deletePeriod}>Delete ~{activePeriod.periodname}...</NItem
        >
      </div>
    {:else if state.view == "logs"}
      <NLogListLoader compact term={`~${activePeriod.periodname}`} />
    {/if}
  </main>
</Modal>

<style lang="scss">
  .file-input-wraper {
    height: 1px;
    overflow: hidden;
  }
  :global(.period-checkin .btn-group .active div) {
    font-size: 2em !important;
  }
</style>

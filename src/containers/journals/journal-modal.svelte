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
  import SortableList from "./../../components/sortable-list/sortable-list.svelte";
  import Icon from "./../../components/icon/icon.svelte";
  import ListItem from "./../../components/list-item/list-item.svelte";
  import Text from "./../../components/text/text.svelte";
  import Divider from "./../../components/divider/divider.svelte"
  import ColorPicker from "../../components/color-picker/color-picker.svelte";
  import SvgIcon from '../../components/icon/SvgIcon.svelte';
  import {JournalIcon} from '../../components/icon/AppIcons.js' ;

  // Container Items
  import JournalLogEntry from "./journal-log-entry.svelte";

  // Modules / Utils
  import tick from "../../utils/tick/tick";
  import Journal from "../../modules/journal/journal";

  // Vendors
  import html2canvas from "html2canvas";
  import domtoimage from "dom-to-image-chrome-fix";
  import dayjs from "dayjs";

  import { LedgerStore } from "../../store/ledger";
  import { Interact } from "../../store/interact";
  import { JournalsStore } from "../../store/journals-store";
  import Button from "../../components/button/button.svelte";

  let domVisible = false;
  let avatarBase64 = null;
  let refreshed = true;
  let activeJournal;
  let activeStats;
  let lastActiveJournalKey;
  let activeLogs;
  let colorrefreshed = true;
  let lastcolor ="";

  $: if(activeJournal.journalcolor != lastcolor) {
    lastcolor = activeJournal.journalcolor;
    colorrefreshed=false;
      setTimeout(()=>{colorrefreshed = true}, 10);

  }

  $: if ($Interact.journals.active && lastActiveJournalKey !== $Interact.journals.active) {
    lastActiveJournalKey = $Interact.journals.active;
    domVisible = true;
    activeJournal = new Journal($JournalsStore.journals[$Interact.journals.active]);
    
  }

  const state = {
    view: "check-in",
  };

  async function updatePrompt(prompt) {
    let newprompt = await Interact.prompt("Please Provide a new prompt");
    if (newprompt != null) {
      activeJournal.prompts[activeJournal.prompts.indexOf(prompt)] = newprompt;
      await JournalsStore.saveJournal(activeJournal);}
  }

  async function deletePrompt(prompt) {
    let confirmed = await Interact.confirm(
      `Remove Prompt?`,
      "This will remove this prompt from the journal."
    );
    if (confirmed) {
    const index = activeJournal.prompts.indexOf(prompt);
    if (index > -1) {
      activeJournal.prompts.splice(index, 1);
      await JournalsStore.saveJournal(activeJournal);  
      refreshed=false;
      setTimeout(()=>{refreshed = true}, 10);
      Interact.toast(`Prompt removed`);}}
  }

  async function addPrompt(){
    let newprompt = await Interact.prompt("Please Provide a new prompt");
    if (newprompt != null) {
      activeJournal.prompts.push(newprompt);
      await JournalsStore.saveJournal(activeJournal);
      refreshed=false;
      setTimeout(()=>{refreshed = true}, 10);
      Interact.toast(`Prompt added`);
      }
  }

  async function deleteJournal() {
    let confirmed = await Interact.confirm(
      `Remove ${activeJournal.journalname}?`,
      "This only deletes the journal from your list, NO log data will be deleted."
    );
    if (confirmed) {
      await JournalsStore.deleteJournal(activeJournal);
      Interact.toast(`${activeJournal.journalname} removed`);
      close();
    }
  }

  async function saveActiveJournal() {
    try {
      await JournalsStore.saveJournal(activeJournal);
      Interact.toast("Saved");
    } catch (e) {
      Interact.alert("Error", e.message);
    }
  }

  async function saveSortedJournal() {
    await JournalsStore.saveJournal(activeJournal)
    refreshed=false;
    setTimeout(()=>{refreshed = true}, 10);;
  }

  async function getAvatarImage(imageBase64) {
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
      let avatar64 = canvas.toDataURL("image/jpeg", 0.2);
      return avatar64;
    } catch (e) {
      alert(e.message);
      return null;
    }
  }

  async function close() {
    domVisible = false;
    await tick(200);
    Interact.journal(null);
  }

  async function selectPhoto(evt) {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let input = evt.target;
    let files = evt.target.files;
    let avatarBase64 = await toBase64(files[0]);
    await tick(20);
    let smallAvatar64 = await getAvatarImage(avatarBase64);
    await tick(20);
    document.getElementById("photo-holder-image").src = null;
    await tick(10);
    activeJournal.avatar = smallAvatar64;
  }

  async function changeView(view) {
    state.view = view;
  }
</script>

<style lang="scss">
  .file-input-wraper {
    height: 1px;
    overflow: hidden;
  }
  :global(.person-checkin .btn-group .active div) {
    font-size: 2em !important;
  }
</style>

<Modal className="journal-modal" bodyClass="bg-bg" show={domVisible} type="bottom-slideup" ariaLabel="Journal">
  <header class="w-100" slot="header" on:swipedown={close}>
    <NToolbarGrid>
      <div slot="left">
        <Button icon on:click={close}>
          <NIcon name="close" className="fill-primary-bright" />
        </Button>
      </div>
      <div class="main">
        <div class="n-row">
          {#if colorrefreshed}
            <a><SvgIcon d={JournalIcon} linefill={activeJournal.journalcolor} height="45" width="45"/></a>
            
            &nbsp; {activeJournal.getDisplayName()}
          {/if}
        </div>
      </div>
      <div slot="right">
        <Button
          icon
          on:click={() => {
            close();
            Interact.openStats(`§${activeJournal.getJournalname()}`);
          }}>
          <NIcon name="chart" size="22" className="fill-primary-bright" />
        </Button>
      </div>
    </NToolbarGrid>
    <NToolbar>
      <ButtonGroup
        size="sm"
        buttons={[{ label: 'Logs', active: state.view === 'logs', click() {
              changeView('logs');
            } }, { label: 'Log-Entry', active: state.view === 'check-in', click() {
              changeView('check-in');
            } }, { label: 'Edit', active: state.view === 'edit', click() {
              changeView('edit');
            } }]} />
    </NToolbar>
  </header>

  <main>
    {#if state.view == 'check-in'}
      <JournalLogEntry on:checkedIn={close} />
    {:else if state.view == 'edit'}
      <div class="edit p-3">

        <NInput type="text" className="mb-2" placeholder="Display Name" bind:value={activeJournal.displayName} />
        <NInput type="textarea" placeholder="Notes" className="mb-2" bind:value={activeJournal.notes} />

        
        <Text center=true>.</Text>
        <Divider></Divider>
        <Text center=true>Promts</Text>
        
        {#if refreshed}
          <SortableList
            items={activeJournal.prompts || []}
            handle=".menu-handle"
            key="id"
            on:update={(sorted) => {
              activeJournal.prompts = sorted.detail;
              saveSortedJournal();
            }}
            let:item
          >
            <ListItem solo className="pb-2">
              <div slot="left">
                <Button icon color="clear" on:click={() => deletePrompt(item)}>
                  <Icon name="delete" />
                </Button>
              </div>
                <Text size="md" truncate on:click={() => updatePrompt(item)}>{item}</Text>
              <div slot="right" class="pr-2 text-sm text-faded-2">
                <div class="menu-handle">
                  <Icon name="menu" />
                </div>
              </div>
            </ListItem>
          </SortableList>
        {/if}
        <Button block className="mt-1 mb-1" color="green" on:click={addPrompt}>+ Add new Prompt</Button>
        <Text left faded size="sm" >Journal Color:</Text>
        <ColorPicker bind:value={activeJournal.journalcolor} className="mb-1 tracker-color" />
        <Button block className="mt-5 mb-2" on:click={saveActiveJournal}>Save §{activeJournal.journalname}</Button>

        <NItem className="bg-transparent text-solid-3 text-sm text-center" on:click={deleteJournal}>Delete §{activeJournal.journalname}...</NItem>
      </div>
    {:else if state.view == 'logs'}
      <NLogListLoader compact term={`§${activeJournal.journalname}`} />
    {/if}
  </main>

</Modal>

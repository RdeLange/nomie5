<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Modules
  import NomieLog from "../../modules/nomie-log/nomie-log";

  // Components
  import Spinner from "../../components/spinner/spinner.svelte";
  import NInput from "../../components/input/input.svelte";
  import NItem from "../../components/list-item/list-item.svelte";
  import AutoComplete from "../../components/auto-complete/auto-complete.svelte";
  import NIcon from "../../components/icon/icon.svelte";
  import NButtonGroup from "../../components/button-group/button-group.svelte";
  import NPositivitySelector from "../../components/positivity-selector/positivity-selector.svelte";

  // utils
  import tick from "../../utils/tick/tick";

  // Stores
  import { Interact } from "../../store/interact";
  import { Lang } from "../../store/lang";
  import { LedgerStore } from "../../store/ledger";
  import Button from "../../components/button/button.svelte";
  import Row from "../../components/row/row.svelte";
  import DatePicker from "../../components/date-picker/date-picker.svelte";
  import ListItem from "../../components/list-item/list-item.svelte";
  import Spacer from "../../components/spacer/spacer.svelte";
  import { JournalsStore } from "../../store/journals-store";

  const prompts = JournalsStore.get(`${$Interact.journals.active}`).prompts;
  const promptnotes = new Array(prompts.length)

  const state = {
    note: ` §${$Interact.journals.active} `,
    checkingIn: false,
    checkedIn: false,
    score: 0,
    date: undefined,
    promptnotes: promptnotes,
  };
  

  
  
  let checkIn = async () => {
    state.checkingIn = true;
    try {
      let log = new NomieLog({
        note: state.note,
      });
      // Set Score
      log.score = state.score;
      // Set Date if set
      if (state.date) {
        log.end = state.date;
      }
      // Save to Ledger
      let saved = await LedgerStore.saveLog(log);
      // Change UI Status
      state.checkingIn = false;
      state.checkedIn = true;
      // Wait for 600 ms
      await tick(600);
      // Announce change
      dispatch("checkedIn", saved);
    } catch (e) {
      Interact.alert("Error", e.message);
      state.checkingIn = false;
    }
  };

  $: if (state.promptnotes) {
      let tmpnotes = "";
      let i = 0;
      for (const nts of state.promptnotes){
        let notes = nts;
        if (notes == null) {notes = "No text yet";}
        if (tmpnotes == "") {tmpnotes = tmpnotes +"\n"+prompts[i].toUpperCase() +"\n" + notes;}
        else {tmpnotes = tmpnotes +"\n"+"\n"+prompts[i].toUpperCase() +"\n" + notes;}
        i++}
      state.note = ` §${$Interact.journals.active} ` + "\n"+ tmpnotes;
  };
</script>

<div class="journal-checkin p-3">
  <div class="text-area-holder">
    {#each prompts as prompt, index (index)}
       <NInput type="textarea" rows={3} placeholder={prompt} bind:value={state.promptnotes[index]} />
       <AutoComplete
      scroller
      input={state.promptnotes[index]}
      on:select={(evt) => {
        let payload = evt.detail;
        state.promptnotes[index] = payload.note;
      }} />
        {/each}
    
    <ListItem solo className="mx-0 w-100 py-1">
      <DatePicker bind:time={state.date} />
    </ListItem>
  </div>

  <Spacer className="mt-3" />

  <NPositivitySelector
    transparent
    score={state.score}
    size="lg"
    on:change={(evt) => {
      state.score = evt.detail;
    }} />

  <Spacer className="mt-3" />

  {#if !state.checkingIn && !state.checkedIn}
    <Button block on:click={checkIn}>Log-Entry</Button>
  {:else if state.checkingIn}
    <Button block color="light" disabled>
      <Spinner size={24} />
      <div class="ml-2">Logging Entry...</div>
    </Button>
  {/if}

  <div class="text-center mt-4 animate up {state.checkedIn ? 'visible' : 'hidden'}">
    <NIcon name="checkmarkOutline" size="60" className="fill-green" />
  </div>
</div>

<script>
  import { onMount } from "svelte";
  import NItem from "../components/list-item/list-item.svelte";
  import NToolbar from "../components/toolbar/toolbar.svelte";
  import Text from "../components/text/text.svelte";
  import NIcon from "../components/icon/icon.svelte";
  import Button from "../components/button/button.svelte";
  import NLayout from "../containers/layout/layout.svelte";
  import ShortcutJournalButton from "../components/shortcut-button/shortcut-journal-button.svelte";

  import { Lang } from "../store/lang";
  import { JournalsStore } from "../store/journals-store";
  import { Interact } from "../store/interact";
  import { LedgerStore } from "../store/ledger";
  import { SearchStore } from "../store/search-store";

  import { journalTemplates } from "../containers/journals/journalTemplates";
  import dayjs from "dayjs";
  import Empty from "../containers/empty/empty.svelte";
  export const location = undefined;

  let state = {
    Journals: [],
    view: "time",
    stats: {},
    searchTerm: null,
    initialized: false,
  };

  const journalClicked = (journalname) => {
    Interact.journal(journalname);
  };

  /**
   * When JournalsStore Changes,
   * set state.journals to the array of journalnames
   */
  $: if (state.view && $JournalsStore.journals) {
    loadJournals();
    state.initialized = true;
  }

  function loadJournals() {
    const longTimeAgo = dayjs().subtract(100, "years").toDate();

    state.journals = getJournals().sort((a, b) => {
      return $JournalsStore.journals[a].last < $JournalsStore.journals[b].last
        ? 1
        : -1;
    });
    state.initialized = true;
  }

  async function deployJournal(journaltemplate) {
    try {
      let journalname = await Interact.prompt(Lang.t("journals.journal-name", "Journal Name"));
      journaltemplate.journalname = journalname;
      if (journalname) {
        let journal = await JournalsStore.addByTemplate(journaltemplate);
        if (journal) {
          LedgerStore.fastLog(`Added §${journal.journalname} to +nomie`);
          journalClicked(journal.journalname);
        }
      }
    } catch (e) {
      Interact.alert("Error", e.message);
    }
  }

  async function chooseTemplate(journaltemplate) {
    
    deployJournal(journaltemplate);
  }

  async function addJournal1() {
    let buttons = [];
    // let tmp ="";
    for (var i = 0; i < journalTemplates.length; i++) {
      let tmp ="";
      tmp = journalTemplates[i];
      buttons.push({title: journalTemplates[i].journalname,click: () => {
            chooseTemplate(tmp);}, icon:"addOutline"})
      
    }

    

    Interact.popmenu({
      title: "Choose Journal Template to use",
      buttons,
    });
  }

  function getJournals() {
    // The $JournalsStore.journals is a map - journalname is the key
    if (state.searchTerm) {
      return Object.keys(($JournalsStore || {}).journals || {}).filter(
        (journal) => {
          return journal.toLowerCase().search(state.searchTerm) > -1;
        }
      );
    } else {
      return Object.keys(($JournalsStore || {}).journals || {});
    }
  }

  onMount(() => {
    loadJournals();
  });
</script>

<NLayout pageTitle="Guided Journal Templates">
  <div slot="header" class="n-row">
    <NToolbar className="container px-2">
      <Button
        color="none"
        shape="circle"
        className="tap-icon"
        on:click={() => {
          SearchStore.view("journals");
        }}
      >
        <NIcon name="search" size={24} />
      </Button>
      <div class="filler pl-2 truncate">
        {#if state.journals.length}
          <Text center bold>{Lang.t("tabs.journals", "Journals")}</Text>
        {/if}
      </div>
      <Button
        color="none"
        shape="circle"
        className="tap-icon"
        on:click={addJournal1}
      >
        <NIcon name="add" size={24} />
      </Button>
    </NToolbar>
  </div>

  <div slot="content" class="container">
    <div class="n-list my-2 bg-transparent">
      {#if !state.journals.length && !state.searchTerm && state.initialized}
        <Empty
          title={Lang.t("general.journals")}
          emoji="📔"
          description={Lang.t(
            "journals.empty-message",
            "Track & monitor which guided journals use regularly use"
          )}
          buttonLabel={Lang.t(
            "journals.add-a-journal",
            "Add a Guided Journal Template..."
          )}
          buttonClick={addJournal1}
        />
      {:else if !state.initialized}
        <NItem>Loading...</NItem>
      {:else if !state.journals.length && state.searchTerm}
        <NItem>Nothing found for §{state.searchTerm}</NItem>
      {/if}

      <div class="trackers n-grid">
        {#each state.journals as journal, index (index)}
          <ShortcutJournalButton
            journal={$JournalsStore.journals[journal]}
            on:click={() => {
              journalClicked(journal);
            }}
            on:more={() => {
              Interact.openStats(`§${journal}`);
            }}
          />
        {/each}
      </div>
    </div>
  </div>
</NLayout>

<style lang="scss">
</style>

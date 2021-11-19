<script lang="ts">
  import type { t } from "i18next";
  import ListItem from "../../components/list-item/list-item.svelte";
  import LogListLoader from "../../components/log-list/log-list-loader.svelte";
  import SearchBar from "../../components/search-bar/search-bar.svelte";
  import ShortcutJournalButton from "../../components/shortcut-button/shortcut-journal-button.svelte";
  import Text from "../../components/text/text.svelte";
  import type NLog from "../../modules/nomie-log/nomie-log";
  import type Journal from "../../modules/journal/journal";
  import { Interact } from "../../store/interact";
  import { Lang } from "../../store/lang";
  import { JournalsStore } from "../../store/journals-store";
  import { SearchStore, SearchTerm } from "../../store/search-store";
  import tick from "../../utils/tick/tick";
  export let term: string;
  let results: Array<Journal> = [];

  $: if (term) {
    results = Object.keys($JournalsStore.journals)
      .filter((journalname: string) => {
        let journal: Journal = $JournalsStore.journals[journalname];
        return `${journal.displayName} ${journal.journalname} ${journal.notes}`.toLowerCase().search(term.replace("§", "").toLowerCase()) > -1;
      })
      .map((journalname) => {
        return $JournalsStore.journals[journalname];
      });
  } else {
    results = [];
  }

  $: if ($SearchStore.active && $SearchStore.active.term && $SearchStore.active.term !== term) {
    term = $SearchStore.active.term.replace("§", "");
  }

  function searchJournals(evt: CustomEvent) {
    term = evt.detail;
  }

  async function clear() {
    term = undefined;
    SearchStore.clear();
    term = undefined;
  }

  async function close() {
    term = undefined;
    SearchStore.clear();
    SearchStore.close();
  }

  function rememberSearch(journalname: string) {
    SearchStore.save(
      new SearchTerm({
        term: `${journalname}`,
        type: "journals",
      })
    );
  }
</script>

<section class="n-panel stiff pt-2">
  <SearchBar
    compact
    autofocus
    showClose={true}
    className="filler"
    searchTerm={term || ''}
    on:clear={clear}
    on:change={searchJournals}
    placeholder={Lang.t('search.search-journals', 'Search Journals...')} />

</section>
<section class="n-panel scroll-y column">
  {#if results.length}
    <main class="trackers n-grid">
      {#each results as journal, index}
        <ShortcutJournalButton
          {journal}
          on:more={() => {
            rememberSearch(term);
            close();
            Interact.openStats(`§${journal.journalname}`);
          }}
          on:click={() => {
            rememberSearch(term);
            close();
            Interact.journal(journal.journalname);
          }} />
      {/each}
    </main>
  {:else if term && !results.length}
    <ListItem title={Lang.t('search.no-results', 'No results found')} className="mt-4" />
  {/if}

</section>

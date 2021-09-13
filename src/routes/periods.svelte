<script>
  import { onMount } from "svelte";
  import NItem from "../components/list-item/list-item.svelte";
  import NToolbar from "../components/toolbar/toolbar.svelte";
  import Text from "../components/text/text.svelte";
  import NIcon from "../components/icon/icon.svelte";
  import Button from "../components/button/button.svelte";
  import NLayout from "../containers/layout/layout.svelte";
  import ShortcutPeriodButton from "../components/shortcut-button/shortcut-period-button.svelte";
  import ListPeriodItem from "../components/list-item/list-period-item.svelte";
 

  import { Lang } from "../store/lang";
  import { PeriodsStore } from "../store/periods-store";
  import { Interact } from "../store/interact";
  import { LedgerStore } from "../store/ledger";
  import { SearchStore } from "../store/search-store";
  import TrackableElement from "../modules/trackable-element/trackable-element";

  import dayjs from "dayjs";
  import Empty from "../containers/empty/empty.svelte";
  export const location = undefined;

  let state = {
    periods: [],
    view: "time",
    stats: {},
    searchTerm: null,
    initialized: false,
  };

  const periodClicked = (periodname) => {
    Interact.period(periodname,"edit");
  };

  const periodClicked2 = (period) => {
    Interact.elementOptions(new TrackableElement({ id: period.periodname, raw: `~${period.periodname}`, type: 'period' }));
  };

  /**
   * When PeriodsStore Changes,
   * set state.periods to the array of periodnames
   */
  $: if (state.view && $PeriodsStore.periods) {
    loadPeriods();
    state.initialized = true;
  }

  function loadPeriods() {
    const longTimeAgo = dayjs().subtract(100, "years").toDate();

    state.periods = getPeriods().sort((a, b) => {
      return $PeriodsStore.periods[a].last < $PeriodsStore.periods[b].last ? 1 : -1;
    });
    state.initialized = true;
  }

  async function addPeriod() {
    try {
      let periodname = await Interact.prompt(Lang.t("periods.period-name", "Period Name"));
      if (periodname) {
        let period = await PeriodsStore.addByName(periodname);
        if (period) {
          LedgerStore.fastLog(`Added ~${period.periodname} to +nomie`);
          periodClicked(period.periodname);
        }
      }
    } catch (e) {
      Interact.alert("Error", e.message);
    }
  }

  function getPeriods() {
    // The $PeriodsStore.periods is a map - periodname is the key
    if (state.searchTerm) {
      return Object.keys(($PeriodsStore || {}).periods || {}).filter((period) => {
        return period.toLowerCase().search(state.searchTerm) > -1;
      });
    } else {
      return Object.keys(($PeriodsStore || {}).periods || {});
    }
  }

  onMount(() => {
    loadPeriods();
  });
</script>

<style lang="scss">

</style>

<NLayout pageTitle="Periods">

  <div slot="header" class="n-row">
    <NToolbar className="container px-2">
      <Button
        color="none"
        shape="circle"
        className="tap-icon"
        on:click={() => {
          SearchStore.view('periods');
        }}>
        <NIcon name="search" size={24} />
      </Button>
      <div class="filler pl-2 truncate">
        {#if state.periods.length}
          <Text center bold>{Lang.t('tabs.periods', 'Periods')}</Text>
        {/if}
      </div>
      <Button color="none" shape="circle" className="tap-icon" on:click={addPeriod}>
        <NIcon name="add" className="fill-primary-bright" />
      </Button>
    </NToolbar>
  </div>

  <div slot="content" class="container">
    <div class="n-list my-2 bg-transparent">
      {#if !state.periods.length && !state.searchTerm && state.initialized}
        <Empty
          title={Lang.t('general.periods')}
          emoji="⏳"
          description={Lang.t('periods.empty-message', 'Track & monitor specific periods in your life')}
          buttonLabel={Lang.t('periods.add-a-period', 'Add a Period...')}
          buttonClick={addPeriod} />
      {:else if !state.initialized}
        <NItem>Loading...</NItem>
      {:else if !state.periods.length && state.searchTerm}
        <NItem>Nothing found for @{state.searchTerm}</NItem>
      {/if}

      <div class="trackers n-grid">
        {#each state.periods as period, index (index)}
          <ListPeriodItem
            period={$PeriodsStore.periods[period]}
            on:click={() => {
              periodClicked2($PeriodsStore.periods[period]);
            }}
            on:more={() => {
              periodClicked2($PeriodsStore.periods[period]);
            }} />
        {/each}
      </div>

    </div>
  </div>
</NLayout>

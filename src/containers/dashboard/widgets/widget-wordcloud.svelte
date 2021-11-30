<script lang="ts">
  import { Widget } from "../../../modules/dashboard/widget";
  import { wordcloudtemplates } from "./widget-wordcloud-templates";
  import Wordcloud from "../../../components/charts/wordcloud.svelte";
  import { LedgerStore } from "../../../store/ledger";
  import tick from "../../../utils/tick/tick";
  import { onMount } from "svelte";
  import { PeopleStore } from "../../../store/people-store";
  import { UserStore } from "../../../store/user-store";

  export let widget: Widget;

  let wctemplates = [];
  let wcwords = [{text:"Loading",count:20}];
  let wctheme = widget.wctheme;
  let filters = widget.filters;
  let lastFilters;
  let primlabel;
  let seclabel;
  
  

  $: if (widget) {
    filters = widget.filters;
    wctheme = widget.wctheme;
    primlabel = widget.timeRange.label;
    try {
      seclabel = widget.secondairyTimeRange.label;
    } catch(error){
      seclabel = widget.timeRange.label;
    }
  }

  function addPersons() {
    wctemplates = wordcloudtemplates;
    let tempterms=[];
    tempterms = Object.keys(($PeopleStore || {}).people || {});
    if (tempterms.length == 0) {tempterms = ["no_people_found"]}
    wctemplates[0]={wordcloudname: "persons",
    displayName: "Persons",
    notes: "These are all terms related to persons",
    terms: tempterms};
  }

  // React to Filter Change
  $: if (filters && lastFilters !== filters) {
    lastFilters = filters;
    getWords();
  }

  // React to Theme Change
  $: if (wctheme) {
    getWords();
  }

  // React to Person Change
  $: if (wctemplates) {
    getWords();
  }

  // React to Time Range Change
  $: if(primlabel || seclabel) {
    getWords();
  }

  async function getWords() {
    addPersons();
    const fulltext = await search();
    wcwords = count(fulltext);
    if (wcwords.length ==0) {wcwords = [{text:"Nothing Found",count:20}] }
  }

  function count(fulltext) {
    let wcarray = [];
    const thistheme = wctemplates.find(element => element.wordcloudname == wctheme);
    for (const wcterm of thistheme.terms){
      var re = new RegExp(wcterm, 'gi');
      var counts = (fulltext.match(re) || []).length;
      if (counts > 0){
        wcarray.push({text:wcterm,count:counts});}
  }
  return wcarray;
}
  async function search() {
    let alllogs = [];
    let dateRange= widget.getDateRange($UserStore.meta.firstDayOfWeek);
    let from = dateRange[0]; // get  start
    let to = dateRange[1]; // get end

    // Query the ledger
    if (!filters) {filters = ["nojournalselected"];}
    for (const subfilter of filters){
      let book = await LedgerStore.query({
        start: from,
        end: to,
        search: subfilter.value,
      });
      //
      alllogs = [...alllogs, ...book].sort((a, b) => {
        return a.end > b.end ? 1 : -1;
      });
    }
    let alltext = "";
    for (const log of alllogs){
      alltext = alltext +" "+log.note;}
    await tick(12);
    return alltext;
  }

  onMount(() => {
    getWords();
  });
  
</script>

<div class="value">
  <Wordcloud
  words={wcwords}/>
</div>


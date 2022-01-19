<script>
  import { createEventDispatcher } from "svelte";
  export let startDateMin;
  export let endDateMax;
  export let name;
  export let heading;
  export let labels;
  export let endDateId;
  export let startDateId;
  export let start = new Date();
  export let end = new Date();
  
  let defaultLabels = {
    notSet: 'not set',
    greaterThan: 'greater than',
    lessThan: 'less than',
    range: 'range',
    day: 'day',
    days: 'days!!',
    apply: 'Apply'
  }

  labels = {...defaultLabels, ...labels};

  if (!endDateMax) {
    endDateMax = new Date();
    endDateMax = new Date(
      new Date().setFullYear(
        endDateMax.getFullYear(),
        endDateMax.getMonth() + 12
      )
    );
  }
  if (!startDateMin) {
    startDateMin = new Date(
      new Date().setFullYear(
        endDateMax.getFullYear(),
        endDateMax.getMonth() - 24
      )
    );
  }

  const dispatch = createEventDispatcher();

  let today = new Date();

  const todayRfc = timeStampToRfc(today);
  const todayTimestamp = dateToTimeStamp(today);
  const startDateMinTimestamp = dateToTimeStamp(startDateMin);
  const endDateMaxTimestamp = dateToTimeStamp(endDateMax);
  const startDateMinRfc = timeStampToRfc(startDateMin);
  const endDateMaxRfc = timeStampToRfc(endDateMax);

  let sliderStartTimestamp = todayTimestamp;
  let sliderEndTimestamp = todayTimestamp;
  let startDate = timeStampToRfc(start);
  let endDate = timeStampToRfc(end);

  let lessThan = false;
  let greaterThan = false;
  let daysInDateRange;

  $: daysInDateRange = numberOfDaysBetweenSelectedDateRange(startDate, endDate);
  $: end = dateToTimeStamp(endDate);
  $: start = dateToTimeStamp(startDate);
  
  
  function dateOrSliderChange(item) {
    if (item == "endDate" && endDate && endDate < startDate)
      startDate = endDate;

    if (item == "startDate" && startDate && startDate > endDate && endDate)
      endDate = startDate;

    if (item == "endDate" || item == "startDate") {
      sliderEndTimestamp = dateToTimeStamp(endDate);
      sliderStartTimestamp = dateToTimeStamp(startDate);
    }

    if (
      (item == "sliderEndTimestamp" &&
        sliderEndTimestamp < sliderStartTimestamp) ||
      !sliderStartTimestamp
    )
      sliderStartTimestamp = sliderEndTimestamp;

    if (
      (item == "sliderStartTimestamp" &&
        sliderStartTimestamp > sliderEndTimestamp) ||
      !sliderEndTimestamp
    )
      sliderEndTimestamp = sliderStartTimestamp;

    if (item == "sliderEndTimestamp" || item == "sliderStartTimestamp") {
      endDate = timeStampToRfc(sliderEndTimestamp);
      startDate = timeStampToRfc(sliderStartTimestamp);
    }

    if (!endDate && startDate) {
      greaterThan = true;
      lessThan = false;
    }
    if (!startDate && endDate) {
      greaterThan = false;
      lessThan = true;
    }
    if (startDate && endDate) {
      lessThan = false;
      greaterThan = false;
    }
  }

  function timeStampToRfc(date) {
    if (date) return new Date(date).toJSON().slice(0, 10);
    return undefined;
  }

  function dateToTimeStamp(date) {
    if (date) return new Date(date).valueOf();
    return undefined;
  }

  function numberOfDaysBetweenSelectedDateRange(startDate, endDate) {
    if (endDate == startDate) {
      return `1 ${labels.day}`;
    } else {
      const differenceInTime =
        new Date(endDate).getTime() - new Date(startDate).getTime();
      return (differenceInTime / (1000 * 3600 * 24)).toString() + ` ${labels.days}`;
    }
  }
  
  const apply = () => {
    dispatch("onApplyDateRange", {
      startDate: startDate,
      endDate: endDate,
      name: name
    });
  };

</script>

<style>
  
  .sliderEnd {
    background: var(--sliderEndBackgroundColor, #007bff);
    height: var(--sliderEndHeight, 10px);
    width: 48%;
    cursor: pointer;
    margin: var(--sliderEndMargin, 2px);
    
  }
  .sliderStart {
    background: var(--sliderStartBackgroundColor, #007bff);
    height: var(--sliderStartHeight, 10px);
    width: 48%;
    cursor: pointer;
    margin: var(--sliderStartMargin, 2px);
    
  }
  .heading {
    color: var(--headingColor, #444);
    font-size: var(--headerFontSize, 0.825em);
    font-weight: var(--headerFontWeight, 500);
  }
  .dateSelect{
    color: var(--dateSelectColor, #000);
    font-size: var(--dateSelectFontSize, 0.825em);
    font-weight: var(--dateSelectFontWeight, 300);
    height: var(--dateSelectHeight, 34px);
    width: 48%;
    margin-bottom: var(--dateSelectMarginBottom, 5px);
    
  }
</style>


<span class="heading">
  {heading}
  
  {#if !startDate && !endDate}
    {labels.notSet}
  {:else if lessThan}
    {labels.lessThan}
  {:else if greaterThan}
    {labels.greaterThan}
  {:else}
    {labels.range} {daysInDateRange}
  {/if}
</span>

<br />

<input
  type="date"
  id={startDateId} 
  class='dateSelect'
  min={startDateMinRfc}
  max={endDateMaxRfc}
  bind:value={startDate}
  on:input={() => {
    dateOrSliderChange('startDate');
  }} />

<input
  type="date"
  id={endDateId}
  class='dateSelect'
  min={startDateMinRfc}
  max={endDateMaxRfc}
  bind:value={endDate}
  on:input={() => {
    dateOrSliderChange('endDate');
  }} />



<br />

<input
  type="range"
  class="sliderStart"
  bind:value={sliderStartTimestamp}
  min={startDateMinTimestamp}
  max={endDateMaxTimestamp}
  step="86400000"
  title={new Date(startDate)}
  on:input={() => {
    dateOrSliderChange('sliderStartTimestamp');
  }} />

<input
  type="range"
  class="sliderEnd"
  bind:value={sliderEndTimestamp}
  min={startDateMinTimestamp}
  max={endDateMaxTimestamp}
  step="86400000"
  title={new Date(endDate)}
  on:input={() => {
    dateOrSliderChange('sliderEndTimestamp');
  }} />

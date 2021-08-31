<script lang="ts">
  import ListItem from "./list-item.svelte";
  import Button from "../../components/button/button.svelte";
  import Text from "../../components/text/text.svelte";
  import Icon from "../../components/icon/icon.svelte";
  import { PeriodStore } from "../../store/periods-store";
  import dayjs from "dayjs";
  import { createEventDispatcher } from "svelte";
  import { Interact } from "../../store/interact";
  import { UserStore } from "../../store/user-store";
  import Dymoji from "../../components/dymoji/dymoji.svelte";

  import Avatar from "../avatar/avatar.svelte";
  export let period: Period;

  const dispatch = createEventDispatcher();
  let startdate = dayjs(period.start);
  let enddate = dayjs(period.end);
  
  $: if (period) {
    startdate = dayjs(period.start);
    enddate = dayjs(period.end);
  }

</script>

{#if period}
  <ListItem
    id="period-{period.periodname}"
    style="--tracker-color:{period.periodcolor}"
    className="tracker-board-button py-2 tracker-list-item flex-shrink-off has-value)"
      
    clickable
    compact
    on:click={(evt) => {
      if (['svg'].indexOf(evt.detail.target.tagName) == -1) {
        dispatch('click', period);
      }
    }}
  >
    <div class="highlight" style="background-color:{period.periodcolor}" />
    <div slot="left" class="pr-0 n-row justify-content-center">
      {#if period.icon}
            <Dymoji icon={period.icon} size={50} radius={0.3} color={period.periodcolor}/>
      {:else}
            <Dymoji periodname={period.periodname} size={50} radius={0.3} color={period.periodcolor}/>
      {/if}
    </div>
    <div>
      <Text size="md" leading2 className="tracker-label">{period.displayName}</Text>
      <Text left faded size="sm">Period from {startdate.format($UserStore.meta.is24Hour ? 'Do MMM YYYY' : 'MMM Do YYYY')} to {enddate.format($UserStore.meta.is24Hour ? 'Do MMM YYYY' : 'MMM Do YYYY')}</Text>
    </div>
    <span slot="right" class="mr-2">
        <Button
          shape="circle"
          color="light" 
          style="z-index:1000"
          on:click={() => {
            dispatch("more", period);
          }}
        >
          <Icon name="more" size="18" className="prevent fill-inverse-1" />
        </Button>
    </span>
  </ListItem>
{/if}

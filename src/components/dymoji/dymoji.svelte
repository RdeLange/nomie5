<script>
import PeriodModal from "../../containers/periods/period-modal.svelte";

  import Dymoji from "./dymoji";

  export let username = undefined;
  export let periodname = undefined;
  export let avatar = undefined;
  export let icon = undefined;
  export let person = undefined;
  export let period = undefined;
  export let addon = undefined;
  export let size = 42;
  export let radius = 0.12;
  export let color = "#ffffff";

  export let className = "";

  let svg = null;
  let img = null;

  const getSVG = (term) => {
    return new Dymoji(term, {
      size,
      radius,
    },color).svg();
  };

  $: if (username) {
    svg = getSVG(username);
  } else if (periodname) {
    svg = getSVG(periodname);
  } else if (avatar) {
    img = avatar;
  } else if (icon) {
    img = icon;
  } else if (person) {
    if (person.avatar) {
      img = person.avatar;
    } else {
      svg = getSVG(person.username);
    }
  } else if (period) {
    if (period.icon) {
      img = period.icon;
    } else {
      svg = getSVG(period.periodname);
    }
  } else if (addon) {
    if (addon.avatar) {
      img = addon.avatar;
    } else {
      svg = getSVG(addon.addonname);
    }  
  }else {
    svg = getSVG("unknown");
  }
</script>

<style lang="scss">
  .dymoji-wrap {
    display: inline-flex;
    vertical-align: middle;
    position: relative;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
  }
</style>

<div
  class="dymoji-wrap {className}"
  style="width:{size}px; height:{size}px; border-radius:{size * radius}px; {img ? `background-image:url(${img})` : ``}">
  {#if svg}
    {@html svg}
  {/if}
</div>

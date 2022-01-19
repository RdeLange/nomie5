<script lang="ts">
  import { Link } from "svelte-routing";
  import { UserStore } from "../../../store/user-store";
  import Icon from "../../../components/icon/icon.svelte";

  $: hideLabels = $UserStore.meta.hideLabels;

  export let label: string;
  export let icon: string;
  export let link: string;
  export let notify: boolean = false;
</script>

<style global lang="scss">
  .circle-wrap {
    position:absolute;
    display: flex;
    flex-grow: 1;
    height: 100%;
    align-items: center;
  }

  .circle-wrap a {
    position: absolute;
    color: greenyellow;
    //color: var(--color-inverse-2);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 6px 10px;
    font-size: 0.7em;
    height: 100%;
    text-decoration: none;
    flex-grow: 1;
    flex-shrink: 1;
    // opacity: 0.6;
    transition: all 0.2s ease-in-out;
    min-width: 30px;
    width: 100%;
    i {
      pointer-events: none;
      font-size: 1.2em;
      transition: all 0.2s ease-in-out;
    }
    label {
      pointer-events: none;
      margin-bottom: 0;
    }

    // When Active
    &[aria-current="page"] {
      color: var(--color-primary-bright);
      svg {
        transition: all 0.2s ease-in-out;
      }
      &:after {
        content: "";
      }
    }
  }
</style>

<div class="circle-wrap circle-{label}" aria-label={label}>
  {#if notify}<div class="notify"></div>{/if}
  <Link to={link}>
    <slot />
    <Icon name={icon} />
    {#if !hideLabels}
      <label>{label}</label>
    {/if}
  </Link>
</div>

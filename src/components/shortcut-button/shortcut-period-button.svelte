<script lang="ts">
  import ShortcutButton from "./shortcut-button.svelte";
  import dayjs from "dayjs";
  import { createEventDispatcher } from "svelte";
  import Avatar from "../avatar/avatar.svelte";
  export let period: Period;

  const dispatch = createEventDispatcher();
</script>

{#if period}
  <ShortcutButton
    compact
    hideValue
    moreIcon="eye"
    on:more={() => {
      dispatch('more', period);
    }}
    title={(period || {}).displayName}
    subtitle={period.last ? dayjs(period.last).fromNow() : 'no date'}
    on:click={() => {
      dispatch('click', period);
    }}>
    <div slot="emoji">
      <Avatar size={48} src={period.icon} label={period.displayName} />
    </div>
  </ShortcutButton>
{/if}

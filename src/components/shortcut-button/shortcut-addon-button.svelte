<script lang="ts">
  import ShortcutButton from "./shortcut-button.svelte";

  import { PeopleStore } from "../../store/people-store";
  import dayjs from "dayjs";
  import { createEventDispatcher } from "svelte";
  import { Interact } from "../../store/interact";

  import Avatar from "../avatar/avatar.svelte";
  import type Addon from "../../modules/addon/addon";
  export let addon: Addon;

  const dispatch = createEventDispatcher();
</script>

{#if addon}
  <ShortcutButton
    compact
    hideValue
    hideMore = {false}
    moreIcon="remove"
    addon={true}
    color="primary"
    addoncolor={addon.addoncolor} 
    on:more={() => {
      dispatch('more', addon);
    }}
    title={(addon || {}).displayName}
    subtitle={addon.last ? dayjs(addon.last).fromNow() : 'no date'}
    on:click={() => {
      dispatch('click', addon);
    }}>
    <div slot="emoji">
      <Avatar size={70} src={addon.avatar} label={addon.displayName} />
    </div>
  </ShortcutButton>
{/if}

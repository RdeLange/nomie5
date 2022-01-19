<script lang="ts">
  import ShortcutButton from "./shortcut-button.svelte";

  import { PeopleStore } from "../../store/people-store";
  import dayjs from "dayjs";
  import { createEventDispatcher } from "svelte";
  import { Interact } from "../../store/interact";

  import Avatar from "../avatar/avatar.svelte";
  import type Journal from "../../modules/journal/journal";
  export let journal: Journal;

  const dispatch = createEventDispatcher();
</script>

{#if journal}
  <ShortcutButton 
    compact
    hideValue
    hideMore = {false}
    moreIcon="chart"
    journal={true}
    color="primary"
    journalcolor={journal.journalcolor}
    on:more={() => {
      dispatch('more', journal);
    }}
    title={(journal || {}).displayName}
    subtitle={journal.last ? dayjs(journal.last).fromNow() : 'no date'}
    on:click={() => {
      dispatch('click', journal);
    }}>
    <div slot="emoji">
      <Avatar size={48} src={journal.avatar} label={journal.displayName} />
    </div>
  </ShortcutButton>
{/if}

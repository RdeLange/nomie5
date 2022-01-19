<script>
  import { onMount } from "svelte";
  import NItem from "../components/list-item/list-item.svelte";
  import NToolbar from "../components/toolbar/toolbar.svelte";
  import Text from "../components/text/text.svelte";
  import NIcon from "../components/icon/icon.svelte";
  import Button from "../components/button/button.svelte";
  import NLayout from "../containers/layout/layout.svelte";
  import ShortcutAddonButton from "../components/shortcut-button/shortcut-addon-button.svelte"; //done

  import { Lang } from "../store/lang";
  import { AddonsStore } from "../store/addons-store"; //rdl done
  import { Interact } from "../store/interact";
  import { LedgerStore } from "../store/ledger";
  import { SearchStore } from "../store/search-store";

  import { addonCatalogue } from "../containers/addons/addonCatalogue"; //done
  import dayjs from "dayjs";
  import Empty from "../containers/empty/empty.svelte";
  export const location = undefined;

  let state = {
    Addons: [],
    view: "time",
    stats: {},
    searchTerm: null,
    initialized: false,
  };

  const addonClicked = (addonname) => {
    Interact.addon(addonname,"main");
  };

  /**
   * When AddonStore Changes,
   * set state.addons to the array of addonnames
   */
  $: if (state.view && $AddonsStore.addons) {
    loadAddons();
    state.initialized = true;
  }

  function loadAddons() {
    const longTimeAgo = dayjs().subtract(100, "years").toDate();

    state.addons = getAddons().sort((a, b) => {
      return $AddonsStore.addons[a].last < $AddonsStore.addons[b].last
        ? 1
        : -1;
    });
    state.initialized = true;
  }

  async function installAddon(addon_from_catalogue) {
    try {
      let addonname = addon_from_catalogue.addonname;
      if (addonname) {
        let addon = await AddonsStore.addByCatalogue(addon_from_catalogue);
        if (addon) {
          LedgerStore.fastLog(`Installed ^${addon.addonname} addon to +nomie`);
        }
      }
    } catch (e) {
      Interact.alert("Error", e.message);
    }
   }

  async function chooseAddon(addon_from_catalogue) {
    
    installAddon(addon_from_catalogue);
  }
  
  async function addAddon() {
    let buttons = [];
    for (var i = 0; i < addonCatalogue.length; i++) {
      let tmp ="";
      tmp = addonCatalogue[i];
      if (tmp.addonname !== "template"){
      buttons.push({title: addonCatalogue[i].displayName,click: () => {
            chooseAddon(tmp);}, icon:"addOutline"})}
      
    }
    Interact.popmenu({
      title: "Choose Addon to install",
      buttons,
    });
  }

  function getAddons() {
    // The $AddonsStore.addons is a map - addonname is the key
    if (state.searchTerm) {
      return Object.keys(($AddonsStore || {}).addons || {}).filter(
        (addon) => {
          return addon.toLowerCase().search(state.searchTerm) > -1;
        }
      );
    } else {
      return Object.keys(($AddonsStore || {}).addons || {});
    }
  }

  async function deleteAddon(addonname) {
    let confirmed = await Interact.confirm(
      `Remove this Addon?`,
      "This will delete the addon and all its data."
    );
    if (confirmed) {
      await AddonsStore.deleteAddon(addonname);
      Interact.toast(`Addon removed`); 
      close();
    }
  }

  onMount(() => {
    loadAddons();
  });
</script>

<NLayout pageTitle="Available Nomie Addons">
  <div slot="header" class="n-row">
    <NToolbar className="container px-2">
      <div class="filler pl-2 truncate">
        {#if state.addons.length}
          <Text center bold>{Lang.t("tabs.addons", "Addons")}</Text>
        {/if}
      </div>
      <Button
        color="none"
        shape="circle"
        className="tap-icon"
        on:click={addAddon}
      >
        <NIcon name="add" size={24} />
      </Button>
    </NToolbar>
  </div>

  <div slot="content" class="container">
    <div class="n-list my-2 bg-transparent">
      {#if !state.addons.length && !state.searchTerm && state.initialized}
        <Empty
          title={Lang.t("general.addons")}
          emoji="🧩"
          description={Lang.t(
            "addon.empty-message",
            "All installed addons will be listed here"
          )}
          buttonLabel={Lang.t(
            "addons.install",
            "Install your first Addon!"
          )}
          buttonClick={addAddon}
        />
      {:else if !state.initialized}
        <NItem>Loading...</NItem>
      {/if}

      <div class="trackers n-grid">
        {#each state.addons as addon, index (index)}
          <ShortcutAddonButton
            addon={$AddonsStore.addons[addon]}
            on:click={() => {
              addonClicked(addon);
            }}
            on:more={() => {
              deleteAddon(addon);
            }}
          />
        {/each}
      </div>
    </div>
  </div>
</NLayout>

<style lang="scss">
</style>

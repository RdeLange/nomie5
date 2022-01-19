<script>
  // Components
  import { onMount } from 'svelte';
  import Modal from "../../../components/modal/modal.svelte";
  import NToolbar from "../../../components/toolbar/toolbar.svelte";
  import NIcon from "../../../components/icon/icon.svelte";
  import NToolbarGrid from "../../../components/toolbar/toolbar-grid.svelte";
  import ButtonGroup from "../../../components/button-group/button-group.svelte";
  import Text from "../../../components/text/text.svelte";
  //import SvgIcon from '../../components/icon/SvgIcon.svelte';
  import { Interact } from "../../../store/interact";
  import Button from "../../../components/button/button.svelte";
  //import { addonCatalogue } from "../containers/addons/addonCatalogue";
  import Dymoji from "../../../components/dymoji/dymoji.svelte";
  import tick from "../../../utils/tick/tick";
  import { AddonsStore } from "../../../store/addons-store";
  import Addon from "../../../modules/addon/addon";
  
  let domVisible = false;
  let activeAddon;
  let lastActiveAddonKey;
  
  
  $: if (
    $Interact.addons.active &&
    lastActiveAddonKey !== $Interact.addons.active
  ) {
    lastActiveAddonKey = $Interact.addons.active;
    domVisible = true;
    activeAddon = new Addon($AddonsStore.addons[$Interact.addons.active]);
  }


  const state = {
      view: "main",
    };

  
  async function close() {
    domVisible = false;
    await tick(200);
    Interact.addon(null,null,null);
  }

  async function changeView(view) {
    state.view = view;
  }

  onMount(() => {
    
  });
</script>

<style lang="scss">
  
  :global(.person-checkin .btn-group .active div) {
    font-size: 2em !important;
  }
</style>

<Modal className="addon-modal" bodyClass="bg-bg" show={domVisible} type="bottom-slideup" ariaLabel="Addon-Template">
  <header class="w-100" slot="header" on:swipedown={close}>
    <NToolbarGrid>
      <div slot="left">
        <Button icon on:click={close}>
          <NIcon name="close" className="fill-primary-bright" />
        </Button>
      </div>
      <div class="main">
        <div class="n-row">
          <Dymoji addon={activeAddon} size={26} radius={0.3} color={activeAddon.addoncolor}/>
          &nbsp; {activeAddon.getDisplayName()}
         
        </div>
      </div>
      
    </NToolbarGrid>
    <NToolbar>
      <ButtonGroup
        size="sm"
        buttons={[{ label: 'Main', active: state.view === 'main', click() {
              changeView('main');
            } }, { label: 'Configuration', active: state.view === 'configuration', click() {
              changeView('configuration');
            } }, { label: 'Documentation', active: state.view === 'documentation', click() {
              changeView('documentation');
            } }]} />
    </NToolbar>
  </header>

  <main>
    {#if state.view == 'main'}
      <Text>SOMETHING WENT WRONG WHILE LOADING THIS ADDON</Text>
    {:else if state.view == 'configuration'}
       <Text>SOMETHING WENT WRONG WHILE LOADING THIS ADDON</Text>
    {:else if state.view == 'documentation'}
      <Text>SOMETHING WENT WRONG WHILE LOADING THIS ADDON</Text>
    {/if}
  </main>

</Modal>

<script>
   import WolCard from "./wol-card.svelte"
   import { createEventDispatcher, onMount } from "svelte";
   const dispatch = createEventDispatcher();
   
   export let calculations = [];
   

   

</script>

<style>
    
    
    .content {
      --space: 0.8rem;
      --space-md: calc(var(--space) * 2);
      --gap: var(--space-md);

      margin-block: 0.1rem;
      
      font-family: sans-serif;
      font-size: 1.2rem;
      line-height: 1.5;

      display: grid;
      grid-template-columns: 1fr min(60ch, calc(100% - var(--gap) * 2)) 1fr;
      column-gap: var(--gap);
      margin-inline: auto;
    }
    
    .content > * {
      grid-column: 2;
    }
    
    
    .gallery {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: inherit;
      padding-block: var(--space-md);
      overflow-x: scroll;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      padding-top: 0px;
    }
    
    .gallery::-webkit-scrollbar {
      inline-size: 0 !important;
      display: none;
    }
    
    .gallery .wrap {
      grid-column: 2;
      display: flex;
      gap: var(--space);
    }
    
    .gallery .wrap::after {
      content: "";
      padding-inline-end: calc(var(--gap) / 2);
    }
    
    .gallery .item {
      flex: 1 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: center;
      inline-size: 260px;
      max-inline-size: 260px;
      aspect-ratio: 16 / 8;
      font-size: 2rem;
      background: transparent;
      border-radius: 4px;
    }
    
    @supports not (aspect-ratio: 16 / 9) {
      .gallery .item::before {
        float: left;
        padding-top: 56.25%;
        content: "";
      }
    
      .gallery .item::after {
        display: block;
        content: "";
        clear: both;
      }
    }
    
    
    
    </style>
    <main class="content">
        
        <div class="gallery">
          <div class="wrap">
            <div class="item"><WolCard type="add" on:addcard={() => {dispatch("addcard");}}></WolCard></div>
            {#each calculations as calculation}
            <div class="item"><WolCard type="calculation" data={calculation} on:deletecard={() => {dispatch("deletecard",calculation);}} on:editcard={() => {dispatch("editcard",calculation);}}></WolCard></div>
            {/each}
          </div>
        </div>
      </main>
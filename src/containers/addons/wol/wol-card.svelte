<script>
  import Icon from "../../../components/icon/icon.svelte";
  import Button from "../../../components/button/button.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import Text from "../../../components/text/text.svelte";
  
  export let type = "undefined";
  export let data ={};


  const dispatch = createEventDispatcher();

  
</script>

<style>
    * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}



/* CARDS */

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  margin: 2px;
  padding: 2px;
  width: 260px;
  min-height: 120px;
  max-height: 120px;
  display: grid;
  grid-template-rows: 20px 50px 1fr 50px;
  border-radius: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.2s;
}

.cardadd {
  margin: 2px;
  padding: 2px;
  width: 260px;
  min-height: 120px;
  max-height: 120px;
  display: flex;
  grid-template-rows: 100%;
  border-radius: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
  transform: scale(1.01);
}



.card__exit {
  grid-row: 1/2;
  justify-self: end;
}

.card__icon {
  grid-row: 1/2;
  font-size: 30px;
}

.card__title {
  grid-row: 2/5;
  font-weight: 40;
  color: #000000;
  font-size: 15px;
  margin: 10px;
}

.card__title__add {
  grid-row: 1/3;
  font-weight: 200;
  color: #000000;
  font-size: 100px;
  margin-left: 105px;
  margin-top: 40px;
}

/* CARD BACKGROUNDS */

.card-1 {
  background: radial-gradient(#dddedf,rgb(185, 185, 185));
  /* background: radial-gradient(#1fe4f5, #3fbafe);*/
}
.card-2 {
  background: radial-gradient(#fbc1cc, #fa99b2);
  
}

</style>



<!-- 

GRADIENT BANNER DESIGN BY SIMON LURWER ON DRIBBBLE:
https://dribbble.com/shots/14101951-Banners

-->

    <div class="cards">
      {#if type == "add"}
        <div class="cardadd card-2" >
          <h3 class="card__title__add">
            <Button
                  size="xl"
                  color="clear"
                  className="p-1" 
                  on:click={() => {
                  dispatch("addcard");
                  }}
              >
                  <Icon name="add" style="fill: var(--color-inverse-2)" size="50" />
              </Button>
          </h3>
        </div>
      {/if}
      {#if type == "calculation"}
      <div class="card card-1">
        <div class="card__icon"><i class="fas fa-bolt"><Button
          size="xs"
          color="clear"
          className="p-1" 
          on:click={() => {
          dispatch("deletecard");
          }}
      >
          <Icon name="delete" style="fill: var(--color-inverse-2)" size="24" />
      </Button></i></div>
        <p class="card__exit"><i class="fas fa-times">
            <Button
                size="xs"
                color="clear"
                className="p-1" 
                on:click={() => {
                dispatch("editcard");
                }}
            >
                <Icon name="settings" style="fill: var(--color-inverse-2)" size="24" />
            </Button>
        </i></p>
        <h3 class="card__title">Select {data.statistics} from {data.element.id} for the {data.timeRange.label} scaled between {data.minscale} and {data.maxscale} with a weighting factor of {data.weight}</h3>
      </div>
      {/if}
    </div>
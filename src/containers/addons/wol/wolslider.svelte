<script>
import Text from "../../../components/text/text.svelte";
export let slidername ="WOL Slider";
export let slidervalue= 1;
export let disabled = true;

</script>

<style>
    input[type='range'] {
  position: relative;
  margin: 0em;
  left: 50%;
  border: solid 0 transparent;
  border-width: 0 1em;
  padding: 1em 0 0;
  width: 22em;
  height: 2em;
  border-radius: .25em;
  transform: translate(-50%, -50%);
  background: transparent;
  font-size: 1em;
  cursor: pointer;
}

input[type='range'],
input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  position: relative;
  width: 20em;
  height: 0.375em;
  background: linear-gradient(90deg, #ffffff 0.125em, rgba(0, 0, 0, 0) 0.125em)-0.0625em 50%, linear-gradient(90deg, #e60000, #e63900, #e67300, #e6ac00, #e6e600, #ace600, #73e600);
  background-size: 2em 100%, 100% 100%;
}

input[type='range']::-moz-range-track {
  width: 20em;
  height: 0.375em;
  background: linear-gradient(90deg, #ffffff 0.125em, rgba(0, 0, 0, 0) 0.125em)-0.0625em 50%, linear-gradient(90deg, #e60000, #e63900, #e67300, #e6ac00, #e6e600, #ace600, #73e600);
  background-size: 2em 100%, 100% 100%;
}

input[type='range']::-ms-track {
  border: none;
  width: 20em;
  height: 0.375em;
  background: linear-gradient(90deg, #ffffff 0.125em, rgba(0, 0, 0, 0) 0.125em)-0.0625em 50%, linear-gradient(90deg, #e60000, #e63900, #e67300, #e6ac00, #e6e600, #ace600, #73e600);
  background-size: 2em 100%, 100% 100%;
  color: transparent;
}

input[type='range']::-ms-fill-lower {
  display: none;
}

input[type='range']::-webkit-slider-thumb {
  margin-top: -0.8125em;
  box-sizing: border-box;
  border: solid 1px transparent;
  width: 2em;
  height: 2em;
  border-radius: 0;
  transform: translateY(75%) rotate(30deg) skewY(30deg) scaleX(0.86603);
  background: linear-gradient(135deg, #a7a6a2 25%, rgba(0, 0, 0, 0) 25%) content-box, linear-gradient(135deg, #ffffff 25%, rgba(0, 0, 0, 0) 25%) border-box;
}

input[type='range']::-moz-range-thumb {
  box-sizing: border-box;
  border: solid 1px transparent;
  width: 2em;
  height: 2em;
  border-radius: 0;
  transform: translateY(75%) rotate(30deg) skewY(30deg) scaleX(0.86603);
  background: linear-gradient(135deg, #a7a6a2 25%, rgba(0, 0, 0, 0) 25%) content-box, linear-gradient(135deg, #ffffff 25%, rgba(0, 0, 0, 0) 25%) border-box;
}

input[type='range']::-ms-thumb {
  box-sizing: border-box;
  border: solid 1px transparent;
  width: 2em;
  height: 2em;
  border-radius: 0;
  transform: translateY(75%) rotate(30deg) skewY(30deg) scaleX(0.86603);
  background: linear-gradient(135deg, #a7a6a2 25%, rgba(0, 0, 0, 0) 25%) content-box, linear-gradient(135deg, #ffffff 25%, rgba(0, 0, 0, 0) 25%) border-box;
}

input[type='range']::-webkit-slider-runnable-track:before,
input[type='range']::-webkit-slider-runnable-track:after,


input[type='range']::-webkit-slider-runnable-track:before,


input[type='range']::-webkit-slider-runnable-track:after,


input[type='range']:focus {
  outline: none;
  box-shadow: none;
}
</style>

{#if disabled}
<Text bold={true} center={true}>{slidername} (calculated)</Text>
<input id={slidername} type="range" disabled min="0.1" max="1" step="0.1" bind:value={slidervalue} />
{:else }
<Text bold={true} center={true}>{slidername} (manual)</Text>
<input id={slidername} type="range" enabled min="0.1" max="1" step="0.1" bind:value={slidervalue} />
{/if}
  
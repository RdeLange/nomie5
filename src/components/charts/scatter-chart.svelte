<script type="ts">
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  import Chart from "chart.js";
  import NIcon from "../icon/icon.svelte";
  import nid from "../../modules/nid/nid";
  import { Interact } from "../../store/interact";
  import ignoreArrayZeros from "../../modules/stats/ignore-zeros";
  import _ from "lodash";
  export let height = 200;

  export let mainlabel = "";
  export let seclabel1 = "";
  export let seclabel2 = "";
  export let color = "#4d84a1";
  export let color2 = "#4d84a1";
  export let color3 = "#4d84a1";
  export let points: any;
  export let points2: any;
  export let points3: any;
  export let activeIndex = 2;
  export let xFormat: Function = (x) => x;
  export let yFormat: Function = (y) => y;
  export let hideYTicks: boolean = false;
  export let hideXTicks: boolean = false;
  export let showSelected: boolean = true;
  export let ignoreZero: boolean = false;
  export let ignoreZero2: boolean = false;
  export let ignoreZero3: boolean = false;
  export let showstats: string = "none";
  export let showlegend: boolean = true;

  // Generate a random ID for this Component
  const chartId = `chart-${nid()}`;

  let showChart = false;
  let _canvas;
  let theChart;
  let lastPoints = [];
  let lastPoints2 = [];
  let lastPoints3 = [];
  let lastshowstats = showstats;
  let lastshowlegend = showlegend;

  export let selected = undefined;

  var jitter = function (data) {
    return data.map(function (e) {
      var xJitter = Math.random() * (-1 - 1) + 1;
      var yJitter = Math.random() * (-1 - 1) + 1;
      return {
        x: e.x + xJitter,
        y: e.y + yJitter,
      };
    });
  };

  $: if ((points && theChart && points.map((p) => p.y).join() !== lastPoints) || (points2 && theChart && points2.map((p) => p.y).join() !== lastPoints2) || (points3 && theChart && points3.map((p) => p.y).join() !== lastPoints3)) {
    if (points) {lastPoints = points.map((p) => p.y).join()};
    if (points2) {lastPoints2 = points2.map((p) => p.y).join()};
    if (points3) {lastPoints3 = points3.map((p) => p.y).join()};
    loadData();
  }

  $: if (showlegend !== lastshowlegend) {
    lastshowlegend = showlegend;
    theChart.options.legend.display = showlegend;
    theChart.update();
  }  

  function combinedata(primairydata, secondairydata) {
    const length = primairydata.length;
    let index = 0;
    const combineddata = [];

    while (++index < length) {
      combineddata.push({ x: primairydata[index], y: secondairydata[index] });
    }
    return combineddata;
  }

  function loadData() {
    let secondairydata;
    let primairydata ;
    let data;
    if (!points2 && !points3) {
      primairydata = points.map((row) => row.y);
      secondairydata = points.map((row) => row.y);
      if (ignoreZero) {
        primairydata = ignoreArrayZeros(primairydata);
      }
      if (ignoreZero) {
        secondairydata = ignoreArrayZeros(secondairydata);
      }
      data = combinedata(primairydata, secondairydata);
      
      theChart.data.datasets[0] = {
        label: mainlabel.charAt(0).toUpperCase() + mainlabel.slice(1),
        borderColor: color,
        data: jitter(data),
        yAxisID: "First",
      };
    }

    if (points2) {
      primairydata = points.map((row) => row.y);
      secondairydata = points2.map((row) => row.y);
      if (ignoreZero) {
        primairydata = ignoreArrayZeros(primairydata);
      }
      if (ignoreZero2) {
        secondairydata = ignoreArrayZeros(secondairydata);
      }
      data = combinedata(primairydata, secondairydata);
      
      theChart.data.datasets[0] = {
        label: seclabel1.charAt(0).toUpperCase() + seclabel1.slice(1),
        borderColor: color2,
        data: jitter(data),
        yAxisID: "First",
      };
    }

    if (points3) {
      primairydata = points.map((row) => row.y);
      secondairydata = points3.map((row) => row.y);
      if (ignoreZero) {
        primairydata = ignoreArrayZeros(primairydata);
      }
      if (ignoreZero3) {
        secondairydata = ignoreArrayZeros(secondairydata);
      }
      data = combinedata(primairydata, secondairydata);
     
      theChart.data.datasets[1] = {
        label: seclabel2.charAt(0).toUpperCase() + seclabel2.slice(1),
        borderColor: color3,
        data: jitter(data),
        yAxisID: "Second",
      };
    }

    theChart.update();
  }

  async function initChart() {
    var ctx = document.getElementById(chartId);
    /**
     * Get Min Point so we can
     * adjust the Y scale min to be just below the min point (if it's greater than 0)
     * if its not greater than zero - then  zero will be the min
     */
    const minPoint: number = _.min(points.map((p) => p.y));
    const minPoint2: number = 0;
    const minPoint3: number = 0;

    if (points2) {
      const minPoint2: number = _.min(points2.map((p) => p.y));
    }
    if (points3) {
      const minPoint3: number = _.min(points3.map((p) => p.y));
    }

    // Create chart config
    let showsecticks1 = false;
    let showsecticks2 = false;

    if (points2) {
      showsecticks1 = true;
    }
    if (points3) {
      showsecticks2 = true;
    }

    const chartConfig = {
      type: "scatter",
      options: {
        maintainAspectRatio: false,
        title: {
          display: false,
          text: "Original Data",
        },
        defaultFontSize: 10,
        legend: {
          display: showlegend,
          position: "right",
          labels: {
            boxWidth: 5,
            boxHeight: 2,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        showLines: true,
        scales: {
          yAxes: [
            {
              id: "First",
              position: "left",
              ticks: {
                min: minPoint2 > 0 ? minPoint2 - 1 : 0,
                maxTicksLimit: 6,
                fontSize: 9,
                fontColor: color2,
                beginAtZero: false,
                display: hideYTicks == false,
              },
            },
            {
              id: "Second",
              position: "right",
              display: showsecticks2,
              ticks: {
                min: minPoint3 > 0 ? minPoint3 - 1 : 0,
                maxTicksLimit: 6,
                fontSize: 9,
                fontColor: color3,
                beginAtZero: false,
                display: hideYTicks == false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                min: minPoint > 0 ? minPoint - 1 : 0,
                fontSize: 9,
                beginAtZero: false,
                display: hideXTicks == false,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 3,
            borderWidth: 2,
            hoverRadius: 5,
            hoverBorderWidth: 3,
          },
        },
      },
    };

    theChart = new Chart(ctx, chartConfig);
    _canvas.addEventListener("click", (evt) => {
      let passed = theChart.getElementsAtEvent(evt);
      if (passed.length) {
        selected = points[passed[0]._index];
      }
      dispatch("tap", selected);
    });
  }

  onMount(() => {
    initChart();
    if (points) {
      showChart = true;
    }
  });
</script>

<div class="wrapper active-{activeIndex}" style="--chart-color:{color}">
  {#if selected && selected.unit == "day" && showSelected}
    <div class="selected">
      <button
        on:click={() => {
          selected = undefined;
          Interact.focusDate(undefined);
        }}
      >
        <NIcon name="close" className="fill-white" size="12" />
      </button>
      <button
        on:click={() => {
          Interact.onThisDay(selected.date.toDate());
        }}
      >
        <span class="mr-1 text-sm date faded">{xFormat(selected.x)}</span>
        <span class="d-value">{yFormat(selected.y)}</span>
        <NIcon name="chevronRight" className="fill-white" size="12" />
      </button>
    </div>
  {/if}
  <canvas id={chartId} bind:this={_canvas} width="100%" {height} />
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
  }
  .wrapper .selected {
    display: flex;
    align-items: center;
    position: absolute;
    right: 16px;
    background-color: var(--chart-color);
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    border-radius: 10px;
  }
  .wrapper .selected button {
    border: none;
    background: none;
    outline: none;
    color: #fff;
    height: 20px;
    font-size: 12px !important;
    display: flex;
    align-items: center;
    padding: 0 4px;
  }
  .wrapper .selected button:first {
    border-radius: 0;
    border-right: solid 1px rgba(255, 255, 255, 0.1);
  }
</style>

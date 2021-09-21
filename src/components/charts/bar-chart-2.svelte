<script type="ts">
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  import Chart from "chart.js";
  import NIcon from "../icon/icon.svelte";
  import nid from "../../modules/nid/nid";
  import { Interact } from "../../store/interact";
  import ignoreArrayZeros from "../../modules/stats/ignore-zeros";
  import statUtils from "./bar-chart-2-stat-utils";
  import additionalDatasets from "./bar-chart-2-additional-datasets";
  import { PeriodsStore } from "../../store/periods-store";

  //Chart.register(annotationPlugin);
  export let showperiods: boolean = false;
  export let widgetstats: any;
  export let math = "";
  export let labels = [];
  export let height = 200;

  export let mainlabel = "";
  export let seclabel1 = "";
  export let seclabel2 = "";
  export let title = "";
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
  export let type: string = "bar";
  // export let beginAtZero: boolean = true;
  export let showSelected: boolean = true;
  export let ignoreZero: boolean = false;
  export let ignoreZero2: boolean = false;
  export let ignoreZero3: boolean = false;
  export let showstats: string = "none";

  // Generate a random ID for this Component
  const chartId = `chart-${nid()}`;

  let showChart = false;
  let _canvas;
  let theChart;
  let lastPoints = [];
  let lastPoints2 = [];
  let lastPoints3 = [];
  let lastshowstats = showstats;
  let lastshowperiods = showperiods;
  let allperiods = [];
  let periodannotations =[];

  export let selected = undefined;

  $: if (points && theChart && points.map((p) => p.y).join() !== lastPoints) {
    lastPoints = points.map((p) => p.y).join();
    loadData();
    periodsUpdate("full");
  }

  $: if (
    points2 &&
    theChart &&
    points2.map((p) => p.y).join() !== lastPoints2
  ) {
    lastPoints2 = points2.map((p) => p.y).join();
    loadData();
    periodsUpdate("full");
  }

  $: if (
    points3 &&
    theChart &&
    points3.map((p) => p.y).join() !== lastPoints3
  ) {
    lastPoints3 = points3.map((p) => p.y).join();
    loadData();
    periodsUpdate("full");
  }

  // make sure the chart updates when other statistic view is selected in widget editor
  $: if (showstats !== lastshowstats) {
    lastshowstats = showstats;
    loadData();
  }

  // make sure the chart updates when toggle show periods in widget editor
  $: if (showperiods !== lastshowperiods) {
    lastshowperiods = showperiods;
    periodsUpdate("limitted");}
    
  function periodsUpdate(type){
    if (showperiods){
      if (type == "limitted"){
        if (periodannotations.length > 0) {
          theChart.options.annotation.annotations = periodannotations;}
        else {
          loadPeriods();
          theChart.options.annotation.annotations = periodannotations;}
      }
      if (type == "full"){
        periodannotations = [];
        loadPeriods();
        theChart.options.annotation.annotations = periodannotations;
      }
    }
    else {theChart.options.annotation.annotations = [];}
    theChart.update();
  }

  $: if ($Interact.stats.focused && points) {
    selected = points.find((p) => {
      return (
        p.date.format("YYYY-MM-DD") ===
        $Interact.stats.focused.date.format("YYYY-MM-DD")
      );
    });
  } else if (points && points.length) {
    selected = undefined;
  }

  const convertHexToRGBA = (hexCode, opacity) => {
    let hex = hexCode.replace('#', '');
    
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }    
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
};

  function loadPeriods() {
    let periods =[];
    let temp = Object.keys(($PeriodsStore || {}).periods || {});
    periods = temp.sort((a, b) => {
      return $PeriodsStore.periods[a].last < $PeriodsStore.periods[b].last
        ? 1
        : -1;
    });
    
    for (let i = 0; i < periods.length; i++) {
      allperiods.push($PeriodsStore.periods[periods[i]]);
    }
    createAnnotations();
  }

  function createAnnotations() {
    for (let i = 0; i < allperiods.length; i++) {
      periodannotations.push({
              type: "box",
              xScaleID: "x-axis-0",
              yScaleID: "y-axis-0",
              xMin: Math.floor(-1*(widgetstats.start.$d - allperiods[i].start)/(1000 * 3600 * 24)),
              xMax: Math.floor(-1*(widgetstats.start.$d - allperiods[i].end)/(1000 * 3600 * 24)),
              yMin: 50,
              yMax: 70,
              backgroundColor: convertHexToRGBA(allperiods[i].periodcolor,25),
              borderColor: convertHexToRGBA(allperiods[i].periodcolor,0),
            });     
    
      periodannotations.push({
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: points[Math.floor(-1*(widgetstats.start.$d - allperiods[i].start)/(1000 * 3600 * 24))],
              borderColor: convertHexToRGBA(allperiods[i].periodcolor,100),
              borderWidth: 2,
              label: {
                xAdjust: Math.floor((allperiods[i].displayName.length)*-2.9),
                content: allperiods[i].displayName,
                enabled: true,
                position: "top",
                fontSize: 8,
              },
            });
      periodannotations.push({
              type: "line",
              dislay: false,
              mode: "vertical",
              scaleID: "x-axis-0",
              value: points[Math.floor(-1*(widgetstats.start.$d - allperiods[i].end)/(1000 * 3600 * 24))],
              borderColor: convertHexToRGBA(allperiods[i].periodcolor,100),
              borderWidth: 2,
              label: {
                content: "END Today",
                enabled: false,
                position: "bottom",
                fontSize: 8,
              },
            });   
    }
    
  }

  function loadData() {
    
    
    const lineStyle = {
      backgroundColor: "transparent",
      borderColor: color,
    };
    const barStyle = {
      backgroundColor: color,
    };

    theChart.data.labels = labels || points.map((row) => row.x);
   
    theChart.data.datasets = [
      {
        ...(type == "line" ? lineStyle : barStyle),
        data: points.map((row) => row.y),
        maxBarThickness: 34,
        minBarLength: 2,
        label: mainlabel.charAt(0).toUpperCase() + mainlabel.slice(1),
        order: 1,
        yAxisID: "Primairy",
      },
    ];
    let dataset = theChart.data.datasets[0].data;

    if (ignoreZero) {
      dataset = ignoreArrayZeros(dataset);
    }

    theChart.data.datasets[0].data = dataset;
    let datasetcount = 1;

    // if additional datasets are defined, include them as dataset

    if (points2) {
      let datasetMain = theChart.data.datasets[0];
      theChart.data.datasets[datasetcount] = additionalDatasets.DefineChart(
        datasetMain,
        type,
        color2,
        seclabel1,
        points2,
        ignoreZero2,
        datasetcount + 1
      );
      datasetcount = datasetcount + 1;
    }
    if (points3) {
      let datasetMain = theChart.data.datasets[0];
      theChart.data.datasets[datasetcount] = additionalDatasets.DefineChart(
        datasetMain,
        type,
        color3,
        seclabel2,
        points3,
        ignoreZero3,
        datasetcount + 1
      );
      datasetcount = datasetcount + 1;
    }

    // if statistics are defined as property, include them as the second dataset
    if (showstats != "none") {
      if ((showstats == "cumm" && math == "sum") || showstats != "cumm") {
        let datasetMain = theChart.data.datasets[0];
        theChart.data.datasets[datasetcount] = statUtils.defineStatsDataset(
          datasetMain,
          showstats,
          datasetcount + 1,
          math
        );
        datasetcount = datasetcount + 1;
      }
    }
    theChart.update();
  }

  async function initChart() {
    if (showperiods){loadPeriods();}
    else {periodannotations = []}
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
      type,
      options: {
        animation: {
          duration: 0, // general animation time
        },
        annotation: {
          drawTime: 'beforeDatasetsDraw',
          annotations: periodannotations,
        },
        tooltips: {
          mode: "point",
          callbacks: {
            label: function (tooltipItem, data) {
              return yFormat ? yFormat(tooltipItem.value) : tooltipItem.value;
            },
          },
        },

        defaultColor: color,
        responsive: true,
        defaultFontSize: 10,
        legend: {
          display: true,
          position: "right",
          labels: {
            filter(legendItem, data) {
              return legendItem.text;
            },
            boxWidth: 5,
            boxHeight: 2,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        maintainAspectRatio: false,
        title: {
          display: title,
          text: title,
        },
        scales: {
          yAxes: [
            {
              id: "Primairy",
              position: "left",
              ticks: {
                min: minPoint > 0 ? minPoint - 1 : 0,
                maxTicksLimit: 6,
                callback(value, index, values) {
                  if (yFormat) {
                    return yFormat(value);
                  } else {
                    return value;
                  }
                },
                fontSize: 9,
                beginAtZero: false,
                display: hideYTicks == false,
              },
            },
            {
              id: "Secondairy1",
              position: "right",
              display: showsecticks1,
              ticks: {
                min: minPoint2 > 0 ? minPoint2 - 1 : 0,
                maxTicksLimit: 6,
                callback(value, index, values) {
                  if (yFormat) {
                    return yFormat(value);
                  } else {
                    return value;
                  }
                },
                fontSize: 9,
                fontColor: color2,
                beginAtZero: false,
              },
            },
            {
              id: "Secondairy2",
              position: "right",
              display: showsecticks2,
              ticks: {
                min: minPoint3 > 0 ? minPoint3 - 1 : 0,
                maxTicksLimit: 6,
                callback(value, index, values) {
                  if (yFormat) {
                    return yFormat(value);
                  } else {
                    return value;
                  }
                },
                fontSize: 9,
                fontColor: color3,
                beginAtZero: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                callback(value, index, values) {
                  if (xFormat) {
                    return xFormat(value);
                  } else {
                    return value;
                  }
                },
                display: hideXTicks == false,
                fontSize: 9,
              },
            },
          ],
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

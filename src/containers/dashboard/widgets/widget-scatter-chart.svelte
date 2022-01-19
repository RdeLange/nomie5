<script lang="ts">
  import ScatterChart from "../../../components/charts/scatter-chart.svelte";
  import { getWidgetColor } from "../dashboard-helpers";
  import type { Widget } from "../../../modules/dashboard/widget";

  export let widget: Widget;

  // very ugly if else below. need redo -RdL-
</script>

{#if widget}
  {#if widget.secElement2}
    <div class="chart-value">
      <ScatterChart
        showlegend = {widget.showlegend}
        height={100}
        showSelected={false}
        type={widget.type == "linechart" ? "line" : "bar"}
        showstats={widget.stats2}
        color={getWidgetColor(widget, "1")}
        color2={getWidgetColor(widget, "2")}
        color3={getWidgetColor(widget, "3")}
        labels={widget.stats.chart.values.map((point) => point.x)}
        labels2={widget.secStats1.chart.values.map((point) => point.x)}
        labels3={widget.secStats2.chart.values.map((point) => point.x)}
        mainlabel={widget.element.id}
        seclabel1={widget.secElement1.id}
        seclabel2={widget.secElement2.id}
        points={widget.stats.chart.values}
        points2={widget.secStats1.chart.values}
        points3={widget.secStats2.chart.values}
        hideXTicks={widget.size == "sm"}
        hideYTicks={widget.size == "sm"}
        ignoreZero={widget.element.obj
          ? widget.element.obj.ignore_zeros
          : false}
        ignoreZero2={widget.secElement1.obj
          ? widget.secElement1.obj.ignore_zeros
          : false}
        ignoreZero3={widget.secElement2.obj
          ? widget.secElement2.obj.ignore_zeros
          : false}
        yFormat={(y) => {
          if (widget.element.type == "tracker") {
            return widget.element.obj.displayValue(y);
          } else {
            return y;
          }
        }}
      />
    </div>
  {:else if widget.secElement1}
    <div class="chart-value">
      <ScatterChart
      showlegend = {widget.showlegend}
        height={100}
        showSelected={false}
        type={widget.type == "linechart" ? "line" : "bar"}
        showstats={widget.stats2}
        color={getWidgetColor(widget, "1")}
        color2={getWidgetColor(widget, "2")}
        color3={null}
        labels={widget.stats.chart.values.map((point) => point.x)}
        labels2={widget.secStats1.chart.values.map((point) => point.x)}
        labels3={null}
        mainlabel={widget.element.id}
        seclabel1={widget.secElement1.id}
        seclabel2={null}
        points={widget.stats.chart.values}
        points2={widget.secStats1.chart.values}
        points3={null}
        hideXTicks={widget.size == "sm"}
        hideYTicks={widget.size == "sm"}
        ignoreZero={widget.element.obj
          ? widget.element.obj.ignore_zeros
          : false}
        ignoreZero2={widget.secElement1.obj
          ? widget.secElement1.obj.ignore_zeros
          : false}
        ignoreZero3= {false}
        yFormat={(y) => {
          if (widget.element.type == "tracker") {
            return widget.element.obj.displayValue(y);
          } else {
            return y;
          }
        }}
      />
    </div>
  {:else}
    <div class="chart-value">
      <ScatterChart
        showlegend = {widget.showlegend}
        height={100}
        showSelected={false}
        type={widget.type == "linechart" ? "line" : "bar"}
        showstats={widget.stats2}
        color={getWidgetColor(widget, "1")}
        color2={null}
        color3={null}
        labels={widget.stats.chart.values.map((point) => point.x)}
        labels2={null}
        labels3={null}
        mainlabel={widget.element.id}
        seclabel1={null}
        seclabel2={null}
        points={widget.stats.chart.values}
        points2={null}
        points3={null}
        hideXTicks={widget.size == "sm"}
        hideYTicks={widget.size == "sm"}
        ignoreZero={widget.element.obj
          ? widget.element.obj.ignore_zeros
          : false}
        ignoreZero2={false}
        ignoreZero3={false}
        yFormat={(y) => {
          if (widget.element.type == "tracker") {
            return widget.element.obj.displayValue(y);
          } else {
            return y;
          }
        }}
      />
    </div>
  {/if}  
{/if}

<style>
  .chart-value {
    height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    width: 100%;
    display: column;
    justify-content: stretch;
  }
</style>


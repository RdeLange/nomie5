import _ from "lodash";
import ignoreArrayZeros from "../../modules/stats/ignore-zeros";

export default {

  DefineChart(datasetmain, type, color, mainlabel, points, ignoreZero, chartorder) {
    let dataset = datasetmain;
    const lineStyle = {
      backgroundColor: "transparent",
      borderColor: color,
    };
    const barStyle = {
      backgroundColor: color,
    };
    
    var yaxid = "Secondairy"+String(chartorder-1);
    dataset =
      {
        ...(type == "line" ? lineStyle : barStyle),
        data: points.map((row) => row.y),
        maxBarThickness: 34,
        minBarLength: 2,
        label: mainlabel.charAt(0).toUpperCase() + mainlabel.slice(1),
        order: chartorder,
        yAxisID: yaxid,
      };


    if (ignoreZero) {
      dataset.data = ignoreArrayZeros(dataset.data);
    }
    
    return dataset;
  }
};
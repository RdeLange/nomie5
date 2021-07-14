import _ from "lodash";

export default {

    calculateAverage(nums) {
        let avg = nums.reduce((a, b) => a + b) / nums.length;
        let avg_array = nums.map(function () {
            return avg;
        });
        return avg_array;
    },
    calculateSimpleMovingAverage(nums, window = 5, n = Infinity) {
        if (!nums || nums.length < window) {
            return [];
        }

        let index = window - 1;
        const length = nums.length + 1;
        let indexinitial = 0;

        const simpleMovingAverages = [];
        let numberOfSMAsCalculated = 0;
        
        //First we need to fill the first window, we do dat by starting with data point 0 and increase window until we reached target window
        while (++indexinitial < window && numberOfSMAsCalculated++ < n) {
            const initialwindowSlice = nums.slice(
                indexinitial - indexinitial,
                indexinitial
            );
            const initialsum = initialwindowSlice.reduce(
                (prev, curr) => prev + curr,
                0
            );
            simpleMovingAverages.push(initialsum / indexinitial);
        }

        while (++index < length && numberOfSMAsCalculated++ < n) {
            const windowSlice = nums.slice(index - window, index);
            const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
            simpleMovingAverages.push(sum / window);
        }

        return simpleMovingAverages;
    },
    calculateExponentialMovingAverage(nums, window = 5) {
        if (!nums || nums.length < window) {
            return [];
        }

        let index = window - 1;
        let indexinitial = 0;
        let previousEmaIndex = 0;
        const length = nums.length;
        const smoothingFactor = 2 / (window + 1);

        const exponentialMovingAverages = [];
        const [sma] = this.calculateSimpleMovingAverage(nums, window, 1);
        exponentialMovingAverages.push(sma);
        //First we need to fill the first window, we do dat by starting with data point 0 and increase window until we reached target window
        while (++indexinitial < window) {
            const value = nums[indexinitial];
            const previousEma = exponentialMovingAverages[previousEmaIndex++];
            const currentEma = (value - previousEma) * smoothingFactor + previousEma;
            exponentialMovingAverages.push(currentEma);
        }

        while (++index < length) {
            const value = nums[index];
            const previousEma = exponentialMovingAverages[previousEmaIndex++];
            const currentEma = (value - previousEma) * smoothingFactor + previousEma;
            exponentialMovingAverages.push(currentEma);
        }

        return exponentialMovingAverages;
    },
    defineStatsDataset(datasetMain,showstats){
        let maindata = datasetMain.data;
        let datasetStats = datasetMain;
        if (showstats == "avg") {
            datasetStats = {
              type: "line",
              data: this.calculateAverage(maindata),
              fill: false,
              borderColor: "purple",
              pointRadius: 1,
              label: "Average",
              order: 1,
            };
          }
          if (showstats.includes("sma")) {
            const window = parseInt(showstats.split("-")[1]);
            datasetStats = {
              type: "line",
              data: this.calculateSimpleMovingAverage(maindata, window),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              pointRadius: 1,
              label: "Simple Moving Average (" + window + ")",
              order: 1,
            };
          }
          if (showstats.includes("ema")) {
            const window = parseInt(showstats.split("-")[1]);
            datasetStats = {
              type: "line",
              data: this.calculateExponentialMovingAverage(maindata, window),
              fill: false,
              borderColor: "pink",
              pointRadius: 1,
              label: "Exponential Moving Average (" + window + ")",
              order: 1,
            };
          }
          return datasetStats;
    }
};
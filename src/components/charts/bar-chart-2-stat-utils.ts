import _ from "lodash";

export default {

    calculateCummulativeSum(nums) {
        let cumm_array = [];
        const cumulativeSum = (sum => value => sum += value)(0);
        cumm_array = nums.map(cumulativeSum);
        return cumm_array;
    },
    
    
    calculateSplitAverage(nums, splits) {
        splits = String(splits);
        let split1 = parseInt(splits.split('')[0]);
        let split2 = parseInt(splits.split('')[1]);
        let splittotal = split1 + split2;
        let splitpercentage = (split1 / splittotal);
        let arraylength = nums.length;
        let array1 = [];
        array1 = nums.slice(0, Math.round(((arraylength) * splitpercentage)));
        let array2 = [];
        array2 = nums.slice(Math.round((arraylength * splitpercentage)), arraylength);

        let avg1 = array1.reduce((a, b) => a + b) / array1.length;
        let avg1_array = array1.map(function () {
            return avg1;
        });

        let avg2 = array2.reduce((a, b) => a + b) / array2.length;
        let avg2_array = array2.map(function () {
            return avg2;
        });
        avg2_array[0] = null; // set to create break in line
        const splitavg_array = avg1_array.concat(avg2_array);

        return splitavg_array;
    },

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
    defineStatsDataset(datasetMain, showstats, chartorder,math) {
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
                order: chartorder,
                yAxisID: "Primairy",
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
                label: "SMA (" + window + ")",
                order: chartorder,
                yAxisID: "Primairy",
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
                label: "EMA (" + window + ")",
                order: chartorder,
                yAxisID: "Primairy",
            };
        }

        if (showstats.includes("split")) {
            const split = parseInt(showstats.split("-")[1]);
            datasetStats = {
                type: "line",
                data: this.calculateSplitAverage(maindata, split),
                fill: false,
                borderColor: "orange",
                borderDash: [1, 1],
                tension: 0,
                spanGaps: false,
                pointRadius: 1,
                label: "Split Avg (" + split + ")",
                order: chartorder,
                yAxisID: "Primairy",
            };
        }

        if (showstats.includes("cumm") && math == "sum") {
            datasetStats = {
                type: "line",
                data: this.calculateCummulativeSum(maindata),
                fill: true,
                borderColor: "orange",
                backgroundColor: "amber",
                pointRadius: 1,
                label: "Cumm Σ",
                order: chartorder,
                yAxisID: "Primairy",
            };
        }
        return datasetStats;
    }
};
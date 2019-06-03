export const quartilePercentiles = [0, .166, .333, .5, .666, .833, 1];

/**
 * 
 * @param {Object} statistics 
 * @param {number} classesCount 
 * @returns {Array} break class values with first and last point
 */
export const getValueClassesByStatistics = (statistics, classesCount = 1) => {
    const min = Number.parseFloat(statistics.min);
    const max = Number.parseFloat(statistics.max);
    const width = (max - min) / classesCount;
    const classes = [];
    for(let i = 0; i < classesCount + 1; i++) {
        classes[i] = min + (i * width);
    }
    return classes;
}

/**
 * 
 * @param {Array} classes Array of break class values with first and last point
 * @param {number} value 
 * @returns {number} class index 
 */
export const getClassByValue = (classes, value) => {
    return classes[0] === value ? 0 : classes.findIndex(b => value <= b) - 1;
}

/**
 * Create classes with same items count.
 * Get values, order ascent
 * @param {Array} values 
 * @param {number} classesCount 
 */
export const getEqualsCountClasses = (values = [], classesCount = 1) => {
    values.sort();
    const count = values.length;
    const min = values[0];
    const max = values[values.length + 1];
    const width = max - min;
    const classWidth = Math.floor(width/classesCount);
    const classes = [];
    for(let i = 0; i < classesCount + 1; i++) {
        classes[i] = min + (i * classWidth);
    }
    return classes;
}

/**
 * 
 * @param {Array} statistics 
 */
export const mergeAttributeStatistics = (statistics = []) => {
    const mergedStatistics = {
        min: null,
        max: null,
        percentile: [] 
    }

    for (const statistic of statistics) {
        if(statistic && statistic.attributeStatistic) {
            mergedStatistics.min = (mergedStatistics.min || mergedStatistics.min === 0) ? Math.min(mergedStatistics.min, statistic.attributeStatistic.min) : statistic.attributeStatistic.min;
            mergedStatistics.max = (mergedStatistics.max || mergedStatistics.max === 0) ? Math.max(mergedStatistics.max, statistic.attributeStatistic.max) : statistic.attributeStatistic.max;
        }
    }

    //average percentiles
    //calculate percentiles count from first statistic
    if(statistics[0] === null) {
        debugger
    }
    const percentilesCount = statistics[0] && statistics[0].attributeStatistic && statistics[0].attributeStatistic.percentile.length;
    const statisticsCount = statistics.length;
    for (let index = 0; index < percentilesCount; index++) {
        let sum = 0;
        for (const statistic of statistics) {
            if(statistic && statistic.attributeStatistic) {
                sum += statistic.attributeStatistic.percentile[index];
            }
        }
        mergedStatistics.percentile[index] = sum/statisticsCount;
    }

    mergedStatistics.percentile[0] = mergedStatistics.min;
    mergedStatistics.percentile[mergedStatistics.percentile.length - 1] = mergedStatistics.max;

    return mergedStatistics;
}

export const getClassCount = (classes = []) => {
    return Math.max(0, classes.length - 1);
}

export const getMiddleClassValues = (classes = []) => {
    return classes.reduce((acc, val, idx, src) => {
        if(idx > 0) {
            acc.push((src[idx - 1] + src[idx]) / 2);
            return acc;
        } else {
            return acc;
        }
    }, [])
}

export const getClassesIntervals = (classes = []) => {
    const collectedClasses = [...new Set(classes)];
    if(collectedClasses.length > 1) {
        const intervals = collectedClasses.reduce((acc, val, idx, src) => {
            if(idx > 0) {
                acc.push([src[idx - 1], src[idx]]);
                return acc;
            } else {
                return acc;
            }
        }, [])
        return intervals;
    } else if(collectedClasses.length === 1) {
        //probably only one value in cartogram
        return [[collectedClasses[0], collectedClasses[0]]]
    } else {
        return [];
    }
}

export const setClassesMinMaxFromStatistics = (classes = [], statistics) => {
    const modified = [...classes];
    modified[0] = statistics.min;
    modified[classes.length - 1] = statistics.max;
    return modified;
}
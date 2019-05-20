export const quartilePercentiles = [0, .25, .5, .75, 1];

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

            mergedStatistics.percentile = mergedStatistics.percentile.length > 0 ? 
                mergedStatistics.percentile.map((p, i) => (statistic.attributeStatistic.percentile[i] + p) / 2) : statistic.attributeStatistic.percentile;
        }
    }
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
    return classes.reduce((acc, val, idx, src) => {
        if(idx > 0) {
            acc.push([src[idx - 1], src[idx]]);
            return acc;
        } else {
            return acc;
        }
    }, [])
}

export const setClassesMinMaxFromStatistics = (classes = [], statistics) => {
    const modified = [...classes];
    modified[0] = statistics.min;
    modified[classes.length - 1] = statistics.max;
    return modified;
}
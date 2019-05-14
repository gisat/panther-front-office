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
 * 
 * Calculate percentil position of value between min and max values
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @param {Chromajs} palette 
 * @returns {Chromajs} color
 */
export const getColorByValue = (value, min, max, palette) => {
    return palette((value - min) / (max - min))
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


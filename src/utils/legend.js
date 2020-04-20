import {round, roundHigher} from './math'
/**
 * 
 * @param {Array} interval Values interval eg. [0,9] 
 * @param {boolean} first I true, dont increase first number.
 * @return {string} Rounded values for legend. First number of array is increased by one
 * on last decimal. 
 */
export const getIntervalTitle = (interval, first) => {
    const firstRounded = first ? round(interval[0], 2).toLocaleString() : roundHigher(interval[0], 2).toLocaleString();
    const title = interval[1] === interval[0] ? round(interval[0], 2).toLocaleString() : `${firstRounded} to ${round(interval[1], 2).toLocaleString()}`;
    return title;
}
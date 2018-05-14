/**
 * Make uri component from params
 * @param params {Object}
 * @returns {string} encoded uri component
 */
function makeUriComponent(params) {
    let paramsList = [];
    for (let key in params) {
        paramsList.push(key + '=' + params[key]);
    }
    return paramsList.join('&');
}

/**
 * @param dateString {string} ISO 8601 format
 * @returns {string}
 */
function parseDate(dateString){
    var d = new Date(dateString);
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();
    return date + ' - ' + time;
}

export default {
    makeUriComponent: makeUriComponent,
    parseDate: parseDate
};

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

export default {
    makeUriComponent: makeUriComponent
};

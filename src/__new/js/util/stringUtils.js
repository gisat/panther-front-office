define([], function () {

	/**
	 * Make uri component from params
	 * @param params {Object}
	 * @returns {string} encoded uri component
	 */
	function makeUriComponent (params) {
		var paramsList = [];
		for (var key in params){
			paramsList.push(key + '=' + params[key]);
		}
		return paramsList.join('&');
	}

	return {
		makeUriComponent: makeUriComponent
	};
});

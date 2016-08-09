define([], function () {
	"use strict";
	/**
	 *
	 * @param message Message to be displayed
	 * @constructor
	 */
	var NotOverriddenError = function(message) {
		this.name = "NotFoundError";
		this.message = message || '';
	};

	NotOverriddenError.prototype = Error.prototype;

	return NotOverriddenError;
});
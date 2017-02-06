define([], function () {
	"use strict";

	/**
	 * Base class for creating of warning messages for widgets.
	 * @constructor
	 */

	var WidgetWarning = function () {

	};

	/**
	 * Generate warning
	 * @param codes {Array} list of warning codes
	 * @returns {string} HTML code of warning
	 */
	WidgetWarning.prototype.generate = function(codes){
		var self = this;
		var message = "<p>";
		codes.forEach(function(code){
			message += self.getMessage(code) + "<br><br>";
		});

	 	return message + "</p>";
	};

	/**
	 * It returns a message by code
	 * @param code {number}
	 * @returns {string} message
	 */
	WidgetWarning.prototype.getMessage = function(code){
		var message;
		switch (code) {
			case 1:
				message = "Attributes are missing! Possible reason: There are no linked attribute sets to analytical units for this place.";
				break;
			case 2:
				message = "Attributes are missing! Possible reason: Current user does not have appropriate permissions for current configuration.";
				break;
			case 3:
				message = "Attributes are missing! Possible reason: Broken links in visualizations (e.g. non-existing attributes or attribute sets). Try to create visualizations again.";
				break;
			case 4:
				message = "Attributes are missing! Possible reason: Choropleths includes non-existing attributes or attribute sets. Try to create choropleths again.";
				break;
			case 5:
				message = "Dataset is not defined!";
				break;
		}

		return message;
	};

	return WidgetWarning;
});
define([
	'jquery'
], function(
			$
){
	var SnowUrlParser = function(){
	};

	/**
	 * Parse url
	 * @param url {string} URL of snow portal configuration
	 */
	SnowUrlParser.prototype.parse = function(url){
		//"http://35.165.51.145/snow/great-britain/20170103-20170111/modis-terra-aqua_slstr-sentinel3/4-16"
		// todo replace mock with more sophisticated solution
		var path = url.replace(Config.snowUrl + "snow/","");
		if (path.length < 1){
			return null;
		}

		var components = path.split("/");
		var dates = this.parseDate(components[1]);
		var composites = [];
		var customComposites = components[3];
		if (customComposites && customComposites.charAt(0) != "?"){
			composites = this.parseComposites(components[3]);
		}
		return {
			url: url,
			area: this.parseLocation(components[0]),
			dateFrom: dates[0],
			dateTo: dates[1],
			sensors: this.parseSensors(components[2]),
			composites: composites
		};
	};

	/**
	 * @param locationString {string}
	 * @returns {string}
	 */
	SnowUrlParser.prototype.parseLocation = function(locationString){
		var location = locationString.split("-");
		var locParts = [];
		var self = this;
		location.forEach(function(name){
			name = self.firstLetterToUppercase(name);
			locParts.push(name);
		});
		return locParts.join(" ");
	};

	/**

	 * @param dateString {string}
	 * @returns {[dateFrom, dateTo]}
	 */
	SnowUrlParser.prototype.parseDate = function(dateString){
		var dates = dateString.split("-");
		var dateParts = [];
		var self = this;
		dates.forEach(function(date){
			date = self.getFormattedDate(date);
			dateParts.push(date);
		});
		return dateParts;
	};

	/**
	 * @param sensorsString
	 * @returns {Object} satellites
	 */
	SnowUrlParser.prototype.parseSensors = function(sensorsString){
		var satellites = sensorsString.split("_");
		var sats = {};
		var self = this;
		satellites.forEach(function(str){
			var parts = str.split("-");
			var satellite = parts[0];
			sats[satellite] = [];
			parts.forEach(function(sensor, index){
				if (index > 0){
					var sensorName = self.firstLetterToUppercase(sensor);
					sats[satellite].push(sensorName);
				}
			});
		});
		return sats;
	};

	/**
	 * @param compositesString {string}
	 * @returns {Array}
	 */
	SnowUrlParser.prototype.parseComposites = function(compositesString){
		var composites = compositesString.split("-");
		var compositesParts = [];
		composites.forEach(function(composite){
			compositesParts.push(Number(composite));
		});
		return compositesParts;
	};

	/**
	 * Get date in MM/DD/YYYY format
	 * @param dateString {string}
	 * @returns {string}
	 */
	SnowUrlParser.prototype.getFormattedDate = function(dateString){
		var year = dateString.substring(0,4);
		var month = dateString.substring(4,6);
		var day = dateString.substring(6,8);
		return month + "/" + day + "/" + year;
	};

	/**
	 * Convert first letter of string to uppercase
	 */
	SnowUrlParser.prototype.firstLetterToUppercase = function(word){
		return word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
	};

	return SnowUrlParser;
});
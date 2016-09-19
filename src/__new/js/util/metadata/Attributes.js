define(['../../util/Remote',
		'../../stores/Stores'
],function(Remote,
		   Stores){

	/**
	 * Class for gathering metadata of attributes from server
	 * @constructor
	 */

	var Attributes = function(options){
		this._attributeSets = null;
	};

	/**
	 * It returns information about all atributtes grouped by attribute sets
	 * @returns {Promise}
	 */
	Attributes.prototype.getData = function(){
		var self = this;
		if (ThemeYearConfParams.datasetChanged || ThemeYearConfParams.themeChanged || ThemeYearConfParams.placeChanged){
			return new Remote({
				method: "POST",
				url: window.Config.url + "api/theme/getThemeYearConf",
				params: self.getThemeYearConfParams()
			}).then(function(response){
				var output = JSON.parse(response);
				if (output.data.hasOwnProperty("attrSets")){
					self._attributeSets = output.data.attrSets;
				}
				return self.getAttributeSetsData(self._attributeSets);
			});
		}
		else {
			return this.getAttributeSetsData(this._attributeSets);
		}
	};

	/**
	 * It returns a Promise of metadata for all attribute sets
	 * @param attributeSets {Array} Ids of attribute sets
	 * @returns {Promise}
	 */
	Attributes.prototype.getAttributeSetsData = function(attributeSets){
		var self = this;

		return Promise.all(attributeSets.map(function (attributeSet) {
			return Stores.retrieve("attributeSet").byId(attributeSet).then(function (attrSet) {
					return attrSet[0];
				}).then(function(attributeSet){
					return Promise.all(attributeSet.attributes.map(function (attribute) {
						return Stores.retrieve("attribute").byId(attribute).then(function(attr){
							var params = {
								attr: attr[0].id,
								attrName: attr[0].name,
								attrType: attr[0].type,
								as: attributeSet.id,
								asName: attributeSet.name,
								units: attr[0].standardUnits
							};
							if (params.attrType == "numeric"){
								return self.filterAttributes("filter",params);
							}
							else if (params.attrType == "text"){
								return self.filterAttributes("getUniqueValues",params);
							}
							else if (params.attrType == "boolean") {
								return {
									about: params
								};
							}
						});
					}));
				});
		}));
	};

	/**
	 * It returns information about all current numeric attributes (metadata and distribution)
	 * @param filterType {string} Type of the filter to use
	 * @param attrParams {Object} attribute parameters
	 * @param attrParams.attr {Number} ID of attribute
	 * @param attrParams.attrName {string} Name of attribute
	 * @param attrParams.as {Number} ID of attribute set
	 * @param attrParams.asName {string} Name of atributte set
	 * @param attrParams.attrType {string} Date type of attribute
	 * @returns {*|Promise}
	 */
	Attributes.prototype.filterAttributes = function(filterType, attrParams){
		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/" + filterType,
			params: {
				dataset: ThemeYearConfParams.dataset,
				years: ThemeYearConfParams.years,
				filters: JSON.stringify([]),
				attrs: JSON.stringify([attrParams]),
				areas: JSON.stringify(ExpandedAreasExchange)
			}
		}).then(function(response){
			return {
				about: attrParams,
				response: JSON.parse(response)
			};
		});
	};

	/**
	 * It prepares the parameters for getThemeYearConf request
	 * @returns {{theme: string, years: string, dataset: string, refreshLayers: string, refreshAreas: string}}
	 */
	Attributes.prototype.getThemeYearConfParams = function(){
		return {
			theme: ThemeYearConfParams.theme,
			years: ThemeYearConfParams.years,
			dataset: ThemeYearConfParams.dataset,
			refreshLayers: 'true',
			refreshAreas: 'true'
		};
	};

	return Attributes;
});
define(['../../util/Remote',
		'../../stores/Stores'
],function(Remote,
		   Stores){

	/**
	 * Class for gathering attributes metadata
	 * @constructor
	 */

	var Attributes = function(){
		this._attributeSets = null;
	};

	/**
	 * It returns information about all attributes grouped by attribute sets
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
				return self.getAttributesFromAllAttributeSets(self._attributeSets);
			});
		}
		else {
			return this.getAttributesFromAllAttributeSets(this._attributeSets);
		}
	};

	/**
	 * It returns a Promise of attributes metadata for all attribute sets
	 * @param attributeSets {Array} Ids of attribute sets
	 * @returns {Promise}
	 */
	Attributes.prototype.getAttributesFromAllAttributeSets = function(attributeSets){
		var self = this;
		return Promise.all(attributeSets.map(self.getAttributeSet.bind(self)));
	};

	/**
	 * Get attribute set data
	 *
	 * @param attributeSet {number} ID of attribute set
	 * @returns {*|Promise}
	 */
	Attributes.prototype.getAttributeSet = function (attributeSet) {
		var self = this;
		return Stores.retrieve("attributeSet").byId(attributeSet).then(function (attrSet) {
			return attrSet[0];
		}).then(self.getAttributesFromAttributeSet.bind(self));
	};

	/**
	 * Return the data of all atributes in give attribute set
	 * @param attributeSet {Object}
	 * @param attributeSet.attributes {Array} IDs of attributes
	 * @returns {Promise}
	 */
	Attributes.prototype.getAttributesFromAttributeSet = function(attributeSet){
		var self = this;
		return Promise.all(attributeSet.attributes.map(self.getAttribute.bind(self, attributeSet)));
	};

	/**
	 * Get the attribute data
	 *
	 * @param attributeSet {Object} attribute set
	 * @param attributeSet.id {number} attribute set id
	 * @param attributeSet.name {string} attribute set name
	 * @param attribute {number} id of the attribute
	 * @returns {*|Promise}
	 */
	Attributes.prototype.getAttribute = function(attributeSet, attribute){
		var self = this;
		return Stores.retrieve("attribute").byId(attribute).then(
			self.getAttributeDataByType.bind(self, attributeSet)
		);
	};

	/**
	 * Use the filter according to attribute type and return the attribute data
	 *
	 * @param attributeSet {Object} attribute set
	 * @param attributeSet.id {number} attribute set id
	 * @param attributeSet.name {string} attribute set name
	 * @param attribute {Object[]} attribute
	 * @param attribute.id {number} attribute id
	 * @param attribute.name {string} attribute name
	 * @param attribute.type {('numeric'|'text'|'boolean')} attribute type
	 * @param attribute.standardUnits {string}
	 * @returns {Object|Promise}
	 */
	Attributes.prototype.getAttributeDataByType = function(attributeSet, attribute) {
		var attr = attribute[0];

		var params = {
			attr: attr.id,
			attrName: attr.name,
			attrType: attr.type,
			as: attributeSet.id,
			asName: attributeSet.name,
			units: attr.standardUnits
		};
		if (params.attrType == "numeric") {
			return this.filterAttribute("filter", params);
		}
		else if (params.attrType == "text") {
			return this.filterAttribute("getUniqueValues", params);
		}
		else if (params.attrType == "boolean") {
			return {
				about: params
			};
		}
	};

	/**
	 * It returns information about all current numeric attributes (metadata and distribution) or text attributes (metadata)
	 * based on type of the filter
	 *
	 * @param filterType {('filter'|'getUniqueValues')} Type of the filter to use
	 * @param attrParams {Object} attribute parameters
	 * @param attrParams.attr {Number} ID of attribute
	 * @param attrParams.attrName {string} Name of attribute
	 * @param attrParams.as {Number} ID of attribute set
	 * @param attrParams.asName {string} Name of atributte set
	 * @param attrParams.attrType {('numeric'|'text'|'boolean')} Type of attribute
	 * @returns {*|Promise}
	 */
	Attributes.prototype.filterAttribute = function(filterType, attrParams){
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
define(['../../util/Remote',
		'../../stores/Stores'
],function(Remote,
		   Stores){

	var AttributesMetadata = function(){
		this._params = {
			theme: ThemeYearConfParams.theme,
			years: ThemeYearConfParams.years,
			dataset: ThemeYearConfParams.dataset,
			refreshLayers: ThemeYearConfParams.refreshLayers,
			refreshAreas: ThemeYearConfParams.refreshAreas,
			queryTopics: ThemeYearConfParams.queryTopics,
			expanded: ThemeYearConfParams.expanded,
			parentgids: ThemeYearConfParams.parentgids,
			fids: ThemeYearConfParams.fids,
			artifexpand: ThemeYearConfParams.artifexpand
		};

		this._years = JSON.parse(ThemeYearConfParams.years);
		this._dataset = JSON.parse(ThemeYearConfParams.dataset);

		this._gids = [];
		this._place = null;
		this._level = null;
		this._normType = "";
	};

	AttributesMetadata.prototype.getData = function(){
		var self = this;

		return new Remote({
			method: "POST",
			url: window.Config.url + "api/theme/getThemeYearConf",
			params: self._params
		}).then(function(response){
			var output = JSON.parse(response);

			if (output.data.hasOwnProperty("areas")){
				var areas = output.data.areas;
				self._gids = [];
				self._place = areas[0].loc;
				self._level = areas[0].at;
				areas.forEach(function(area){
					self._gids.push(area.gid);
				})
			}

			if (output.data.hasOwnProperty("attrSets")) {
				var attributeSets = output.data.attrSets;
				return Promise.all(attributeSets.map(function (attributeSet) {
					return Stores.retrieve("attributeSet").byId(attributeSet).then(function (attrSet) {
							return {
								attributes: attrSet[0].attributes,
								attrSetId: attrSet[0].id,
								attrSetName: attrSet[0].name
							}
						}).then(self.prepareParameters.bind(self));
				}));
			}
		});
	};

	/**
	 *
	 * @param attributeSet {Object}
	 * @returns {*} Promise
	 */
	AttributesMetadata.prototype.prepareParameters = function(attributeSet){
		var self = this;
		return Promise.all(attributeSet.attributes.map(function (attribute) {
			return Stores.retrieve("attribute").byId(attribute).then(function (attr) {
				var attrId = attr[0].id;

				var loc = {};
				var location = {};
				loc[self._level] = self._gids;
				location[self._place] = loc;

				var attrs = {
					as: attributeSet.attrSetId,
					attr: attrId,
					normType: self._normType
				};

				var params = {
					dataset: self._dataset,
					years: self._years,
					attrs: attrs,
					areas: location
				};

				return {
					attrSetId: attributeSet.attrSetId,
					attrSetName: attributeSet.attrSetName,
					attrId: attrId,
					attrName: attr[0].name,
					attrType: attr[0].type,
					params: params
				};
			}).then(self.getMetadata.bind(self));
		}));
	};

	/**
	 * @param data {Object}
	 * @param data.attrSetId {number} id of the attribute set
	 * @param data.attrSetName {string} Name of the attribute set
	 * @param data.attrId {number} id of the attribute
	 * @param data.attrName {string} name of the attribute
	 * @param data.attrType {string} datetype of the attribute
	 * @param data.params {Object}
	 * @returns {*|Promise}
	 */
	AttributesMetadata.prototype.getMetadata = function(data){
		var self = this;
		return self.metadataRequest(data.params).then(function(output){
			var attributeInfo = JSON.parse(output);
			return {
				distribution: attributeInfo.data.dist["as_" + data.attrSetId + "_attr_" + data.attrId],
				metadata: attributeInfo.data.metaData["as_" + data.attrSetId + "_attr_" + data.attrId],
				attrId: data.attrId,
				attrName: data.attrName,
				attrType: data.attrType
			}
		});
	};

	/**
	 * It returns data about distribution of values of attribute and metadata about attribute.
	 * @param params {Object}
	 * @param params.dataset {number} Id of dataset (scope)
	 * @param params.years {Array} Ids of years
	 * @param params.areas {Object} IdOfPlace:value
	 * @param params.areas[IdOfPlace] {Object} IdOfAnalysisLevel:value
	 * @param params.areas[IdOfPlace].[IdOfAnalysisLevel] {Array} Ids of polygons
	 * @param params.attrs {Object}
	 * @param params.attrs.as {number} Id of attribute set
	 * @param params.attrs.attr {number} Id of attribute
	 * @param params.attrs.normType {string} Type of normalization
	 * @returns {Remote} promise
	 */
	AttributesMetadata.prototype.metadataRequest = function(params){
		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/filter",
			params: {
				dataset: JSON.stringify(params.dataset),
				years: JSON.stringify(params.years),
				areas: JSON.stringify(params.areas),
				filters: JSON.stringify([]),
				attrs: JSON.stringify([params.attrs])
			}
		});
	};

	return AttributesMetadata;
});
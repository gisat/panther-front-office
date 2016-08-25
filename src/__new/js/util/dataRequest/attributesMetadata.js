define(['../../util/Remote',
		'../../stores/Stores'
],function(Remote,
		   Stores){

	var AttributesMetadata = function(){
		this._attributeSets = null;
		this._layerRef = null;
	};

	/**
	 * @returns {Promise}
	 */
	AttributesMetadata.prototype.getData = function(){
		var self = this;

		var areasChange = ThemeYearConfParams.refreshAreas;
		var layersChange = ThemeYearConfParams.refreshLayers;

		if (!(!areasChange && !layersChange)){
			return new Remote({
				method: "POST",
				url: window.Config.url + "api/theme/getThemeYearConf",
				params: self.getThemeYearConfParams()
			}).then(function(response){
				var output = JSON.parse(response);
				if (output.data.hasOwnProperty("areas")){
					var areas = output.data.areas;
					self._layerRef = areas[0].lr;
				} else if (output.data.length > 0) {
					self._layerRef = output.data[0].lr;
				}
				if (output.data.hasOwnProperty("attrSets")) {
					self._attributeSets = output.data.attrSets;
				}
				return self.getAttributeSetsData(self._attributeSets, self._layerRef);
			});
		}
		else {
			this._layerRef = ThemeYearConfParams.layerRef;
			return this.getAttributeSetsData(this._attributeSets, this._layerRef);
		}
	};

	/**
	 * It returns a Promise of metadata for all attribute sets with given layerRef
	 * @param attributeSets {Array} Ids of attroibute sets
	 * @param layerRef {number} Id of layerRef
	 * @returns {Promise}
	 */
	AttributesMetadata.prototype.getAttributeSetsData = function(attributeSets, layerRef){
		var self = this;
		return Promise.all(attributeSets.map(function (attributeSet) {
			return Stores.retrieve("attributeSet").byId(attributeSet).then(function (attrSet) {
					return attrSet[0];
				}).then(function(attributeSet){
					return Promise.all(attributeSet.attributes.map(function (attribute) {
						var params = {
							attr: attribute,
							attrSet: attributeSet.id,
							layerRef: layerRef
						};
						return self.metadataRequest(params);
					}));
				});
		}));
	};

	/**
	 * It returns data about given attribute as well as its extreme values
	 * @param params {Object}
	 * @param params.attr {number} Id of attribute
	 * @param params.attrSet {number} Id of attributeSet
	 * @param params.layerRef {number} Id of layerRef
	 * @returns {Remote} promise
	 */
	AttributesMetadata.prototype.metadataRequest = function(params){
		return new Remote({
			method: "GET",
			url: window.Config.url + "rest/attribute" + "/" + params.attr,
			params: {
				attrSet: params.attrSet,
				layer: params.layerRef
			}
		});
	};

	/**
	 * It returns current state of ThemeYearConfParams global object
	 * @returns {{theme: string, years: string, dataset: string, refreshLayers: string, refreshAreas: string, queryTopics: string, expanded: string, parentgids: string, fids: string, artifexpand: string, layerRef: string}}
	 */
	AttributesMetadata.prototype.getThemeYearConfParams = function(){
		return {
			theme: ThemeYearConfParams.theme,
			years: ThemeYearConfParams.years,
			dataset: ThemeYearConfParams.dataset,
			refreshLayers: ThemeYearConfParams.refreshLayers,
			refreshAreas: ThemeYearConfParams.refreshAreas,
			queryTopics: ThemeYearConfParams.queryTopics,
			expanded: ThemeYearConfParams.expanded,
			parentgids: ThemeYearConfParams.parentgids,
			fids: ThemeYearConfParams.fids,
			artifexpand: ThemeYearConfParams.artifexpand,
			layerRef: ThemeYearConfParams.layerRef
		};
	};

	return AttributesMetadata;
});
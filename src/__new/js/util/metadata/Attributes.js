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
		this._layerRef = null;
		this._place = null;
		this.levels = options.levels;
	};

	/**
	 * @returns {Promise}
	 */
	Attributes.prototype.getData = function(){
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
				var level, areas;
				if (output.data.hasOwnProperty("areas")){
					areas = output.data.areas;
					level = areas[areas.length-1].at;
					self.levels.addAreas(level,self.getAreasGids(areas, level));
					self._layerRef = areas[0].lr;
					self._place = areas[0].loc;
					ThemeYearConfParams.level = level;
				} else if (output.data.length > 0) {
					level = output.data[0].at;
					self.levels.addAreas(level,self.getAreasGids(output.data, level));
					self._layerRef = output.data[0].lr;
					self._place = output.data[0].loc;
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
	Attributes.prototype.getAttributeSetsData = function(attributeSets, layerRef){
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
	Attributes.prototype.metadataRequest = function(params){
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
	Attributes.prototype.getThemeYearConfParams = function(){
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

	/**
	 * It returns ids of areas
	 * @param areas {Array} metadata about areas
	 * @param level {number} id of the level
	 * @returns {Array} areas gids
	 */
	Attributes.prototype.getAreasGids = function(areas, level){
		var areasGids = [];
		areas.forEach(function(area){
			if(area.hasOwnProperty("gid")){
				if(area.hasOwnProperty("at")){
					if (area.at == level){
						areasGids.push(area.gid);
					}
				}
			}
		});
		return areasGids;
	};

	Attributes.prototype.getPlace = function(){
		return this._place;
	};

	return Attributes;
});
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
	 * @returns {Promise}
	 */
	Attributes.prototype.getData = function(){
		var self = this;

		if (ThemeYearConfParams.datasetChanged || ThemeYearConfParams.themeChanged){
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
	 * It returns a Promise of metadata for all attribute sets with given layerRef
	 * @param attributeSets {Array} Ids of attroibute sets
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
								as: attributeSet.id,
								asName: attributeSet.name,
								normType: attr[0].type
							};
							return self.filterRequest(params);
						});
					}));
				});
		}));
	};

	Attributes.prototype.filterRequest = function(params){
		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/filter",
			params: {
				dataset: ThemeYearConfParams.dataset,
				years: ThemeYearConfParams.years,
				filters: JSON.stringify([]),
				attrs: JSON.stringify([params]),
				areas: JSON.stringify(ExpandedAreasExchange)
			}
		}).then(function(response){
			return {
				about: params,
				response: JSON.parse(response)
			};
		});
	};

	/**
	 *
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

	///**
	// * It returns ids of areas
	// * @param areas {Array} metadata about areas
	// * @param level {number} id of the level
	// * @returns {Array} areas gids
	// */
	//Attributes.prototype.getAreasGids = function(areas, level){
	//	var areasGids = [];
	//	areas.forEach(function(area){
	//		if(area.hasOwnProperty("gid")){
	//			if(area.hasOwnProperty("at")){
	//				if (area.at == level){
	//					areasGids.push(area.gid);
	//				}
	//			}
	//		}
	//	});
	//	return areasGids;
	//};

	return Attributes;
});
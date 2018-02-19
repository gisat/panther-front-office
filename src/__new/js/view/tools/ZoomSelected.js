define([
	'../../stores/Stores',
	'../../util/RemoteJQ',
	'jquery',
	'underscore'
], function(Stores,
			RemoteJQ,
			$,
			_){

	/**
	 * Class representing Zoom Selected functionality on Map Tools Widget
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @constructor
	 */
	var ZoomSelected = function(options){
		this._dispatcher = options.dispatcher;
	};

	/**
	 * Zoom to selected area/areas
	 */
	ZoomSelected.prototype.zoom = function(){
		var areas = this.getSelectedAreas();
		var self = this;
		if (areas){
			new RemoteJQ({
				url: 'rest/info/bboxes',
				params: {
					areas: areas,
					periods: Stores.retrieve('state').current().periods
				}
			}).post().then(function(result){
					if (result.status === 'ok'){
						self._dispatcher.notify('map#zoomSelected', result.bbox);
					} else {
						window.alert(result.message);
					}
				}).catch(function (err) {
					throw new Error(err);
				});
		}
	};

	/**
	 * Get a list of selected areas
	 * @returns {Array}
	 */
	ZoomSelected.prototype.getSelectedAreas = function(){
		var areas = [];
		var selection = Select.selectedAreasMap;

		if (selection){
			for (var color in selection){
				var items = selection[color];
				items.forEach(function(item){
					delete item.equals;
					delete item.geom;
					areas.push(item);
				});
			}
		}
		var groupedAreas = _.groupBy(areas, function(area){return area.loc});

		var finalAreas = [];
		for (var location in groupedAreas){
			var areasForLocation = groupedAreas[location];
			var locationObj = {
				loc: location,
				at: areasForLocation[0].at,
				gids: []
			};
			areasForLocation.forEach(function (area) {
				locationObj.gids.push(area.gid);
			});
			finalAreas.push(locationObj)
		}


		return finalAreas;
	};

	return ZoomSelected;
});
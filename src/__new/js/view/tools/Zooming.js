define([
	'../../error/ArgumentError',
	'../../util/Logger',
	'../../util/RemoteJQ',

	'jquery',
	'underscore'
], function(ArgumentError,
			Logger,
			RemoteJQ,

			$,
			_){

	/**
	 * Class representing Zoom Selected functionality on Map Tools Widget
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var Zooming  = function(options){
		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'ZoomSelected', 'constructor', 'Stores must be provided'));
		}
		if(!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'ZoomSelected', 'constructor', 'Store state must be provided'));
		}
		this._dispatcher = options.dispatcher;

		this._store = options.store;
	};

	/**
	 * Zoom to place
	 */
	Zooming.prototype.zoomToExtent = function(){
		this._dispatcher.notify('map#zoomToExtent');
	};

	/**
	 * Zoom to selected area/areas. Get bounding box of selection from server, then notify MapsContainer
	 */
	Zooming.prototype.zoomSelected = function(){
		var areas = this.getSelectedAreas();
		if (areas){
			var self = this;
			new RemoteJQ({
				url: 'rest/info/bboxes',
				params: {
					areas: areas,
					periods: this._store.state.current().periods
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
	 * Get selected areas and group them by unique place-areaTemplate combination
	 * @returns {Array} List of areas
	 */
	Zooming.prototype.getSelectedAreas = function(){
		var areas = [];
		var finalAreas = [];
		var selection = Select.selectedAreasMap;

		/**
		 * Go through all selections and get list of selected areas
		 */
		if (selection){
			for (var color in selection){
				var items = selection[color];
				items.forEach(function(item){
					delete item.equals;
					delete item.geom;
					delete item.index;
					areas.push(item);
				});
			}
		}

		/**
		 * Get objects representing set of areas for given location and area template
		 */
		var areasGroupedByLocation = _.groupBy(areas, function(area){return area.loc});
		for(var location in areasGroupedByLocation){
			var areasForLocation = areasGroupedByLocation[location];
			var areasGroupedByAt = _.groupBy(areasForLocation, function(area){return area.at});

			for(var template in areasGroupedByAt){
				var areasForAt = areasGroupedByAt[template];
				var group = {
					loc: location,
					at: areasForAt[0].at,
					gids: []
				};
				areasForAt.forEach(function (area) {
					group.gids.push(area.gid);
				});
				finalAreas.push(group);
			}
		}
		return finalAreas;
	};

	return Zooming;
});
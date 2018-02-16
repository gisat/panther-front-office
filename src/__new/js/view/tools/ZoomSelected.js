define([
	'../../stores/Stores',
	'../../util/RemoteJQ',
	'jquery'
], function(Stores,
			RemoteJQ,
			$){

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
		if (areas.length){
			// get bounding boxes from server
			var bboxes = [];
			new RemoteJQ({
				url: 'rest/info/bboxes',
				params: {
					areas: areas,
					periods: Stores.retrieve('state').current().periods
				}
			}).post().then(function(result){
					if (result.status === 'ok'){
						self._dispatcher.notify('map#zoomSelected', result.data);
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

		return areas;
	};

	return ZoomSelected;
});
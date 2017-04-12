define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var WmsLayer = function(options) {
		Model.apply(this, arguments);
	};

	WmsLayer.prototype = Object.create(Model.prototype);

	WmsLayer.prototype.data = function(){
		return {
			id: {
				serverName: 'id'
			},
			name: {
				serverName: 'name'
			},
			layer: {
				serverName: 'layer'
			},
			url: {
				serverName: 'url'
			},
			scope: {
				serverName: 'scope'
			},
			locations: {
				serverName: 'places'
			},
			periods: {
				serverName: 'periods'
			},
			permissions: {
				serverName: 'permissions'
			}
		};
	};

	return WmsLayer;
});
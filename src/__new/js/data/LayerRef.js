define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var LayerRef = function(options) {
		Model.apply(this, arguments);
	};

	LayerRef.prototype = Object.create(Model.prototype);

	LayerRef.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			active: {
				serverName: 'active'
			},
			created: {
				serverName: 'created'
			},
			createdBy: {
				serverName: 'createdBy'
			},
			changed: {
				serverName: 'changed'
			},
			changedBy: {
				serverName: 'changedBy'
			},
			layer: {
				serverName: 'layer'
			},
			location: {
				serverName: 'location'
			},
			year: {
				serverName: 'year'
			},
			areaTemplate: {
				serverName: 'areaTemplate'
			},
			isData: {
				serverName: 'isData'
			}
		};
	};

	return LayerRef;
});
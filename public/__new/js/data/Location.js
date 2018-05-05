define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Location = function(options) {
		Model.apply(this, arguments);
	};

	Location.prototype = Object.create(Model.prototype);

	Location.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			bbox: {
				serverName: 'bbox'
			},
			dataset: {
				serverName: 'dataset'
			},
			geometry: {
				serverName: 'geometry'
			},
			changeReviewGeometryBefore: {
				serverName: 'changeReviewGeometryBefore'
			},
			changeReviewGeometryAfter: {
				serverName: 'changeReviewGeometryAfter'
			}
		};
	};

	return Location;
});
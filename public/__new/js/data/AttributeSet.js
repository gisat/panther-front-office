define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var AttributeSet = function(options) {
		Model.apply(this, arguments);
	};

	AttributeSet.prototype = Object.create(Model.prototype);

	AttributeSet.prototype.data = function(){
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
			name: {
				serverName: 'name'
			},
			attributes: {
				serverName: 'attributes'
			},
			topics: {
				serverName: 'topics'
			},
			featureLayers: {
				serverName: 'featureLayers'
			}
		};
	};

	return AttributeSet;
});
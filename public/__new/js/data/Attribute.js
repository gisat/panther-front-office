define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Attribute = function(options) {
		Model.apply(this, arguments);
	};

	Attribute.prototype = Object.create(Model.prototype);

	Attribute.prototype.data = function(){
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
			type: {
				serverName: 'type'
			},
			standardUnits: {
				serverName: 'standardUnits'
			},
			units: {
				serverName: 'units'
			},
			color: {
				serverName: 'color'
			}
		};
	};

	return Attribute;
});
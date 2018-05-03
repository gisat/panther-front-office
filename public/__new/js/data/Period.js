define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Period = function(options) {
		Model.apply(this, arguments);
	};

	Period.prototype = Object.create(Model.prototype);

	Period.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			period: {
				serverName: 'period'
			}
		};
	};

	return Period;
});
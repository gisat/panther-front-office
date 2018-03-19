define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Visualization = function(options) {
		Model.apply(this, arguments);
	};

	Visualization.prototype = Object.create(Model.prototype);

	Visualization.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			theme: {
				serverName: 'theme'
			},
			attributes: {
				serverName: 'attributes'
			},
			options: {
				serverName: 'options'
			}
		};
	};

	return Visualization;
});
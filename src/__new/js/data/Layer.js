define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Layer = function(options) {
		Model.apply(this, arguments);
	};

	Layer.prototype = Object.create(Model.prototype);

	Layer.prototype.data = function(){
		return {
			id: {
				serverName: 'id'
			}
		};
	};

	return Layer;
});
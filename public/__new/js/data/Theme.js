define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Theme = function(options) {
		Model.apply(this, arguments);
	};

	Theme.prototype = Object.create(Model.prototype);

	Theme.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			dataset: {
				serverName: 'dataset'
			}
		};
	};

	return Theme;
});

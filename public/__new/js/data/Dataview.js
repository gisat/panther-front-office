define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Dataview = function(options) {
		Model.apply(this, arguments);
	};

	Dataview.prototype = Object.create(Model.prototype);

	Dataview.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			data: {
				serverName: 'conf'
			},
			date: {
				serverName: 'changed'
			}
		};
	};

	return Dataview;
});
define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Scope = function(options) {
		Model.apply(this, arguments);
	};

	Scope.prototype = Object.create(Model.prototype);

	Scope.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			periods: {
				serverName: 'years'
			}
		};
	};

	return Scope;
});

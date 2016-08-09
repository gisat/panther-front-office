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
			years: {
				serverName: 'years'
			},
			topics: {
				serverName: 'topics'
			},
			preferedTopics: {
				serverName: 'prefTopics'
			},
			dataset: {
				serverName: 'dataset'
			}
		};
	};

	return Theme;
});
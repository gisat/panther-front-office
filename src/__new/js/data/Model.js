define(['../util/Promise'], function (Promise) {
	/**
	 * It returns promise of this model.
	 * @constructor
	 */
	var Model = function (options) {
		return this.resolve(options.data);
	};

	/**
	 * Prepare promise for all the properties, which are actual domain objects.
	 * @param data Object with data from the API.
	 */
	Model.prototype.resolve = function (data) {
		var self = this;
		var promises = [];
		_.each(self.data(), function (value, key) {
			var internalKey = key;
			if(value.isPromise) {
				if(value.isArray) {
					self[internalKey] = value.transform({id: data[value.serverName]});
				} else {
					self[internalKey] = value.transform(data[value.serverName]);
				}

				promises.push(self[internalKey]);
			} else {
				if(value.transform && value.all) {
					self[internalKey] = value.transform(data);
				} else if(value.transform) {
					self[internalKey] = value.transform(data[value.serverName]);
				} else {
					self[internalKey] = data[value.serverName];
				}
			}
		});

		return Promise.all(promises);
	};

	// todo
	//Model.prototype. revert resolve

	return Model;
});

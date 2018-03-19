define([
	'../util/Logger',
	'../error/NotOverriddenError',
	'../util/Promise',
	'../util/Remote'
], function (Logger,
			 NotOverriddenError,
			 Promise,
			 Remote) {
	/**
	 * Base class for retrieving model information from the server. It serves as a repository.
	 * @constructor
	 * @alias BaseStore
	 * @param options {Object}
	 * @param options.models {Model[]} It is possible to supply models. If models are supplied this way. Load
	 * function isn't internally called. It is still possible to use it from outside to refresh the data.
	 */
	var BaseStore = function (options) {
		options = options || {};
		this._models = options.models || null;
		this._listeners = [];
	};

	/**
	 * Clear store
	 */
	BaseStore.prototype.clear = function(){
		this._models = null;
	};

	/**
	 * It returns the promise of all loaded models. It doesn't by default saves the information into the store.
	 * @param options {Object}
	 * @param options.params {Object} Parameters, which should be appended to the request.
	 * @return {Promise} Promise of the models to be delivered.
	 */
	BaseStore.prototype.load = function (options) {
		options = options || {};
		var self = this;
		return new Promise(function (resolve, reject) {
			new Remote({
				method: "GET",
				url: Config.url + self.getPath(),
				params: options.params || {}
			}).then(function (dataFromApi) {
				dataFromApi = JSON.parse(dataFromApi);
				// User and Group endpoint return twice wrapped information.
				try{
					if(!dataFromApi.data) {
						dataFromApi = JSON.parse(dataFromApi);
					}
				} catch(e) {}
				var models = [];
				if(_.isArray(dataFromApi.data)) {
					dataFromApi.data.forEach(function (model) {
						model.params = options.params;
						models.push(self.getInstance(model));
					});
				} else {
					dataFromApi.data.params = options.params;
					models.push(self.getInstance(dataFromApi.data));
				}
				self.loaded(models);
				resolve(models);
			}, reject).catch(function(error){
				reject(error);
			});
		});
	};

	/**
	 * Hook for descendants to know that loading was finished.
	 */
	BaseStore.prototype.loaded = function() {

	};

	/**
	 * It specifies path on the server for retrieving models for current store.
	 * @return {String} Path on the server.
	 * @throws NotOverriddenError If it wasn't overridden by subclasses.
	 */
	BaseStore.prototype.getPath = function() {
		throw new NotOverriddenError(
			Logger.logMessage(Logger.LEVEL_INFO, "Gisat", "getPath", "Get Path must be overridden by subclasses.")
		);
	};

	/**
	 * It allows you to specify the process for retrieving the instance based on the data.
	 * @param dataFromApi {Object} Object to be transformed into the model.
	 * @return {Model} Instantiated Model.
	 */
	BaseStore.prototype.getInstance = function(dataFromApi) {
		throw new NotOverriddenError(
			Logger.logMessage(Logger.LEVEL_INFO, "Gisat", "getInstance", "Get Instance must be overridden by" +
				" subclasses.")
		);
	};

	/**
	 * Adds listener to the pool of listeners.
	 * @param listener {Function} Function to be added as a listener.
	 */
	BaseStore.prototype.addListener = function(listener) {
		this._listeners.push(listener);
	};

	BaseStore.prototype.removeLastListener = function() {
		this._listeners.pop();
	};

	/**
	 * Notifies all listeners.
	 * @param event {Object|string} Object representing information about event. Type of event, if string.
	 * @param options {Object}
	 */
	BaseStore.prototype.notify = function(event, options) {
		this._listeners.forEach(function(listener){
			listener(event, options);
		});
	};

	/**
	 * Finds model by id.
	 * @param id {Object} Id of the element to retrieve.
	 * @returns {Promise} Promise of the array containing one data element.
	 */
	BaseStore.prototype.byId = function (id) {
		return this.filter({id: id});
	};

	/**
	 * Finds all models.
	 * @returns {Promise} Promise of all elements available under the directory.
	 */
	BaseStore.prototype.all = function () {
		if(!this._models) {
			this._models = this.load();
		}
		return this._models;
	};

	/**
	 * Finds subset of all models available in this repository. It supports value as a Array meaning that if the
	 * value is in this array it should remain. It checks for equality using != operator meaning that 1 and "1" is
	 * equal for our purposes.
	 * @params options {Object} Options for filtering.
	 * @returns {Promise} Promise of all elements available under the directory.
	 */
	BaseStore.prototype.filter = function (options) {
		if(!this._models) {
			this._models = this.load();
		}
		var self = this;
		return new Promise(function (resolve, reject) {
			self._models.then(function (models) {
				var filtered = models.filter(function (model) {
					var shouldRemain = true;

					// If it doesn't satisfy all the conditions. Array means that the attribute under the key must be
					// contained in the value to succeed.
					_.each(options, function (value, key) {
						if(_.isArray(value) && !_.isArray(model[key])) {
							if(_.isEmpty(value)) {
								return;
							}
							if(!_.contains(value, model[key])) {
								shouldRemain = false;
							}
						} else if (!_.isArray(value) && _.isArray(model[key])){
							if(!_.contains(model[key], value)) {
								shouldRemain = false;
							}
						} else {
							if (typeof model[key] == "boolean"){
								if (model[key] != value){
									shouldRemain = false;
								}
							}
							else if (!model[key] || model[key] != value) {
								shouldRemain = false;
							}
						}
					});
					return shouldRemain;
				});

				resolve(filtered);
			}, function (err) {
				reject(err);
			})
		});
	};

	return BaseStore;
});
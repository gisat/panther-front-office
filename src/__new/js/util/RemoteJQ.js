define(['../error/ArgumentError',
	'../error/NotFoundError',
	'./Logger',

	'./Promise',

	'jquery'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Promise,
			$
){
	/**
	 * @param options {Object}
	 * @constructor
	 */
	var RemoteJQ = function(options){
		if (!options.url){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RemoteJQ", "constructor", "missingUrl"));
		}

		this._url = Config.url + options.url;
		this._params = {};
		if (options.hasOwnProperty("params")){
			this._params = options.params;
		}
	};

	/**
	 * Get request
	 * @returns {Promise}
	 */
	RemoteJQ.prototype.get = function(){
		var self = this;
		return new Promise(function(resolve, reject){
			$.get(self._url, self._params).done(function(data) {
				resolve(data);
			}).catch(function(err){
				throw new Error(err);
			});
		});
	};

	/**
	 * Post request
	 * @returns {Promise}
	 */
	RemoteJQ.prototype.post = function(){
		var self = this;
		return new Promise(function(resolve, reject){
			$.ajax({
				type: "POST",
				url: self._url,
				data: self._params
			}).done(function(data) {
				resolve(data);
			}).catch(function(err){
				throw new Error(err);
			});
		});
	};

	return RemoteJQ;
});
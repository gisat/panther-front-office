define([
	'../error/ArgumentError',
	'./Logger',
	'./Promise',
	'./Remote'
], function (ArgumentError,
			 Logger,
			 Promise,
			 Remote) {
	"use strict";
	/**
	 * It represents remote content loaded over the network.
	 * @param options {Object}
	 * @param options.url {String} Url to query
	 * @param options.params {Object} Object containing parameters to append.
	 * @param options.method {string} XMLHttpRequest method
	 * @constructor
	 */
	var MelodiesRemote = function (options) {
		this._options = options;
		this._method = options.method;
		this._url = options.url;
		this._params = options.params;

		return this.request();
	};

	MelodiesRemote.prototype = Object.create(Remote.prototype);

	MelodiesRemote.prototype.ajax = function (url, options) {
		var self = this;

		// Return promise.
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();

			xhr.open(self._method, url, true);

			xhr.onreadystatechange = (function () {
				console.log(xhr.readyState);
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(xhr.status);
					}
					else {
						resolve(xhr.status);
						Logger.log(Logger.LEVEL_WARNING,
							"File retrieval failed (" + xhr.statusText + "): " + url);
					}
				}
			});

			xhr.onerror = (function () {
				Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval failed: " + url);

				reject();
			}).bind(this);

			xhr.ontimeout = (function () {
				Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval timed out: " + url);

				reject();
			}).bind(this);

			if (self._method == "POST"){
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(options);
			}
			else {
				xhr.send(null);
			}
		});
	};

	return MelodiesRemote;
});
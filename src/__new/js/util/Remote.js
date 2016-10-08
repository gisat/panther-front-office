define([
	'../error/ArgumentError',
	'./Logger',
	'./Promise'
], function (ArgumentError,
			 Logger,
			 Promise) {
	"use strict";
	/**
	 * It represents remote content loaded over the network.
	 * @param options {Object}
	 * @param options.url {String} Url to query
	 * @param options.params {Object} Object containing parameters to append.
	 * @param options.method {string} XMLHttpRequest method
	 * @constructor
	 */
	var Remote = function (options) {
		this._options = options;
		this._method = options.method;
		this._url = options.url;
		this._params = options.params;
		this._responseType = options.responseType || null;
		return this.request();
	};

	/**
	 * What type of request should be used
	 */
	Remote.prototype.request = function(){
		var options = this.prepareParams(this._params);
		var url = this.prepareUrl(this._url, this._params || {});

		// Returns promise.
		return this.ajax(url, options);
	};

	/**
	 * It prepares Url based on the information in the
	 * @param url {String} String representing the url.
	 * @param params {Object} Object representing the keys and values.
	 */
	Remote.prototype.prepareUrl = function(url, params) {
		url += "?";
		url += this.prepareParams(params);
		return encodeURI(url);
	};

	/**
	 * It prepares params
	 * @param params {Object} Object representing the keys and values.
	 * @returns {string} Encoded url
	 */
	Remote.prototype.prepareParams = function(params){
		var url = "";

		_.each(params, function(value, key) {
			url += key + "=" + value + "&"
		});

		url = url.substring(0, url.length - 1);
		return encodeURI(url);
	};

	/**
	 * It calls remote resource.
	 * @param url
	 * @param options
	 * @returns {Promise}
	 */

	Remote.prototype.ajax = function (url, options) {
		var self = this;

		// Return promise.
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();

			xhr.open(self._method, url, true);
			if (self._responseType) {
				xhr.responseType = self._responseType;
			}

			xhr.onreadystatechange = (function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var text = this.responseText;
						resolve(text);
					}
					else {
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

	return Remote;
});
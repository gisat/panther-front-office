define([
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'string',
	'jquery',
	'text!./MapsContainer.html',
	'css!./MapsContainer'
], function(ArgumentError,
			NotFoundError,
			Logger,

			S,
			$,
			mapsContainer
){
	/**
	 * Class representing container containing maps
	 * @param options {Object}
	 * @param options.id {string} id of the container
	 * @param options.target {Object} JQuery selector of target element
	 * @constructor
	 */
	var MapsContainer = function(options){
		if (!options.target || !options.target.length){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingTarget"));
		}
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingId"));
		}
		this._target = options.target;
		this._id = options.id;

		this.build();
	};

	/**
	 * Build container
	 */
	MapsContainer.prototype.build = function(){
		var html = S(mapsContainer).template({
			id: this._id
		}).toString();
		this._target.append(html);
		this._containerSelector = $("#" + this._id);
	};

	/**
	 * Retrun Jquery selector of maps container
	 * @returns {*|jQuery|HTMLElement}
	 */
	MapsContainer.prototype.getContainerSelector = function(){
		return this._containerSelector;
	};

	return MapsContainer;
});
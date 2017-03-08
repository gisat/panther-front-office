define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'string',
	'jquery',
	'text!./Placeholder3D.html',
	'css!./Placeholder3D'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 S,
			 $,
			 Placeholder3DHtml) {
	"use strict";

	/**
	 * Base class for placeholder
	 * @param options {Object}
	 * @param options.id {string} id of the placeholder
	 * @param options.name {string} name of the widget
	 * @param options.target {JQuery} target element selector
	 * @constructor
	 */
	var Placeholder3D = function (options) {
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Placeholder3D", "constructor", "missingTarget"));
		}
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Placeholder3D", "constructor", "missingWidgetId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Placeholder3D", "constructor", "missingWidgetName"));
		}

		this._target = options.target;
		this._id = options.id;
		this._name = options.name;

		this.build();
	};

	/**
	 * Build placeholder
	 */
	Placeholder3D.prototype.build = function(){
		var placeholder = S(Placeholder3DHtml).template({
			id: this._id,
			name: this._name
		}).toString();

		this._target.append(placeholder);
	};

	/**
	 * Return placeholder selector
	 * @returns {jQuery}
	 */
	Placeholder3D.prototype.getPlaceholder = function(){
		return $("#" + this._id);
	};

	return Placeholder3D;
});
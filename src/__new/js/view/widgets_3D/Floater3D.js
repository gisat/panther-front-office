define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'string',
	'jquery',
	'text!./Floater3D.html',
	'css!./Floater3D'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 S,
			 $,
			 Floater3DHtml) {
	"use strict";

	/**
	 * Base class for floater
	 * @param options {Object}
	 * @param options.id {string} id of the placeholder
	 * @param options.name {string} name of the widget
	 * @param options.target {JQuery} target element selector
	 * @constructor
	 */
	var Floater3D = function (options) {
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Floater3D", "constructor", "missingTarget"));
		}
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Floater3D", "constructor", "missingWidgetId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Floater3D", "constructor", "missingWidgetName"));
		}

		this._target = options.target;
		this._id = options.id;
		this._name = options.name;

		this.build();
	};

	/**
	 * Build placeholder
	 */
	Floater3D.prototype.build = function(){
		var floater = S(Floater3DHtml).template({
			id: this._id,
			name: this._name
		}).toString();

		this._target.append(floater);
		this._floater = $("#" + this._id);
		this._closeButton = this._floater.find(".floater3D-close");

		this.addListeners();
	};

	/**
	 * Add listeners
	 */
	Floater3D.prototype.addListeners = function(){
		this.onCloseButtonClick();
	};

	/**
	 * Close floater on close button click
	 */
	Floater3D.prototype.onCloseButtonClick = function(){
		var self = this;
		this._closeButton.on("click", function(){
			self._floater.removeClass("open");
		});
	};

	/**
	 * Return floater selector
	 * @returns {jQuery}
	 */
	Floater3D.prototype.getFloater = function(){
		return this._floater;
	};

	return Floater3D;
});
define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'string',
	'jquery',
	'text!./Floater3D.html',

	'jquery-ui',
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
	 * @param options.placeholder {JQuery} placeholder element selector
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
		if (!options.placeholder){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Floater3D", "constructor", "missingPlaceholder"));
		}

		this._target = options.target;
		this._id = options.id;
		this._name = options.name;
		this._placeholder = options.placeholder;

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
		this._maximiseButton = this._floater.find(".floater3D-maximise");
		this._floatingButton = this._floater.find(".floater3D-make-floating");

		this.makeDraggable();
		this.addListeners();
	};

	/**
	 * Make floater draggable
	 */
	Floater3D.prototype.makeDraggable = function(){
		this._floater.draggable({
			containment: "body",
			handle: ".floater3D-header"
		}).on("click drag", function(){
			$(".floater3D").removeClass("active");
			$(this).addClass("active");
		}).css("position", "absolute");
	};

	/**
	 * Add listeners
	 */
	Floater3D.prototype.addListeners = function(){
		this.onCloseButtonClick();
		this.onFloatingButtonClick();
		this.onMaximiseButtonClick();
	};

	/**
	 * Close floater on close button click
	 */
	Floater3D.prototype.onCloseButtonClick = function(){
		var self = this;
		this._closeButton.on("click", function(){
			self._floater.draggable("disable").removeClass("open").removeClass("maximised").removeClass("floating").css({
				left: 0,
				top: 0,
				height: '',
				width: ''
			});
			self._placeholder.removeClass("activated");
		});
	};

	/**
	 * Maximise floater on maximise button click
	 */
	Floater3D.prototype.onMaximiseButtonClick = function(){
		var self = this;
		this._maximiseButton.on("click", function(){
			self._floater.draggable("disable").removeClass("floating").addClass("maximised").css({
				left: 0,
				top: 0,
				height: '',
				width: ''
			});
		});
	};

	/**
	 * Make floater floating on floating button click
	 */
	Floater3D.prototype.onFloatingButtonClick = function(){
		var self = this;
		this._floatingButton.on("click", function(){
			self._floater.draggable("enable").removeClass("maximised").addClass("floating").css({
				left: 100,
				top: 100
			});
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
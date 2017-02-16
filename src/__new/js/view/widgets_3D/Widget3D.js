define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'./Floater3D',
	'./Placeholder3D',
	'../View',

	'string',
	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Floater3D,
			 Placeholder3D,
			 View,

			 S,
			 $) {
	"use strict";

	/**
	 * Base class for creating of widgets in 3D map mode.
	 * @param options {Object}
	 * @param options.id {string} id of the widget
	 * @param options.name {string} name of the widget
	 * @param options.worldWind {WorldWind.WorldWindow}
	 * @augments View
	 * @constructor
	 */
	var Widget3D = function (options) {
		View.apply(this, arguments);

		if (!options.worldWind){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget3D", "constructor", "missingWorldWind"));
		}
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget3D", "constructor", "missingWidgetId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget3D", "constructor", "missingWidgetName"));
		}

		this._worldWind = options.worldWind;
		this._id = options.id;
		this._name = options.name;

		this._container = this._worldWind.getContainer();
		this._placeholdersContainer = $("#widgets3d-placeholders-container");

		this.build();
	};

	Widget3D.prototype = Object.create(View.prototype);

	/**
	 * Build widget
	 */
	Widget3D.prototype.build = function(){
		this._placeholder = this.buildPlaceholder();
		this._placeholderSelector = this._placeholder.getPlaceholder();
		this._floater = this.buildFloater();
		this._floaterSelector = this._floater.getFloater();
		this.addListeners();
	};

	/**
	 * Build placeholder for widget
	 * @returns {Placeholder3D}
	 */
	Widget3D.prototype.buildPlaceholder = function(){
		return new Placeholder3D({
			id: this._id + "-placeholder",
			name: this._name,
			target: this._placeholdersContainer
		});
	};

	/**
	 * Build floater for widget
	 * @returns {Floater3D}
	 */
	Widget3D.prototype.buildFloater = function(){
		return new Floater3D({
			id: this._id + "-floater",
			name: this._name,
			target: $("#main"),
			placeholder: this._placeholderSelector
		});
	};

	/**
	 * Add listeners
	 */
	Widget3D.prototype.addListeners = function(){
		this.onPlaceholderClick();
	};

	/**
	 * Show/hide floater on placeholder click
	 */
	Widget3D.prototype.onPlaceholderClick = function(){
		var self = this;
		this._placeholderSelector.on("click", function(){
			if (self._floaterSelector.hasClass("open")){
				self._floaterSelector.removeClass("open").removeClass("maximised").removeClass("floating").css({
					left: 0,
					top: 0,
					height: '',
					width: ''
				});
				self._placeholderSelector.removeClass("activated");
			} else {
				self._floaterSelector.draggable("disable").addClass("open").addClass("maximised");
				self._placeholderSelector.addClass("activated");
			}
		});
	};

	return Widget3D;
});
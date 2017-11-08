define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../Widget',

	'jquery',
	'css!./MapToolsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Widget,

			$){

	/**
	 * Class representing a widget of map tools for World Wind
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.featureInfo {Object}
	 * @constructor
	 */
	var MapToolsWidget = function(options){
		Widget.apply(this, arguments);

		this._dispatcher = options.dispatcher;
		this._featureInfo = options.featureInfo;

		this.build();
		this.deleteFooter(this._widgetSelector);
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	MapToolsWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	MapToolsWidget.prototype.build = function(){
		if (this._featureInfo){
			this.buildFeatureInfoTrigger();
		}
		this.handleLoading("hide");
	};

	/**
	 * Rebuild widget
	 */
	MapToolsWidget.prototype.rebuild = function(){
		if (this._featureInfo && this._featureInfoTrigger.hasClass("active")){
			this._featureInfoTrigger.trigger("click")
		}
	};

	/**
	 * Build trigger for Feature info functionality
	 */
	MapToolsWidget.prototype.buildFeatureInfoTrigger = function(){
		var content = '<button class="map-tools-trigger" id="feature-info-trigger">Feature Info</button>';
		this._widgetBodySelector.append(content);
		this._featureInfoTrigger = $("#feature-info-trigger");
		this.addFeatureInfoTriggerListener();
	};

	/**
	 * Add on click listener to Feature info trigger
	 */
	MapToolsWidget.prototype.addFeatureInfoTriggerListener = function(){
		var self = this;
		this._featureInfoTrigger.on("click", function(){
			var trigger = $(this);
			var isActive = trigger.hasClass("active");
			if (isActive){
				self._featureInfo.deactivateFor3D();
				trigger.removeClass("active");
			} else {
				self._featureInfo.activateFor3D();
				trigger.addClass("active");
			}
		});
	};

	/**
	 * @param type {string}
	 */
	MapToolsWidget.prototype.onEvent = function (type) {
		if (type === Actions.mapSwitchFramework){
			if (this._featureInfoTrigger.hasClass("active")){
				this._featureInfoTrigger.trigger("click")
			}
		}
	};

	return MapToolsWidget;
});
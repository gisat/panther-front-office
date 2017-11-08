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
	 * @param options.featureInfo {Object}
	 * @constructor
	 */
	var MapToolsWidget = function(options){
		Widget.apply(this, arguments);

		this._featureInfo = options.featureInfo;

		this.build();
		this.deleteFooter(this._widgetSelector);
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
				trigger.removeClass("active");
			} else {
				trigger.addClass("active");
			}
		});
	};

	/**
	 * Rebuild widget
	 */
	MapToolsWidget.prototype.rebuild = function(){
	};

	return MapToolsWidget;
});
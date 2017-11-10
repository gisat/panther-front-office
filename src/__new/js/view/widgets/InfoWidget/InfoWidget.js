define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget',

	'jquery',
	'string',
	'text!./snowInfo.html',
	'css!./InfoWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Widget,

			$,
			S,
			snowContent
){
	/**
	 * Class representing widget for info about application
	 * @param options {Object}
	 * @constructor
	 */
	var InfoWidget = function(options){
		Widget.apply(this, arguments);
		this.build();
	};

	InfoWidget.prototype = Object.create(Widget.prototype);

	InfoWidget.prototype.rebuild = function(){
	};

	InfoWidget.prototype.build = function(){
		var content = this.getContent();
		var html = S(content).template().toString();
		this._widgetBodySelector.append(html);
		this.handleLoading("hide");
	};

	/**
	 * Get content according to configuration
	 * @returns {string} HTML content
	 */
	InfoWidget.prototype.getContent = function(){
		if (Config.toggles.isSnow){
			return snowContent;
		} else {
			return "";
		}
	};

	return InfoWidget;
});
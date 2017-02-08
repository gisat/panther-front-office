define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./BackgroundLayersPanel',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanels.html',
	'css!./WorldWindWidgetPanels'
], function(ArgumentError,
			NotFoundError,
			Logger,

			BackgroundLayersPanel,

			$,
			S,
			htmlBody
){
	/**
	 * @param options {Object}
	 * @param options.id {string} id of element
	 * @param options.target {JQuery} JQuery selector of target element
	 * @constructor
	 */
	var WorldWindWidgetPanels = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingId"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingTarget"));
		}
		this._id = options.id;
		this._target = options.target;
		this.build();
	};

	/**
	 * Build section of World Wind Widget
	 */
	WorldWindWidgetPanels.prototype.build = function(){
		var html = S(htmlBody).template({
			panelsId: this._id
		}).toString();
		this._target.append(html);
		this._panelsSelector = $("#" + this._id);
		this._backgroundLayersPanel = this.buildBackgroundLayersPanel();

		this.addEventsListeners();
	};

	/**
	 * Build particular panels
	 */
	WorldWindWidgetPanels.prototype.buildBackgroundLayersPanel = function(){
		return new BackgroundLayersPanel({
			id: "background-layers",
			name: "Background Layers",
			target: this._panelsSelector,
			isOpen: false
		});
	};

	/**
	 * Add listeners
	 */
	WorldWindWidgetPanels.prototype.addEventsListeners = function(){
		this.onPanelHeaderClick();
	};

	/**
	 * Open/Close panel on panel header click
	 * @returns {boolean}
	 */
	WorldWindWidgetPanels.prototype.onPanelHeaderClick = function(){
		this._panelsSelector.find(".panel-header").click(function(){
			$(this).toggleClass('open');
			$(this).next().slideToggle();
			return false;
		});
	};

	return WorldWindWidgetPanels;
});
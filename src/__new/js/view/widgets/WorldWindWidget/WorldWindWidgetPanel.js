define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanel.html',
	'css!./WorldWindWidgetPanel'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing a panel of WorldWindWidgetPanels
	 * @param options {Object}
	 * @constructor
	 */
	var WorldWindWidgetPanel = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingName"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingTarget"));
		}
		this._id = options.id;
		this._name = options.name;
		this._target = options.target;

		this._isOpen = true;
		if (options.hasOwnProperty("isOpen")){
			this._isOpen = options.isOpen;
		}

		this.build();
	};

	/**
	 * Build panel
	 */
	WorldWindWidgetPanel.prototype.build = function(){
		var html = S(htmlBody).template({
			panelId: this._id,
			name: this._name
		}).toString();
		this._target.append(html);

		this._panelHeaderSelector = $("#" + this._id + "-panel-header");
		this._panelBodySelector = $("#" + this._id + "-panel-body");
		this.toggleState(this._isOpen);
	};

	/**
	 * Show/hide panel
	 * @param state {boolean} true, if panel should be shown
	 */
	WorldWindWidgetPanel.prototype.toggleState = function(state){
		this._panelHeaderSelector.toggleClass("open", state);
		this._panelBodySelector.toggleClass("open", state);
	};

	return WorldWindWidgetPanel;
});
define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../inputs/checkbox/Radiobox',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanel.html',
	'css!./WorldWindWidgetPanel'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Radiobox,

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
		this.addLayers();
	};

	/**
	 * Show/hide panel
	 * @param state {boolean} true, if panel should be shown
	 */
	WorldWindWidgetPanel.prototype.toggleState = function(state){
		this._panelHeaderSelector.toggleClass("open", state);
		this._panelBodySelector.toggleClass("open", state);
	};

	/**
	 * Add radiobox to panel
	 * @param id {string} id of radio box
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param checked {boolean} true if radio should be checked
	 * @returns {Radiobox}
	 */
	WorldWindWidgetPanel.prototype.addRadio = function(id, name, target, checked){
		return new Radiobox({
			id: id,
			name: name,
			target: target,
			containerId: this._id + "-panel-body",
			checked: checked
		});
	};

	return WorldWindWidgetPanel;
});
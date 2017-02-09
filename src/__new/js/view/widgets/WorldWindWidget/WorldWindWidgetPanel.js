define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../inputs/checkbox/Checkbox',
	'../inputs/checkbox/Radiobox',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanel.html',
	'css!./WorldWindWidgetPanel'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			Radiobox,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing a panel of WorldWindWidgetPanels
	 * @param options {Object}
	 * @param options.id {string} id of element
	 * @param options.name {string} name of panel
	 * @param options.target {JQuery} JQuery selector of target element
	 * @param options.worldWind {WorldWind.WorldWindow}
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
		if (!options.worldWind){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWorldWind"));
		}

		this._worldWind = options.worldWind;
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

		this.addContent();
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
	 * Add checkbox to panel
	 * @param id {string} id of checkbox
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param dataId {string} id of data connected with thischeckbox
	 * @param checked {boolean} true if checkbox should be checked
	 * @returns {Radiobox}
	 */
	WorldWindWidgetPanel.prototype.addCheckbox = function(id, name, target, dataId, checked){
		return new Checkbox({
			id: id,
			name: name,
			target: target,
			containerId: this._id + "-panel-body",
			dataId: dataId,
			checked: checked
		});
	};

	/**
	 * Add radiobox to panel
	 * @param id {string} id of radio box
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param dataId {string} id of data connected with this radio
	 * @param checked {boolean} true if radio should be checked
	 * @returns {Radiobox}
	 */
	WorldWindWidgetPanel.prototype.addRadio = function(id, name, target, dataId, checked){
		return new Radiobox({
			id: id,
			name: name,
			target: target,
			containerId: this._id + "-panel-body",
			dataId: dataId,
			checked: checked
		});
	};

	return WorldWindWidgetPanel;
});
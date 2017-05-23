define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../../../inputs/checkbox/Checkbox',
	'../../../../worldWind/layers/layerTools/LayerTools',

	'jquery',
	'string',
	'text!./PanelRow.html'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			LayerTools,

			$,
			S,
			PanelRowHtml
){
	/**
	 * Class representing row in a widget's panel
	 * @param options {Object}
	 * @param options.active {boolean} true, if layer should be active
	 * @param options.id {string} id of the layer
	 * @param options.name {string} name of the layer
	 * @param options.groupId {string} id of the group
	 * @param options.target {JQuery} JQuery selector of target element
	 * @constructor
	 */
	var PanelRow = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PanelRow", "constructor", "missingId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PanelRow", "constructor", "missingName"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PanelRow", "constructor", "missingTarget"));
		}

		this._id = options.id;
		this._groupId = options.groupId;
		this._name = options.name;
		this._target = options.target;
		this._active = options.active || false;

		this.build();
	};

	PanelRow.prototype.build = function(){
		var html = S(PanelRowHtml).template({
			id: this._id + "-panel-row"
		}).toString();

		this._target.append(html);
		this._rowSelector = $('#' + this._id + '-panel-row');

		this.addCheckbox(this._groupId + "-" + this._id, this._name, this._rowSelector, this._id, this._active);
		this._toolBox = this.addToolBox();
	};

	/**
	 * Add checkbox to panel row
	 * @param id {string} id of checkbox
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param dataId {string} id of data connected with thischeckbox
	 * @param checked {boolean} true if checkbox should be checked
	 * @returns {Checkbox}
	 */
	PanelRow.prototype.addCheckbox = function(id, name, target, dataId, checked){
		return new Checkbox({
			id: id,
			name: name,
			target: target,
			containerId: this._groupId + "-panel-body",
			dataId: dataId,
			checked: checked,
			class: "layer-row"
		});
	};

	/**
	 * Build container for layer tools
	 * @returns {LayerTools}
	 */
	PanelRow.prototype.addToolBox = function(){
		return new LayerTools({
			id: this._id,
			class: this._groupId,
			target: this._rowSelector
		});
	};

	PanelRow.prototype.getToolBox = function(){
		return this._toolBox;
	};

	return PanelRow;
});
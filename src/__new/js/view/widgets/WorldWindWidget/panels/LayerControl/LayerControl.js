define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../../../inputs/checkbox/Checkbox',
	'../../../../worldWind/layers/layerTools/LayerTools',

	'jquery',
	'string',
	'text!./LayerControl.html'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			LayerTools,

			$,
			S,
			LayerControlHtml
){

	/**
	 * Class for layer control i layers panel
	 * @param options {Object}
	 * @param options.target {Object} Jquery selector of targete element
	 * @param options.id {number} id of layer template
	 * @param options.name {string} name of layer
	 * @param options.maps {Array} list of current maps
	 * @param options.groupId {string} id of the group
	 * @param options.layers {Array} list of layers attached to this control
	 * @param [options.style] {Object} Optional parameter. Id of the style
	 * @param [options.checked] {boolean} Optional parameter. True, if the layer should be visible by default.
	 * @constructor
	 */
	var LayerControl = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerControl", "constructor", "missingId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerControl", "constructor", "missingName"));
		}
		if (!options.target || options.target.length === 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerControl", "constructor", "missingTarget"));
		}

		this._id = options.id;
		this._name = options.name;
		this._maps = options.maps;
		this._target = options.target;
		this.layers = options.layers;
		this._groupId = options.groupId;
		this.style = options.style || null;
		this._active = options.checked;

		if (this.style){
			if (this.style.name){
				this._name = this._name + " - " + this.style.name;
			}
			if (this.style.path){
				this._id = this._id + "-" + this.style.path;
			}
		}
		this.build();
	};

	/**
	 * Build control
	 */
	LayerControl.prototype.build = function(){
		var html = S(LayerControlHtml).template({
			id: "control-" + this._id,
			dataId: this._id
		}).toString();
		this._target.append(html);
		this._controlSelector = $('#control-' + this._id);

		this.addCheckbox('checkbox-' + this._id, this._name, this._controlSelector, this._id, this._active);
		this.layerTools = this.addLayerTools(this._id, this._name, this._controlSelector, this._groupId, this.layers, this._maps, this.style);
	};

	/**
	 * Add checkbox to panel row
	 * @param id {string} id of checkbox
	 * @param name {string} label
	 * @param target {Object} JQuery selector of target element
	 * @param dataId {string} id of data connected with this checkbox
	 * @param checked {boolean} true if checkbox should be checked
	 * @returns {Checkbox}
	 */
	LayerControl.prototype.addCheckbox = function(id, name, target, dataId, checked){
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
	 * Add box for tools to this control
	 * @param id {string} id of the box
	 * @param name {string} name of the box
	 * @param target {Object} JQuery selector of target element
	 * @param cls {string}
	 * @param layers {Array} Layers associated with the control
	 * @param maps {Array} list of current maps
	 * @param style {Object|null}
	 * @returns {LayerTools}
	 */
	LayerControl.prototype.addLayerTools = function(id, name, target, cls, layers, maps, style){
		return new LayerTools({
			id: id,
			name: name,
			class: cls,
			target: target,
			layers: layers,
			maps: maps,
			style: style
		});
	};

	return LayerControl;
});
define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./legend/LayerLegend',
	'./opacity/LayerOpacity',
	'./legend/Legend',
	'./opacity/Opacity',

	'jquery',
	'css!./LayerTools'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerLegend,
			LayerOpacity,
			Legend,
			Opacity,

			$
){
	/**
	 * Class representing layer tools
	 * @param options {Object}
	 * @param options.id {string} id of the element
	 * @param options.name {name} name of the element
	 * @param options.class {string}
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.maps {Array} list of current maps
	 * @param options.layers {Array} associated layers
	 * @param options.style {Object} associated style
	 * @constructor
	 */
	var LayerTools = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingId"));
		}
		if (!options.class){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingClass"));
		}
		if (!options.target || options.target.length === 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingTarget"));
		}

		this._target = options.target;
		this._id = options.id;
		this._name = options.name;
		this._class = options.class;
		this._layers = options.layers || null;
		this._maps = options.maps || null;
		this._style = options.style || null;

		this.build();
	};

	/**
	 * Build tools container
	 */
	LayerTools.prototype.build = function(){
		$(this._target).append('<div id="layer-tool-box-' + this._id +'" class="layer-tools"></div>');
		this._toolsContainer = $('#layer-tool-box-' + this._id);

		this.addMetadataIconOnClickListener();
	};

	LayerTools.prototype.clear = function(){
		this._toolsContainer.html('');
	};

	/**
	 * Return tools container
	 * @returns {*|jQuery|HTMLElement}
	 */
	LayerTools.prototype.getContainer = function(){
		return this._toolsContainer;
	};

	/**
	 * Build legend for layer
	 * @param maps {Array} List of WorldWindMaps
	 * @param layerMetadata {Object}
	 * @returns {Legend}
	 */
	LayerTools.prototype.addLegend = function(layerMetadata, maps){
		return new Legend({
			active: false,
			class: this._class,
			name: layerMetadata.name,
			layerMetadata: layerMetadata,
			target: this._toolsContainer,
			maps: maps
		});
	};

	/**
	 * Build opacity tool for layer
	 * @param maps {Array} List of WorldWindMaps
	 * @param layerMetadata {Object}
	 * @returns {Opacity}
	 */
	LayerTools.prototype.addOpacity = function(layerMetadata, maps){
		return new Opacity({
			active: false,
			class: this._class,
			name: layerMetadata.name,
			layerMetadata: layerMetadata,
			target: this._toolsContainer,
			maps: maps
		});
	};

	/**
	 * NEW! Build legend for layers
	 * @returns {LayerLegend}
	 */
	LayerTools.prototype.buildLegend = function(){
		return new LayerLegend({
			id: this._id,
			name: this._name,
			class: this._class,
			target: this._toolsContainer,
			layers: this._layers,
			style: this._style
		});
	};

	/**
	 * NEW! Build opacity control for layers
	 * @returns {LayerOpacity}
	 */
	LayerTools.prototype.buildOpacity = function(){
		return new LayerOpacity({
			id: this._id,
			name: this._name,
			class: this._class,
			target: this._toolsContainer,
			layers: this._layers,
			maps: this._maps,
			style: this._style
		});
	};

	/**
	 * Add metadata icon to tool box
	 * @param data {Object}
	 */
	LayerTools.prototype.addMetadataIcon = function(data){
		this._toolsContainer.append('<div title="Metadata" class="layer-tool-icon metadata-icon" data-for="' + data.id + '">' +
				'<img src="__new/img/info.png"/>' +
			'</div>');
	};

	/**
	 * Show window with metadata info on Metadata icon click
	 */
	LayerTools.prototype.addMetadataIconOnClickListener = function(){
		this._toolsContainer.on("click", ".metadata-icon", function(){
			var dataId = $(this).attr("data-for");
			$("#window-layerpanel").find("td[data-for=" + dataId + "] .x-tree-icon-leaf").trigger("click");
		});
	};

	return LayerTools;
});
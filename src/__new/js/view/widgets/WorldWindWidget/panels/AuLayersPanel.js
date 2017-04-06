define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../util/RemoteJQ',
	'./ThematicLayersPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Remote,
			ThematicLayersPanel,

			$,
			S
){
	/**
	 * Class representing AU Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var AuLayersPanel = function(options){
		ThematicLayersPanel.apply(this, arguments);

		this._outlines = {};
	};

	AuLayersPanel.prototype = Object.create(ThematicLayersPanel.prototype);

	AuLayersPanel.prototype.addListeners = function(){
		Stores.listeners.push(this.rebuildContent.bind(this, "updateOutlines"));
	};

	AuLayersPanel.prototype.rebuild = function(changes){
		this._changes = changes;
	};

	/**
	 * Rebuild AU layers panel.
	 * @param action
	 * @param notification
	 */
	AuLayersPanel.prototype.rebuildContent = function(action, notification){
		if (action == notification && notification == "updateOutlines"){
			if (!this._changes || this._changes.scope || this._changes.theme || this._changes.visualization){
				this.rebuildLayerControl();
				this.redrawLayer();
			} else {
				this.redrawLayer();
			}
		}
	};

	/**
	 * Rebuild layer control
	 */
	AuLayersPanel.prototype.rebuildLayerControl = function(){
		this.clear();

		var layer = {
			id: "analytical-units",
			name: "Area outlines",
			opacity: 70
		};

		this._outlines.layerData = layer;
		this._outlines.control = this.addLayerControl(layer.id, layer.name, this._panelBodySelector, true);
	};

	/**
	 * Redraw layer
	 */
	AuLayersPanel.prototype.redrawLayer = function(){
		this.clearLayers();
		this._outlines.layerData.layer = Stores.outlines.layerNames;
		this._outlines.layerData.sldId = Stores.outlines.sldId;

		this._worldWind.layers.addChoroplethLayer(this._outlines.layerData, this._id, false);

		var toolBox = this._outlines.control.getToolBox();
		toolBox.clear();
		toolBox.addOpacity(this._outlines.layerData, this._worldWind);
		this.checkIfLayerIsSwitchedOn(this._outlines.layerData.id);
	};

	/**
	 * Add content to panel
	 */
	AuLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	return AuLayersPanel;
});
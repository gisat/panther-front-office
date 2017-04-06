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

		this._layers = {
			outlines: {},
			selected: {}
		};
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
				this.clear();

				if(Stores.outlines){
					this.rebuildOutlinesControl();
					this.redrawOutlines();
				}

				if(Stores.selectedOutlines) {
					this.rebuildSelectedControl();
					this.redrawSelected();
				}
			} else {
				this.clearLayers();
				this.redrawOutlines();
				this.redrawSelected();
			}
		}
	};

	/**
	 * Rebuild outlines control
	 */
	AuLayersPanel.prototype.rebuildOutlinesControl = function(){
		var outlines = {
			id: "analytical-units",
			name: "Area outlines",
			opacity: 70
		};

		this._layers.outlines.layerData = outlines;
		this._layers.outlines.control = this.addLayerControl(outlines.id, outlines.name, this._panelBodySelector, true);
	};

	/**
	 * Rebuild selected control
	 */
	AuLayersPanel.prototype.rebuildSelectedControl = function(){
		var selected = {
			id: "selected-areas-filled",
			name: "Selected areas filled",
			opacity: 70
		};

		this._layers.selected.layerData = selected;
		this._layers.selected.control = this.addLayerControl(selected.id, selected.name, this._panelBodySelector, true);
	};

	/**
	 * Redraw layer
	 */
	AuLayersPanel.prototype.redrawOutlines = function(){
		this._layers.outlines.layerData.layer = Stores.outlines.layerNames;
		this._layers.outlines.layerData.sldId = Stores.outlines.sldId;

		this._worldWind.layers.addChoroplethLayer(this._layers.outlines.layerData, this._id, false);

		var toolBox = this._layers.outlines.control.getToolBox();
		toolBox.clear();
		toolBox.addOpacity(this._layers.outlines.layerData, this._worldWind);
		this.checkIfLayerIsSwitchedOn(this._layers.outlines.layerData.id);
	};

	/**
	 * Redraw selected
	 */
	AuLayersPanel.prototype.redrawSelected = function(){
		this._layers.selected.layerData.layer = Stores.selectedOutlines.layerNames;
		this._layers.selected.layerData.sldId = Stores.selectedOutlines.sldId;

		this._worldWind.layers.addChoroplethLayer(this._layers.selected.layerData, this._id, false);

		var toolBox = this._layers.selected.control.getToolBox();
		toolBox.clear();
		toolBox.addOpacity(this._layers.selected.layerData, this._worldWind);
		this.checkIfLayerIsSwitchedOn(this._layers.selected.layerData.id);
	};

	/**
	 * Add content to panel
	 */
	AuLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	return AuLayersPanel;
});
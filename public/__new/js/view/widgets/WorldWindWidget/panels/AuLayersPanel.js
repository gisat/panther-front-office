define([
	'../../../../actions/Actions',
	'../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../util/RemoteJQ',
	'./ThematicLayersPanel',

	'jquery',
	'string',
	'underscore'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Remote,
			ThematicLayersPanel,

			$,
			S,
			_
){
	/**
	 * Class representing AU Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var AuLayersPanel = function(options){
		ThematicLayersPanel.apply(this, arguments);

		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'AuLayersPanel', 'constructor', 'Stores must be provided'));
		}
		if(!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'AuLayersPanel', 'constructor', 'Store state must be provided'));
		}

		this._layers = {
			outlines: {},
			selected: {}
		};
		this._layersControls = [];
		this._stateStore = options.store.state;
	};

	AuLayersPanel.prototype = Object.create(ThematicLayersPanel.prototype);

	AuLayersPanel.prototype.addListeners = function(){
		window.Stores.addListener(this.onEvent.bind(this));
	};

	/**
	 * Clear whole selection
	 */
	AuLayersPanel.prototype.clearAllSelections = function(action, notification){
		$("#selectedareasfilled-panel-row").remove();
		this.clearLayers("selectedareasfilled");
		Stores.selectedOutlines = null;
		var control = _.find(this._layersControls, function(control){return control._id == "selectedareasfilled"});
		control._toolBox.hide();
	};

	/**
	 * Clear active selection
	 */
	AuLayersPanel.prototype.clearActiveSelection = function(){
		this.redrawLayer(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines);

	};

	AuLayersPanel.prototype.switchOnOutlines = function(){
		this.redrawLayer(this._layers.outlines, "areaoutlines", Stores.outlines);
		this.switchOnActiveLayers("areaoutlines", this._layers.outlines);
	};

	AuLayersPanel.prototype.switchOnSelected = function(){
		this.redrawSelectedLayer(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines);
		this.switchOnActiveLayers("selectedareasfilled", this._layers.selected);
	};

	AuLayersPanel.prototype.switchOnActiveLayers = function(groupId, layer){
		if (layer.layerData.id == groupId){
			var checkbox = $(".checkbox-row[data-id=" + layer.layerData.id +"]");
			checkbox.addClass("checked");
			this._mapStore.getAll().forEach(function(map){
				map.layers.showLayer(layer.layerData.id, 0);
			});
		}
	};

	/**
	 * Rebuild AU layers panel.
	 */
	AuLayersPanel.prototype.rebuild = function(){
		this.clear(this._id);
		this._layersControls = [];

		if(Stores.selectedOutlines) {
			this.rebuildControl(polyglot.t("selectedAreasFilled"), this._layers.selected, "selectedareasfilled");
			this.switchOnSelected();
		}

		if(Stores.outlines){
			this.rebuildControl(polyglot.t("areaOutlines"), this._layers.outlines, "areaoutlines");
			this._layers.outlines.additionalData = Stores.outlines.data;
			this.switchOnOutlines();
		}
	};

	/**
	 * Rebuild layer control
	 * @param name {string} name of the layer
	 * @param layer {Object} layer data
	 * @param id {string} id of the group
	 */
	AuLayersPanel.prototype.rebuildControl = function(name, layer, id){
		var selected = {
			id: id,
			name: name,
			opacity: 70
		};

		layer.layerData = selected;
		layer.control = this.addLayerControl(selected.id, selected.name, this._panelBodySelector, false);
		this._layersControls.push(layer.control);
	};

	/**
	 * Redraw layer
	 * @param layer {Object} layer data
	 * @param id {string} id of the group
	 * @param store {Object} store with data from 2D
	 */
	AuLayersPanel.prototype.redrawLayer = function(layer, id, store){
		this.clearLayers(id);
		if (!_.isEmpty(layer)){
			layer.layerData.layer = store.layerNames;
			layer.layerData.sldId = store.sldId;
			layer.layerData.data = store.data;

			this._mapStore.getAll().forEach(function(map){
				map.layers.addAULayer(layer.layerData, id, false);
			});

			var toolBox = layer.control.getToolBox();
			toolBox.clear();
			toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
		}
	};

	/**
	 * Redraw selected layer
	 * @param layer {Object} layer data
	 * @param id {string} id of the group
	 * @param store {Object} store with data from 2D
	 */
	AuLayersPanel.prototype.redrawSelectedLayer = function(layer, id, store){
		this.clearLayers(id);
		if (!_.isEmpty(layer)){
			layer.layerData.layer = store.layerNames;
			layer.layerData.sldId = store.sldId;

			this._mapStore.getAll().forEach(function(map){
				map.layers.addChoroplethLayer(layer.layerData, id, false);
			});

			var toolBox = layer.control.getToolBox();
			toolBox.clear();
			toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
		}
	};

	/**
	 * @param type {string}
	 */
	AuLayersPanel.prototype.onEvent = function(type){
		var scope = this._stateStore.current().scopeFull;
		var isAvailable = true;
		if (scope && scope.layersWidgetHiddenPanels){
			var auPanel = _.find(scope.layersWidgetHiddenPanels, function(panel){return panel === 'analytical-units'});
			if (auPanel){
				isAvailable = false;
			}
		}
		if (type === "updateOutlines" && isAvailable){
			this.rebuild();
		} else if (type === Actions.selectionEverythingCleared){
			this.clearAllSelections();
		} else if (type === Actions.selectionActiveCleared){
			this.clearActiveSelection()
		}
	};

	return AuLayersPanel;
});
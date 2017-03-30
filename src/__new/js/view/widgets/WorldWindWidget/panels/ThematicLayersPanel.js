define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./WorldWindWidgetPanel',
	'../../../worldWind/layers/layerTools/legend/Legend',
	'../../../worldWind/layers/layerTools/opacity/Opacity',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			WorldWindWidgetPanel,
			Legend,
			Opacity,

			$,
			S
){
	/**
	 * Class representing Thematic Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var ThematicLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
		Stores.listeners.push(this.rebuild.bind(this, "choropleths"));
		Stores.listeners.push(this.updateChoropleths.bind(this, "updateChoropleths"));

		this._choropleths = [];
	};

	ThematicLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add checkboxes for current configuration
	 * @param action {string}
	 * @param notification {string}
	 */
	ThematicLayersPanel.prototype.rebuild = function(action, notification){
		if (action == notification){
			this.clear();
			this._choropleths = Stores.choropleths;
			if (this._choropleths.length > 0){
				var self = this;
				this._choropleths.forEach(function(choropleth){
					var name = choropleth.name;
					if (name.length == 0){
						name = choropleth.attrName + " - " + choropleth.asName;
					}
					var layer = {
						id: "choropleth-" + choropleth.as + "-" + choropleth.attr,
						name: name
					};
					choropleth.layer = layer;
					self.addRow(layer, self._panelBodySelector, self._worldWind);
				});
				this.displayPanel("block");
			} else {
				this.displayPanel("none");
			}
		}
	};

	/**
	 * Update data about choropleth layers
	 * @param action
	 * @param notification
	 */
	ThematicLayersPanel.prototype.updateChoropleths = function(action, notification){
		var self = this;
		if (action == notification){
			this._worldWind.layers.removeAllLayersFromGroup(this._id);
			// it removes all floaters connected with this panel
			$("." + this._id + "-floater").remove();

			this._choropleths.forEach(function(choropleth){
				if (choropleth.hasOwnProperty("data")){
					var layer = {
						id: choropleth.layer.id,
						name: choropleth.layer.name,
						layer: choropleth.data.legendLayer,
						sldId: choropleth.data.sldId,
						path: choropleth.data.legendLayer

					};
					self._worldWind.layers.addChoroplethLayer(layer, self._id, false);

					var toolsContainer = $("#layer-tool-box-" + layer.id);
					toolsContainer.html('');
					self.addLegend(layer, self._worldWind, toolsContainer);
					self.addOpacity(layer, self._worldWind, toolsContainer);
				}
			});
		}
	};

	ThematicLayersPanel.prototype.addTools = function(tools, layerMetadata, worldWind){
		// do nothing in this case
	};

	ThematicLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	/**
	 * Add listeners
	 */
	ThematicLayersPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Hide/show layers
	 */
	ThematicLayersPanel.prototype.toggleLayer = function(event){
		var self = this;
		setTimeout(function(){
			var checkbox = $(event.currentTarget);
			var layerId = checkbox.attr("data-id");
			if (checkbox.hasClass("checked")){
				self._worldWind.layers.showLayer(layerId);
			} else {
				self._worldWind.layers.hideLayer(layerId);
			}
		},50);
	};

	/**
	 * Build legend for layer
	 * @param worldWind {WorldWindMap}
	 * @param layerMetadata {Object}
	 * @param target {JQuery}
	 * @returns {Legend}
	 */
	ThematicLayersPanel.prototype.addLegend = function(layerMetadata, worldWind, target){
		return new Legend({
			active: false,
			class: this._id,
			name: layerMetadata.name,
			layerMetadata: layerMetadata,
			target: target,
			worldWind: worldWind
		});
	};

	/**
	 * Build opacity tool for layer
	 * @param worldWind {WorldWindMap}
	 * @param layerMetadata {Object}
	 * @param target {JQuery}
	 * @returns {Opacity}
	 */
	ThematicLayersPanel.prototype.addOpacity = function(layerMetadata, worldWind, target){
		return new Opacity({
			active: false,
			class: this._id,
			name: layerMetadata.name,
			layerMetadata: layerMetadata,
			worldWind: worldWind,
			target: target
		});
	};

	return ThematicLayersPanel;
});
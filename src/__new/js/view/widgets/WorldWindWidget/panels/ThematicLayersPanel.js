define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			WorldWindWidgetPanel,

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

	ThematicLayersPanel.prototype.rebuild = function(action, notification){
		if (action == notification){
			this.clear();
			this._choropleths = Stores.choropleths;
			if (this._choropleths.length > 0){
				var self = this;
				this._choropleths.forEach(function(choropleth){
					var layer = {
						id: "choropleth-" + choropleth.as + "-" + choropleth.attr,
						name: choropleth.attrName + " - " + choropleth.asName
					};
					choropleth.layer = layer;
					self.addRowToPanel(layer, self._worldWind);
				});
				this.displayPanel("block");
			} else {
				this.displayPanel("none");
			}
		}
	};

	ThematicLayersPanel.prototype.updateChoropleths = function(action, notification){
		var self = this;

		if (action == notification){
			this._worldWind.layers.removeAllLayersFromGroup(this._id);
			this._choropleths.forEach(function(choropleth){
				var layer = {
					id: choropleth.layer.id,
					name: choropleth.layer.name,
					layer: choropleth.data.legendLayer,
					sldId: choropleth.data.sldId

				};
				self._worldWind.layers.addChoroplethLayer(layer, self._id, false);
			});
		}
	};

	/**
	 * Add tools for the layer
	 * @param tools {LayerTools}
	 * @param layerMetadata {Object}
	 * @param worldWind {WorldWindMap}
	 */
	ThematicLayersPanel.prototype.addTools = function(tools, layerMetadata, worldWind){
		tools.addOpacity(layerMetadata, worldWind);
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
				setTimeout(function(){
					console.log(self._worldWind);
				},300);
			} else {
				self._worldWind.layers.hideLayer(layerId);
			}
		},50);
	};

	return ThematicLayersPanel;
});
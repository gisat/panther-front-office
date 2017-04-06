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
		this.addListeners();

		this._choropleths = [];
	};

	ThematicLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	ThematicLayersPanel.prototype.addListeners = function(){
		Stores.listeners.push(this.rebuild.bind(this, "choropleths"));
		Stores.listeners.push(this.updateChoropleths.bind(this, "updateChoropleths"));
	};

	/**
	 * Add checkboxes for current configuration
	 * @param action {string}
	 * @param notification {string}
	 */
	ThematicLayersPanel.prototype.rebuild = function(action, notification){
		if (action == notification && notification == "choropleths"){
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
					choropleth.control = self.addLayerControl(layer.id, layer.name, self._panelBodySelector);
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
		if (action == notification && notification == "updateChoropleths"){
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
						path: choropleth.data.legendLayer,
						opacity: 70
					};
					self._worldWind.layers.addChoroplethLayer(layer, self._id, false);

					var toolsContainer = $("#layer-tool-box-" + layer.id);
					toolsContainer.html('');
					var toolBox = choropleth.control.getToolBox();
					toolBox.addLegend(layer, self._worldWind);
					toolBox.addOpacity(layer, self._worldWind);
					self.checkIfLayerIsSwitchedOn(layer.id);
				}
			});
		}
	};

	/**
	 * If checbox for particular layer is checked, show the layer
	 * @param layerId {string} id of the layer
	 */
	ThematicLayersPanel.prototype.checkIfLayerIsSwitchedOn = function(layerId){
		var checkbox = $(".checkbox-row[data-id=" + layerId +"]");
		if (checkbox.hasClass("checked")){
			this._worldWind.layers.showLayer(layerId);
		}
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

	return ThematicLayersPanel;
});
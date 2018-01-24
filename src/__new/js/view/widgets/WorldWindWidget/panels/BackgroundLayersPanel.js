define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Background Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var BackgroundLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);

		this.layerControls = [];
        this.rebuild();

        var self = this;
        Observer.addListener('scopeChange', function(){
        	self.rebuild();
		});
	};

	BackgroundLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

    BackgroundLayersPanel.prototype.rebuild = function() {
        var scope = Stores.retrieve("state").current().scopeFull;
        this.addLayerControls(scope);
        this.addEventsListeners();
		this.toggleLayers();
    };

	/**
	 * Add control for background layers
	 */
	BackgroundLayersPanel.prototype.addLayerControls = function(scope){
		var disabledLayers = (scope && scope['disabledLayers']) || {};
		var activeBackgroundMap = (scope && scope['activeBackgroundMap']) || this.getValidBackground(disabledLayers);

		this.toggleLayerWithControl('osm', 'openStreetMap', disabledLayers, activeBackgroundMap);
		this.toggleLayerWithControl('cartoDb', 'cartoDbBasemap', disabledLayers, activeBackgroundMap);
		this.toggleLayerWithControl('bingAerial', 'bingAerial', disabledLayers, activeBackgroundMap);
		this.toggleLayerWithControl('landsat', 'blueMarble', disabledLayers, activeBackgroundMap);
	};

	BackgroundLayersPanel.prototype.toggleLayerWithControl = function(id, name, disabledLayers, activeBackgroundMap) {
		if(this.containsLayerWithId(this.layerControls, id)) {
			// Decide whether to remove
			if(disabledLayers[id]) {
				this.removeLayerWithControl(this.layerControls, id);
			}
		} else {
			// Decide whether to add
			if(!disabledLayers[id]) {
				this.layerControls.push({
					id: id,
					control: this.addRadio(this._id + "-" + id, polyglot.t(name), this._panelBodySelector, id, activeBackgroundMap === id)
				});
			}
		}
	};

	BackgroundLayersPanel.prototype.removeLayerWithControl = function(layers, id) {
		layers.forEach(function(layer, index){
			if(layer.id === id) {
				this._mapStore.getAll().forEach(function(map){
					map.layers.removeLayer(map.layers.getLayerById(id), false);
				});
				// Remove the control for the layer.
				$('#' +  layer.control._id).remove();
				layers.splice(index, 1);
			}
		}.bind(this));
	};

	BackgroundLayersPanel.prototype.getValidBackground = function(disabledLayers) {
		var activeBackgroundMapPriorities = ['osm', 'cartoDb', 'bingAerial', 'landsat'];
		var result = null;

		activeBackgroundMapPriorities.forEach(function(id){
			if(!result && !disabledLayers[id]) {
				result = id;
			}
		});
		return result;
	};

	BackgroundLayersPanel.prototype.containsLayerWithId = function(layerControls, id) {
		return layerControls.filter(function(control){
			return control.id === id;
		}).length > 0;
	};

    /**
     * Remove all layers from specific group from map and all floaters connected with this group
     */
    BackgroundLayersPanel.prototype.clearLayers = function(group){
        $("." + group + "-floater").remove();

        this._mapStore.getAll().forEach(function(map){
            map.layers.removeAllLayersFromGroup(group, false);
        });

        if (group === "selectedareasfilled" || group === "areaoutlines"){
            this._panelBodySelector.find(".layer-row[data-id=" + group + "]").removeClass("checked");
        } else {
            this._panelBodySelector.find(".layer-row").removeClass("checked");
        }
    };

	/**
	 * Add background layers to a map
	 * @param map {WorldWindMap}
	 */
	BackgroundLayersPanel.prototype.addLayersToMap = function(map){
		this.layerControls.forEach(function(control){
			map.layers.addBackgroundLayer(control.id, this._id);
		});
		this.toggleLayers();
	};

	/**
	 * Add listeners to controls
	 */
	BackgroundLayersPanel.prototype.addEventsListeners = function(){
		this.addRadioOnClickListener();
	};

	/**
	 * Hide all background layers and show only the selected one
	 */
	BackgroundLayersPanel.prototype.toggleLayers = function(){
		var self = this;
		setTimeout(function(){
			self.layerControls.forEach(function(item, index){
				var radio = item.control.getRadiobox();
				var dataId = radio.attr("data-id");
				if (radio.hasClass("checked")){
					self._mapStore.getAll().forEach(function(map){
						map.layers.showBackgroundLayer(dataId);
					});
				} else {
					self._mapStore.getAll().forEach(function(map){
						map.layers.hideBackgroundLayer(dataId);
					});
				}
			});
		},50);
	};

	return BackgroundLayersPanel;
});
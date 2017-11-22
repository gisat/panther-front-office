define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../worldwind/layers/MyOsmLayer',
	'../../../worldwind/layers/MyWmsLayer',
	'../../../worldwind/SelectionController',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			MyOsmLayer,
			MyWmsLayer,
			SelectionController,

			$
){
	/**
	 * This class is intended for operations with layers
	 * @param wwd {WorldWindow}
	 * @constructor
	 */
	var Layers = function(wwd){
		if (!wwd){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Layers", "constructor", "missingWorldWind"));
		}
		this._wwd = wwd;
		this._layers = [];

		/**
		 * It handles selection in the map based on the user interactions.
		 * @type {SelectionController}
		 */
		this.controller = new SelectionController(wwd);
	};

	/**
	 * Add layer to the list of layers
	 * @param layer {WorldWind.Layer}
	 */
	Layers.prototype.addLayer = function(layer){
		this._layers.push(layer);
		if (layer.hasOwnProperty("metadata") && layer.metadata.active){
			this.addLayerToMap(layer);
		}
	};

	/**
	 * Add layer to the map
	 * @param layer {WorldWind.Layer}
	 * @param order {number} order of the layer among other layers
	 */
	Layers.prototype.addLayerToMap = function(layer, order){
		var position = this.findLayerZposition(order, layer);
		this._wwd.insertLayer(position, layer);
		this._wwd.redraw();
	};

	/**
	 * TODO: Figure how do you handle the layers from other areas and panels. At the moment, the ordered layers will be on the bottom.
	 * @param order {Number} order in 2D
	 * @param currentLayer {WorldWind.Layer} layer being inserted
	 * @returns {Number} position in world wind layers
	 */
	Layers.prototype.findLayerZposition = function(order, currentLayer){
		var layers = this._wwd.layers;
		var position = null;

		layers.forEach(function(layer, index){
			if(!layer.metadata.group) {
				position = index;
			}
		});
		// Find the first which has metadata.group
		// If there is no specific place to put the layer add it as last.
		if (currentLayer.metadata.order !== null && currentLayer.metadata.order < layers.length && !(currentLayer.metadata.group === "areaoutlines")){
			position = position += currentLayer.metadata.order;
		} else {
            position = layers.length;
		}

		// push layer just under AU layer
		if (!currentLayer.metadata || !currentLayer.metadata.group || !(currentLayer.metadata.group === "areaoutlines")){
			if (position > 0){
				position--;
			}
		}

		return position;
	};

	/**
	 * Get all layers from a group
	 * @param group {string} name of the group
	 * @returns {Array} list of layers
	 */
	Layers.prototype.getLayersByGroup = function(group){
		return _.filter(this._layers, function(layer){
			return layer.metadata.group == group; });
	};

	/**
	 * Get a layer by given id
	 * @param id {string} id of the layer
	 * @returns {WorldWind.Layer}
	 */
	Layers.prototype.getLayerById = function(id){
		return _.filter(this._layers, function(layer){
			return layer.metadata.id == id; })[0];
	};

	/**
	 * Remove layer from the list of layers
	 * @param layer {WorldWind.Layer}
	 */
	Layers.prototype.removeLayer = function(layer){
		this._layers = _.filter(this._layers, function(item) {
			return item.metadata.id !== layer.metadata.id;
		});
		this.removeLayerFromMap(layer);
	};

	/**
	 * Get AU layer, if it is present on map
	 * @returns {WorldWind.Layer}
	 */
	Layers.prototype.getAuLayer = function(){
		return _.filter(this._layers, function(item){
			return item.metadata.id === "areaoutlines";
		});
	};

	/**
	 * Remove layer from map
	 * @param layer {WorldWind.Layer}
	 */
	Layers.prototype.removeLayerFromMap = function(layer){
		this._wwd.removeLayer(layer);
		this._wwd.redraw();
	};

	/**
	 * Remove all layers from given group
	 * @param group {string} name of the group
	 */
	Layers.prototype.removeAllLayersFromGroup = function(group){
		var layers = this.getLayersByGroup(group);
		var self = this;
		layers.forEach(function(layer){
			self.removeLayer(layer);
		});
	};

	/**
	 * Show the layer in map
	 * @param id {string} Id of the layer
	 * @param order {number} order of the layer among other layers
	 */
	Layers.prototype.showLayer = function(id, order){
		var layer = this.getLayerById(id);
		layer.metadata.active = true;
		layer.metadata.order = order;
		this.addLayerToMap(layer, order);
	};

	/**
	 * Hide the layer from map
	 * @param id {string} Id of the layer
	 */
	Layers.prototype.hideLayer = function(id){
		var layer = this.getLayerById(id);
		layer.metadata.active = false;
		this.removeLayerFromMap(layer);
	};

	/**
	 * Show background layer
	 * @param id {string}
	 */
	Layers.prototype.showBackgroundLayer = function(id){
		var layer = this.getLayerById(id);
		layer.enabled = true;
		this._wwd.redraw();
	};

	/**
	 * Hide background layer
	 * @param id {string}
	 */
	Layers.prototype.hideBackgroundLayer = function(id){
		var layer = this.getLayerById(id);
		layer.enabled = false;
		this._wwd.redraw();
	};

	/**
	 * Create base layer according to id and add it to the map.
	 * @param id {string}
	 * @param group {string} name of the group
	 */
	Layers.prototype.addBackgroundLayer = function(id, group){
		var layer;
		switch (id){
			case "bingRoads":
				layer = new WorldWind.BingRoadsLayer();
				break;
			case "bingAerial":
				layer = new WorldWind.BingAerialLayer();
				break;
			case "osm":
				layer = new MyOsmLayer({
					attribution: "\u00A9 OpenStreetMap contributors",
					source: "http://a.tile.openstreetmap.org/"
				});
				break;
			case "cartoDb":
				layer = new MyOsmLayer({
					attribution: "\u00A9 Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL",
					source: "http://a.basemaps.cartocdn.com/light_all/"});
				break;
			case "landsat":
				layer = new WorldWind.BMNGLandsatLayer();
				break;
		}
		layer.metadata = {
			active: true,
			id: id,
			group: group
		};
		this.addLayer(layer);
	};

	/**
	 * Add WMS layer to the list of layers
	 * @param layerData {Object} info about layer retrieved from server
	 * @param group {string} name of the group
	 * @param state {boolean} true, if the layer should be displayed
	 */
	Layers.prototype.addWmsLayer = function(layerData, group, state){
		var layer = new MyWmsLayer({
			service: layerData.url,
			layerNames: layerData.layerPaths,
			sector: new WorldWind.Sector(-90,90,-180,180),
			levelZeroDelta: new WorldWind.Location(45,45),
			numLevels: 14,
			format: "image/png",
			opacity: .9,
			size: 256,
			version: "1.1.1",
			customParams: layerData.customParams
		}, null);
		layer.urlBuilder.version = "1.1.1";
		layer.metadata = {
			active: state,
			name: layerData.name,
			id: layerData.id,
			group: group,
			order: layerData.order
		};
		this.addLayer(layer);
	};

	/**
	 * Add info layer to the list of layers
	 * @param layerData {Object}
	 * @param group {string} name of the group
	 * @param state {boolean} true, if the layer should be displayed
	 */
	Layers.prototype.addInfoLayer = function(layerData, group, state){
		var layer = new MyWmsLayer({
			service: Config.url + "api/proxy/wms",
			layerNames: layerData.layerPaths,
			sector: new WorldWind.Sector(-90,90,-180,180),
			levelZeroDelta: new WorldWind.Location(45,45),
			opacity: .7,
			numLevels: 22,
			format: "image/png",
			size: 256,
			styleNames: layerData.stylePaths
		}, null);
		layer.urlBuilder.wmsVersion = "1.3.0";
		layer.metadata = {
			active: state,
			id: layerData.id,
			name: layerData.name,
			group: group
		};
		this.addLayer(layer);
	};

	/**
	 * Add choropleth layer to the list of layers
	 * @param layerData {Object} info about layer retrieved from server
	 * @param group {string} name of the group
	 * @param state {boolean} true, if the layer should be displayed
	 */
	Layers.prototype.addChoroplethLayer = function(layerData, group, state){
		var layer = new MyWmsLayer({
			service: Config.url + "api/proxy/wms",
			sector: new WorldWind.Sector(-90,90,-180,180),
			layerNames: layerData.layer,
			levelZeroDelta: new WorldWind.Location(45,45),
			numLevels: 22,
			opacity: layerData.opacity/100,
			format: "image/png",
			size: 256,
			sldId: layerData.sldId
		}, null);
		layer.urlBuilder.wmsVersion = "1.3.0";
		layer.metadata = {
			active: state,
			id: layerData.id,
			name: layerData.name,
			group: group,
			sldId: layerData.sldId
		};
		this.addLayer(layer);
	};

    /**
	 * Add analytical units layer to the list of layers.
     * @param layerData {Object} info about layer retrieved from server
     * @param group {string} name of the group
     * @param state {boolean} true, if the layer should be displayed
     */
    Layers.prototype.addAULayer = function(layerData, group, state){
    	var layerNames = layerData.data.namedLayers.map(function(layer){
    		return layer.name;
		}).join(',');
        var layer = new MyWmsLayer({
            service: Config.geoServerUrl,
            sector: new WorldWind.Sector(-90,90,-180,180),
            layerNames: layerNames,
            levelZeroDelta: new WorldWind.Location(45,45),
            numLevels: 22,
            opacity: layerData.opacity/100,
            format: "image/png",
            size: 256,
			styleNames: 'outlines',
			version: "1.1.0"
        }, null);
        layer.urlBuilder.wmsVersion = "1.1.0";
        layer.metadata = {
            active: state,
            id: layerData.id,
            name: layerData.name,
            group: group,
			style: 'outlines'
        };
        this.addLayer(layer);
    };

	return Layers;
});
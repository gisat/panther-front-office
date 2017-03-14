define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./layers/AnalyticalUnitsLayer',
		'./layers/Layers',
		'./layers/MapDiagramsLayer',
		'./MyGoToAnimator',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AnalyticalUnitsLayer,
			Layers,
			MapDiagramsLayer,
			MyGoToAnimator,

			$
){
	/**
	 * Class World Wind Map
	 * @param options {Object}
	 * @constructor
	 */
	var WorldWindMap = function(options){
		this.buildContainer();
		this.setupWebWorldWind();
	};


	/**
	 * Rebuild world wind map
	 * @param config {Object} ThemeYearsConfParams global object
	 * @param widget {JQuery} JQuery widget selector
	 */
	WorldWindMap.prototype.rebuild = function(config, widget){
		this._goToAnimator.setLocation(config, widget)
	};

	/**
	 * It builds Web World Wind container
	 */
	WorldWindMap.prototype.buildContainer = function(){
		$("#main").append('<div id="world-wind-container">' +
				'<div id="world-wind-map">' +
					'<canvas id="world-wind-canvas">' +
						'Your browser does not support HTML5 Canvas.' +
					'</canvas>' +
				'</div>' +
				'<div id="widgets3d-placeholders-container">' +
				'</div>' +
			'</div>');
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();
		this._goToAnimator = new MyGoToAnimator(this._wwd);
		this.layers = new Layers();
	};

	/**
	 * Add layer to the list of layers
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.addLayer = function(layer){
		this.layers.addLayer(layer);
		if (layer.hasOwnProperty("metadata") && layer.metadata.active){
			this.addLayerToMap(layer);
		}
	};

	/**
	 * Add layer to the map
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.addLayerToMap = function(layer){
		this._wwd.addLayer(layer);
		this.redraw();
	};

	/**
	 * Show layer in map
	 * @param id {string} Id of the layer
	 */
	WorldWindMap.prototype.showLayer = function(id){
		this.layers.activateLayer(id);
		var layer = this.layers.getLayerById(id);
		this.addLayerToMap(layer);
	};

	/**
	 * Hide the layer from map
	 * @param id {string} Id of the layer
	 */
	WorldWindMap.prototype.hideLayer = function(id){
		this.layers.deactivateLayer(id);
		var layer = this.layers.getLayerById(id);
		this.removeLayerFromMap(layer);
	};

	/**
	 * Remove layer from the list of layers
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.removeLayer = function(layer){
		this.layers.removeLayer(layer.metadata.id);
		this.removeLayerFromMap(layer);
	};

	/**
	 * Remove layer from map
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.removeLayerFromMap = function(layer){
		this._wwd.removeLayer(layer);
		this.redraw();
	};

	/**
	 * Remove all layers from given group
	 * @param group {string} name of the group
	 */
	WorldWindMap.prototype.removeAllLayersFromGroup = function(group){
		var layers = this.layers.getLayersByGroup(group);
		var self = this;
		layers.forEach(function(layer){
			self.removeLayer(layer);
		});
	};

	/**
	 * Get layer by ID
	 * @param id {string}
	 * @returns {WorldWind.Layer}
	 */
	WorldWindMap.prototype.getLayerById = function(id){
		return _.filter(this._wwd.layers, function(layer){
			return layer.metadata.id == id; })[0];
	};

	/**
	 * Show background layer
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.showBackgroundLayer = function(layer){
		layer.enabled = true;
		this.redraw();
	};

	/**
	 * Hide background layer
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.hideBackgroundLayer = function(layer){
		layer.enabled = false;
		this.redraw();
	};

	/**
	 * Build analytical units layer
	 * @param id {string}
	 * @returns {AnalyticalUnitsLayer}
	 */
	WorldWindMap.prototype.buildAuLayer = function(id){
		return new AnalyticalUnitsLayer({metadata: {active: true, id: id, group: "Analytical units"}});
	};

	/**
	 * Create base layer according to id and add it to the map.
	 * @param id {string}
	 */
	WorldWindMap.prototype.addBackgroundLayer = function(id){
		var layer;
		switch (id){
			case "bingRoads":
				layer = new WorldWind.BingRoadsLayer();
				break;
			case "bingAerial":
				layer = new WorldWind.BingAerialLayer();
				break;
			case "landsat":
				layer = new WorldWind.BMNGLandsatLayer();
				break;
		}
		layer.metadata = {
			active: true,
			id: id,
			group: "background"
		};
		this.addLayerToMap(layer);
	};

	/**
	 * Add WMS layer to the list of layers
	 * @param data {Object} wms metadata
	 * @param state {boolean} true, if the layer should be displayed
	 */
	WorldWindMap.prototype.addWmsLayer = function(data, state){
		var layer = new WorldWind.WmsLayer({
			service: data.url,
			layerNames: data.layer,
			sector: new WorldWind.Sector(40,60,10,20),
			levelZeroDelta: new WorldWind.Location(5,5),
			numLevels: 12,
			format: "img/png",
			size: 512
		}, null);
		layer.metadata = {
			active: state,
			id: "custom-wms-" + data.id,
			group: "customWms"
		};
		this.addLayer(layer);
	};

	/**
	 * Redraw map
	 */
	WorldWindMap.prototype.redraw = function(){
		this._wwd.redraw();
	};

	/**
	 * Build the World Wind Window
	 * @returns {WorldWind.WorldWindow}
	 */
	WorldWindMap.prototype.buildWorldWindow = function(){
		return new WorldWind.WorldWindow("world-wind-canvas");
	};

	/**
	 * It returns container for rendering of Web World Wind
	 * @returns {*}
	 */
	WorldWindMap.prototype.getContainer = function(){
		return $("#world-wind-container");
	};

	return WorldWindMap;
});
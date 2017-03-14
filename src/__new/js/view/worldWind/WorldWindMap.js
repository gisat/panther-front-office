define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./layers/AnalyticalUnitsLayer',
		'./layers/MapDiagramsLayer',
		'./MyGoToAnimator',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AnalyticalUnitsLayer,
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
	};

	/**
	 * Add layer to the map
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.addLayer = function(layer){
		this._wwd.addLayer(layer);
		this.redraw();
	};

	/**
	 * Remove layer from map
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.removeLayer = function(layer){
		this._wwd.removeLayer(layer);
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
	 * Show layer on the top of the globe
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.showLayer = function(layer){
		layer.enabled = true;
		this.redraw();
	};

	/**
	 * Show layer
	 * @param layer {WorldWind.Layer}
	 */
	WorldWindMap.prototype.hideLayer = function(layer){
		layer.enabled = false;
		this.redraw();
	};

	/**
	 * Build analztical units layer
	 * @param id {string}
	 * @returns {AnalyticalUnitsLayer}
	 */
	WorldWindMap.prototype.buildAuLayer = function(id){
		return new AnalyticalUnitsLayer({metadata: {id: id, group: "Analytical units"}});
	};

	/**
	 * Create base layer according to id and add it to the map
	 * @param id {string}
	 */
	WorldWindMap.prototype.addBaseLayer = function(id){
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
			id: id,
			group: "background"
		};
		this.addLayer(layer);
	};

	/**
	 * Add WMS layer to the map
	 * @param data {Object} wms metadata
	 */
	WorldWindMap.prototype.addWmsLayer = function(data){
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
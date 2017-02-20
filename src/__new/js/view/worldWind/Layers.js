define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'./layers/AnalyticalUnitsLayer',
	'./layers/MapDiagramsLayer',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AnalyticalUnitsLayer,
			MapDiagramsLayer,

			$
){
	/**
	 * Class for working with layers
	 * @param options {Object}
	 * @constructor
	 */
	var Layers = function(options){
		this._layers = {
			bingRoads: new WorldWind.BingRoadsLayer(),
			bingAerial: new WorldWind.BingAerialLayer(),
			landsat: new WorldWind.BMNGLandsatLayer(),
			analyticalUnits: new AnalyticalUnitsLayer({name: "Analytical units"}),
			mapDiagrams: new MapDiagramsLayer({name: "Map Diagrams"})
		};
	};

	/**
	 * Return layer
	 * @param id {string} id of the layer
	 * @returns {WorldWind.Layer}
	 */
	Layers.prototype.getLayerById = function(id){
		return this._layers[id];
	};

	return Layers;
});
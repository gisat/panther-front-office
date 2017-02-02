define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

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


	WorldWindMap.prototype.rebuild = function(location){
		console.log(location);
	};

	/**
	 * It builds Web World Wind container
	 */
	WorldWindMap.prototype.buildContainer = function(){
		$("#main").append('<div id="world-wind-container">' +
			'<canvas id="world-wind-canvas">' +
				'Your browser does not support HTML5 Canvas.' +
			'</canvas>' +
			'</div>');
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();

		// Add Blue Marble Layer
		this._wwd.addLayer(new WorldWind.BMNGLayer());
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
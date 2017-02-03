define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./MyGoToAnimator',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

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


	WorldWindMap.prototype.rebuild = function(config){
		this._goToAnimator.setLocation(config)
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
			'</div>');
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();
		this._goToAnimator = new MyGoToAnimator(this._wwd);

		// Add Blue Marble Layer
		//this._wwd.addLayer(new WorldWind.BMNGLayer());
		this._wwd.addLayer(new WorldWind.BingRoadsLayer());
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
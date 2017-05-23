define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./controls/Controls',
		'./layers/Layers',
		'./MyGoToAnimator',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Controls,
			Layers,
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
		$("#content").append('<div id="world-wind-container">' +
				'<div id="world-wind-map">' +
					'<canvas id="world-wind-canvas">' +
						'Your browser does not support HTML5 Canvas.' +
					'</canvas>' +
				'</div>' +
				'<div id="widgets3d-placeholders-container">' +
				'</div>' +
			'</div>');

		this._mapContainer = $("#world-wind-container");
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();
		this._goToAnimator = new MyGoToAnimator(this._wwd);

		this.buildControls();

		this.layers = new Layers(this._wwd);
	};

	/**
	 * Build the World Wind Window
	 * @returns {WorldWind.WorldWindow}
	 */
	WorldWindMap.prototype.buildWorldWindow = function(){
		return new WorldWind.WorldWindow("world-wind-canvas");
	};

	/**
	 * Build controls and setup interaction
	 */
	WorldWindMap.prototype.buildControls = function(){
		new Controls({
			mapContainer: this._mapContainer,
			worldWindow: this._wwd
		});
	};

	/**
	 * It returns container for rendering of Web World Wind
	 * @returns {*}
	 */
	WorldWindMap.prototype.getContainer = function(){
		return this._mapContainer;
	};

	/**
	 * Redraw the map
	 */
	WorldWindMap.prototype.redraw = function(){
		this._wwd.redraw();
	};

	return WorldWindMap;
});
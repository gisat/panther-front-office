define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',
		'js/stores/Stores',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Stores,

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
		this.setLocation(config)
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
		this._goToAnimator = new WorldWind.GoToAnimator(this._wwd);

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

	WorldWindMap.prototype.setLocation = function(config){
		var self = this;
		var place = config.place;
		// todo handle All places (if place "", then retrieve by dataset?)
		Stores.retrieve("location").byId(place).then(function(response){
			if (response.length > 0){
				self.goToLocation(response[0].bbox);
			}
		});
	};

	WorldWindMap.prototype.goToLocation = function(bbox){
		// todo move Location to separate class
		// todo get center from bbox
		// todo get distance from bbox
		this._goToAnimator.goTo(new WorldWind.Location(50,14));
	};

	return WorldWindMap;
});
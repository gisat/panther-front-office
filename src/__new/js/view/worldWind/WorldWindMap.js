define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./controls/Controls',
		'./layers/Layers',
		'../../worldwind/MyGoToAnimator',
		'../../stores/internal/VisibleLayersStore',
		'../../util/Uuid',

		'jquery',
		'worldwind',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Controls,
			Layers,
			MyGoToAnimator,
			VisibleLayersStore,
			Uuid,

			$
){
	/**
	 * Class World Wind Map
	 * @param options {Object}
	 * @param options.id {Number|null} Id distinguishing the map from the other ones.
	 * @param options.period {Number|null} Period associated with this map.
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @constructor
	 */
	var WorldWindMap = function(options){
		this.buildContainer();
		this.setupWebWorldWind();

		this._id = options.id || new Uuid().generate();

		/**
		 * Every map is associated with the period. If no period is specified, then it is supplied latest when the first
		 * state change containing period happens.
		 * @type {Number|null}
		 * @private
		 */
		this._period = options.period || null; // Accept all state changes unless the period is specified.

		/**
		 * Store containing selected layers. It is responsible for adding newly selected layers and removing the
		 * unselected ones.
		 * It isn't actually used here. It is only created, but as the map can be destroyed, the store must be also
		 * destroyed.
		 * @type {SelectedLayersStore}
		 * @private
		 */
		this._selectedLayers = new VisibleLayersStore({
			dispatcher: options.dispatcher,
			id: this._id,
			map: this
		});
	};

	Object.defineProperties(WorldWindMap.prototype, {
		/**
		 * Unique identifier of the map.
		 * @memberOf WorldWindMap.prototype
		 * @type {String}
		 */
		id: {
			get: function() {
				return this._id;
			}
		},

		/**
		 * Period associated with given map.
		 * @memberOf WorldWindMap.prototype
		 * @type {Number}
		 */
		period: {
			get: function() {
				return this._period;
			},
			set: function(period) {
				this._period = period;
			}
		},

		selectedLayers: {
			get: function() {
				return this._selectedLayers;
			}
		}
	});


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

	WorldWindMap.prototype.addLayer = function(layer) {
		this._wwd.addLayer(layer);
	};

	return WorldWindMap;
});
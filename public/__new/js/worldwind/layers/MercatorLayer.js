define([
	'./MyUrlBuilder',

	'worldwind'
], function (MyUrlBuilder) {
	var Location = WorldWind.Location;
	var MercatorTiledImageLayer = WorldWind.MercatorTiledImageLayer;
	var Sector = WorldWind.Sector;

	/**
	 * It accepts EPSG:3857 as crs.
	 * @constructor
	 */
	var MercatorLayer = function (options) {
		MercatorTiledImageLayer.call(this,
			new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, "image/png", "Mercator Layer",
			256, 256);

		this.sldId = options.sldId;
		this.customParams = options.customParams;

		if (this.sldId){
			this.cachePath = options.service + "/" + options.layerNames + "/" + this.sldId;
		}
		if (this.customParams){
			if (this.customParams.time){
				this.cachePath = options.service + "/" + options.layerNames + "/" + this.customParams.time;
			}
		}

		if (options.opacity){
			this.opacity = options.opacity;
		}
		this.urlBuilder = new MyUrlBuilder(
			options.service, options.layerNames, options.styleNames, options.version,
			options.timeString, this.sldId, options.customParams);

		// Specifics for the Mercator layer.
		this.imageSize = 256;

		// Create a canvas we can use when unprojecting retrieved images.
		this.destCanvas = document.createElement("canvas");
		this.destContext = this.destCanvas.getContext("2d");
	};

	MercatorLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

	// Determines the Bing map size for a specified level number.
	MercatorLayer.prototype.mapSizeForLevel = function (levelNumber) {
		return 256 << (levelNumber + 1);
	};

	return MercatorLayer;
});
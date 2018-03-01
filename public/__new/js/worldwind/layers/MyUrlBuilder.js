define([
	'worldwind'
], function(){
	var WmsUrlBuilder = WorldWind.WmsUrlBuilder;

	/**
	 * Class extending WorldWind.WmsLayer.
	 * @augments WorldWind.WmsLayer
	 * @constructor
	 */
	var MyUrlBuilder = function(serviceAddress, layerNames, styleNames, wmsVersion, timeString, sldId, customParams){
		WmsUrlBuilder.call(this, serviceAddress, layerNames, styleNames, wmsVersion, timeString);

		this.sldId = sldId;
		this.customParams = customParams;
	};

	MyUrlBuilder.prototype = Object.create(WmsUrlBuilder.prototype);

	MyUrlBuilder.prototype.urlForTile = function (tile, imageFormat) {
		if (!tile) {
			throw new ArgumentError(
				Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile", "missingTile"));
		}
		if (!imageFormat) {
			throw new ArgumentError(
				Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile",
					"The image format is null or undefined."));
		}
		var sector = tile.sector;
		var sb = WmsUrlBuilder.fixGetMapString(this.serviceAddress);
		if (sb.search(/service=wms/i) < 0) {
			sb = sb + "service=WMS";
		}
		sb = sb + "&request=GetMap";
		sb = sb + "&version=" + this.wmsVersion;
		sb = sb + "&transparent=" + (this.transparent ? "TRUE" : "FALSE");
		sb = sb + "&layers=" + this.layerNames;
		sb = sb + "&styles=" + this.styleNames;
		sb = sb + "&format=" + imageFormat;
		sb = sb + "&width=" + tile.tileWidth;
		sb = sb + "&height=" + tile.tileHeight;

		if (this.sldId){
			sb = sb + "&sld_id=" + this.sldId;
		}

		if (this.timeString) {
			sb = sb + "&time=" + this.timeString;
		}

		if (this.customParams){
			for (var key in this.customParams){
				sb = sb + "&" + key + "=" + this.customParams[key];
			}
		}

		if (this.isWms130OrGreater) {
			sb = sb + "&crs=" + this.crs;
			sb = sb + "&bbox=";
			if (this.crs === "CRS:84") {
				sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
				sb = sb + sector.maxLongitude+ "," + sector.maxLatitude;
			} else {
				sb = sb + sector.minLatitude + "," + sector.minLongitude + ",";
				sb = sb + sector.maxLatitude+ "," + sector.maxLongitude;
			}
		} else {
			sb = sb + "&srs=" + this.crs;
			sb = sb + "&bbox=";
			sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
			sb = sb + sector.maxLongitude+ "," + sector.maxLatitude;
		}
		sb = sb.replace(" ", "%20");
		return sb;
	};

	return MyUrlBuilder;
});
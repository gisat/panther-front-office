define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
	'../../util/RemoteJQ',

	'./MyUrlBuilder',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			MyUrlBuilder,

			$
){
	var WmsLayer = WorldWind.WmsLayer;

	/**
	 * Class extending WorldWind.WmsLayer.
	 * @param options {Object}
	 * @augments WorldWind.WmsLayer
	 * @constructor
	 */
	var MyWmsLayer = function(options){
		WmsLayer.call(this, options);

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
	};

	MyWmsLayer.prototype = Object.create(WmsLayer.prototype);

	/**
	 * Execute the WMS GetFeatureInfo request
	 * TODO working for EPSG:4326 only
	 * @param property {string} name of property to find
	 * @param coordinates {Object} point coordinates in lat, lon
	 * @param layers {string}
	 */
	MyWmsLayer.prototype.getFeatureInfo = function(property, coordinates, layers){
		var bottomLeft = (coordinates.lat - 0.01) + "," + (coordinates.lon - 0.01);
		var topRight = (coordinates.lat + 0.01) + "," + (coordinates.lon + 0.01);
		var bbox = bottomLeft + "," + topRight;

		return new RemoteJQ({
			url: "api/proxy/wms",
			params: {
				"SERVICE": "WMS",
				"VERSION": this.urlBuilder.wmsVersion,
				"REQUEST": "GetFeatureInfo",
				"LAYERS": layers,
				"QUERY_LAYERS": layers,
				"BBOX": bbox,
				"WIDTH": 2000,
				"HEIGHT": 2000,
				"CRS": this.urlBuilder.crs,
				"X": 1000,
				"Y": 1000,
				"PROPERTYNAME": property,
				"EXPECTJSON": true
			}
		}).get().then(function(results){
			var feature = null;
			if (results && results.features.length > 0){
				feature = results.features[0];
			}
			return feature;
		});
	};

	return MyWmsLayer;
});
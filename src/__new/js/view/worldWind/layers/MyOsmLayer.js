define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../MyUrlBuilder',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			MyUrlBuilder,

			$
){
	var OsmLayer = WorldWind.OpenStreetMapImageLayer;
	var MercatorLayer = WorldWind.MercatorTiledImageLayer;
	var Color = WorldWind.Color;

	/**
	 * Class extending WorldWind.WmsLayer.
	 * @param options {Object}
	 * @param options.source {string} source URL
	 * @param options.attribution {string}
	 * @augments WorldWind.OpenStreetMapImageLayer
	 * @constructor
	 */
	var MyOsmLayer = function(options){
		OsmLayer.call(this, options);

		if (!options.source){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyOsmLayer", "constructor", "missingSource"));
		}

		this._source = options.source;
		this._attribution = options.attribution;

		this.cachePath = options.source;
		this.detailControl = 0.8;

		var self = this;
		this.urlBuilder = {
			urlForTile: function (tile, imageFormat) {
				return self._source +
					(tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
			}
		};
	};

	MyOsmLayer.prototype = Object.create(OsmLayer.prototype);

	MyOsmLayer.prototype.doRender = function (dc) {
		MercatorLayer.prototype.doRender.call(this, dc);
		if (this.inCurrentFrame) {
			dc.screenCreditController.addStringCredit(this._attribution, Color.MEDIUM_GRAY);
		}
	};

	return MyOsmLayer;
});


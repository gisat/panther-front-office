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

	/**
	 * Class extending WorldWind.WmsLayer.
	 * @param options {Object}
	 * @param options.source {string} source URL
	 * @augments WorldWind.OpenStreetMapImageLayer
	 * @constructor
	 */
	var MyOsmLayer = function(options){
		OsmLayer.call(this, options);

		if (!options.source){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyOsmLayer", "constructor", "missingSource"));
		}

		this._source = options.source;

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

	return MyOsmLayer;
});


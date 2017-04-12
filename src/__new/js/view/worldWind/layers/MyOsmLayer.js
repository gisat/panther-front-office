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
	 * @augments WorldWind.WmsLayer
	 * @constructor
	 */
	var MyOsmLayer = function(options){
		OsmLayer.call(this, options);

		this.urlBuilder = {
			urlForTile: function (tile, imageFormat) {
				return "http://a.tile.openstreetmap.org/" +
					(tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
			}
		};
	};

	MyOsmLayer.prototype = Object.create(OsmLayer.prototype);

	return MyOsmLayer;
});


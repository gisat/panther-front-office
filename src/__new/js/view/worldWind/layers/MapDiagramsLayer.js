define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./MyRenderableLayer',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			MyRenderableLayer,

			$
){
	/**
	 * Class representing layer with map diagrams. It extends MyRenderableLayer.
	 * @param options {Object}
	 * @augments MyRenderableLayer
	 * @constructor
	 */
	var MapDiagramsLayer = function(options){
		MyRenderableLayer.apply(this, arguments);
	};

	MapDiagramsLayer.prototype = Object.create(MyRenderableLayer.prototype);

	/**
	 * Redraw layer
	 * @param attributes {Array} list of attributes and their statistics
	 * @param units {Array} list of analytical units with values of attributes
	 */
	MapDiagramsLayer.prototype.redraw = function(attributes, units){
		this.removeAllRenderables();
		debugger;
		//var features = this.prepareFeatures(data);
		//this.addRenderables(features);
	};

	return MapDiagramsLayer;
});
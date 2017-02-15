define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){
	var RenderableLayer = WorldWind.RenderableLayer;

	/**
	 * Class extending WorldWind.RenderableLayer.
	 * @param options {Object}
	 * @augments WorldWind.RenderableLayer
	 * @constructor
	 */
	var MyRenderableLayer = function(options){
		RenderableLayer.call(this, options.name);
	};

	MyRenderableLayer.prototype = Object.create(RenderableLayer.prototype);

	MyRenderableLayer.prototype.enableRenderables = function(){
		this.renderables.forEach(function(renderable){
			renderable.enabled = true;
		});
	};

	MyRenderableLayer.prototype.disableRenderables = function(){
		this.renderables.forEach(function(renderable){
			renderable.enabled = false;
		});
	};

	return MyRenderableLayer;
});
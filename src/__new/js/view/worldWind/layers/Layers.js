define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../layers/AnalyticalUnitsLayer',
	'../layers/MapDiagramsLayer',
	'../MyGoToAnimator',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AnalyticalUnitsLayer,
			MapDiagramsLayer,
			MyGoToAnimator,

			$
){
	var Layers = function(options){
		this._layers = [];
	};

	/**
	 * Add layer to the list
	 * @param layer {WorldWind.Layer}
	 */
	Layers.prototype.addLayer = function(layer){
		this._layers.push(layer);
	};

	Layers.prototype.removeLayer = function(id){
		this._layers = _.filter(this._layers, function(layer) {
			return layer.metadata.id !== id;
		});
	};

	Layers.prototype.activateLayer = function(id){
		var layer = this.getLayerById(id);
		layer.metadata.active = true;
	};

	Layers.prototype.deactivateLayer = function(id){
		var layer = this.getLayerById(id);
		layer.metadata.active = false;
	};

	Layers.prototype.isActive = function(id){
		var layer = this.getLayerById(id);
		return layer.metadata.active;
	};

	/**
	 *
	 * @param id {string} id of the layer
	 * @returns {WorldWind.Layer}
	 */
	Layers.prototype.getLayerById = function(id){
		return _.filter(this._layers, function(layer){
			return layer.metadata.id == id; })[0];
	};

	/**
	 *
	 * @param group {string} name of the group
	 * @returns {Array} list of layers
	 */
	Layers.prototype.getLayersByGroup = function(group){
		return _.filter(this._layers, function(layer){
			return layer.metadata.group == group; });
	};

	return Layers;
});
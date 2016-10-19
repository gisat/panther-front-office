define([
	'../../error/ArgumentError',
	'../../util/Logger',

	'jquery'
], function (ArgumentError,
			 Logger,

			 $) {
	"use strict";

	/**
	 * Handling with map
	 * @param options {Object}
	 * @param options.map {Object} Open Layers map
	 * @constructor
	 */
	var Map = function (options) {
		this._map = options.map;
		this._layers = [];
	};

	/**
	 * Add layer to map
	 * @param data {Array}
	 * @param color {String}
	 */
	Map.prototype.addLayer = function(data, color){
		var vectorLayer = this.createVectorLayer(data, color);
		if(!this._layers[color]) {
			this._layers[color] = [];
		}
		this._layers[color].push(vectorLayer);
		this._map.addLayer(vectorLayer);
	};

	/**
	 * Create vector layer
	 * @param data {Array}
	 * @param color {String}
	 * @returns {*}
	 */
	Map.prototype.createVectorLayer = function(data, color){
		var vectorLayer = new OpenLayers.Layer.Vector("SelectedAreas", {
			styleMap: this.setStyle(color)
		});

		var features = [];
		var self = this;
		data.forEach(function(area){
			var feature = self.createVectorFeatruefromWKT(area.geom);
			features.push(feature);
		});
		vectorLayer.addFeatures(features);
		return vectorLayer;
	};

	/**
	 *
	 * @param geom {string} WKT geometry format
	 * @returns {*}
	 */
	Map.prototype.createVectorFeatruefromWKT = function(geom){
		return new OpenLayers.Feature.Vector(
			new OpenLayers.Geometry.fromWKT(geom)
		);
	};

	/**
	 * Add
	 * @returns {*}
	 */
	Map.prototype.setStyle = function(color){
		return new OpenLayers.StyleMap({
			strokeWidth: 1,
			strokeColor: color,
			fillColor: color,
			fillOpacity: 0.5
		});
	};

	/**
	 * Remove all previously added layers from map
	 */
	Map.prototype.removeLayers = function(color){
		if(!this._layers[color]){
			return;
		}

		var self = this;
		this._layers[color].forEach(function(layer){
			self._map.removeLayer(layer);
			self._layers.pop();
		});
	};

	return Map;
});

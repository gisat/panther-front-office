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
	 */
	Map.prototype.addLayer = function(data){
		var vectorLayer = this.createVectorLayer(data);
		this._layers.push(vectorLayer);
		this._map.addLayer(vectorLayer);
	};

	/**
	 * Create vector layer
	 * @param data {Array}
	 * @returns {*}
	 */
	Map.prototype.createVectorLayer = function(data){
		var vectorLayer = new OpenLayers.Layer.Vector("SelectedAreas", {
			styleMap: this.setStyle()
		});

		var features = [];
		var self = this;
		data.forEach(function(area){
			var feature = self.createVectorFeatruefromWKT(area.geometry);
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
	Map.prototype.setStyle = function(){
		return new OpenLayers.StyleMap({
			strokeWidth: 1,
			strokeColor: '#d22b1e',
			fillColor: '#d22b1e',
			fillOpacity: 0.5
		});
	};

	/**
	 * Remove all previously added layers from map
	 */
	Map.prototype.removeLayers = function(){
		var self = this;
		this._layers.forEach(function(layer){
			self._map.removeLayer(layer);
			self._layers.pop();
		});
	};

	return Map;
});

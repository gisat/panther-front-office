define([
	'../util/metadata/Attributes',
	'../util/RemoteJQ',

	'jquery'
], function (
	Attributes,
	RemoteJQ,

	$
) {
	"use strict";

	var SnowMapController = function(options) {
		this._iFrame = options.iFrame;

		if (options.worldWind){
			this._worldWind = options.worldWind;
		}

		this._countryLayer = null;
		this._previousLayer = null;
		this._previousLayerId = null;
	};

	SnowMapController.prototype.rebuild = function(){
		this.addCompositeShowOnClickListener();
	};

	/**
	 * Add listener to iframe inner element
	 */
	SnowMapController.prototype.addCompositeShowOnClickListener = function(){
		var self = this;
		this._iFrameBodySelector = $("#" + this._iFrame.getElementId()).contents().find("body");
		this._iFrameBodySelector.off("click.composites").on("click.composites", ".ptr-composites-composite .ptr-button", function(){
			Observer.notify("getMap");
			self._map = OlMap.map;

			if (!self._countryLayer){
				self._countryLayer = self.addLayerForCountry();
				self._map.addLayer(self._countryLayer);
			}

			var compositeId = $(this).parents(".ptr-composites-composite").attr("data-id");
			var locationKey = self._iFrameBodySelector.find("#composites").attr("data-country");
			var styleId = self._iFrameBodySelector.find("#composites").attr("data-style");

			self.highlightCountry(locationKey);
			self.showCompositeInMap(compositeId, styleId);

			//if (self._worldWind){
			//	self.showCompositeIn3DMap(compositeId);
			//}
		});
	};

	/**
	 * Remove previously added composite layer and show the new one
	 * @param compositeId {string} ID of the layer
	 * @param styleId {string} ID of the style
	 */
	SnowMapController.prototype.showCompositeInMap = function(compositeId, styleId){
		var self = this;
		if (!this._zoomListener){
			this._zoomListener = this._map.events.register("zoomend", this._map, function() {
				self._previousLayer.redraw();
			});
		}

		if (this._previousLayer){
			this._map.removeLayer(this._previousLayer);
		}
		this.addCompositeToMap(compositeId, styleId, 0.7);
	};

	/**
	 * @param compositeId {string} ID of the layer
	 * @param styleId {string} ID of the style
	 * @param opacity {number} layer opacity
	 */
	SnowMapController.prototype.addCompositeToMap = function(compositeId, styleId, opacity){
		var layer = this.createWmsLayer(compositeId, styleId, opacity);
		this._map.addLayer(layer);
		layer.visibility = true;
		layer.opacity = opacity;
		layer.redraw();
		this._previousLayer = layer;
	};

	/**
	 * @param key {string} key of country
	 */
	SnowMapController.prototype.highlightCountry = function(key){
		var self = this;
		this.getCountryData(key).then(function(data){
			var features = [];
			data.forEach(function(country){
				features.push(self.createFeatureFromWkt(country.geom));
			});
			self._countryLayer.destroyFeatures();
			self._countryLayer.addFeatures(features);
			self._countryLayer.redraw();
			var extent = self._countryLayer.getDataExtent();
			self._map.zoomToExtent([extent.left,extent.bottom,extent.right,extent.top]);
		});
	};

	/**
	 * @param layerId {string} ID of the layer
	 * @param styleId {string} ID of the style
	 * @param opacity {number} layer opacity
	 * @returns {OpenLayers.Layer.WMS}
	 */
	SnowMapController.prototype.createWmsLayer = function(layerId, styleId, opacity){
		return new OpenLayers.Layer.WMS(layerId,
			Config.snowUrl + "geoserver/geonode/wms", {
				layers: "geonode:" + layerId,
				styles: styleId
			},{
				opacity: opacity
			});
	};

	/**
	 * Remove layer from 3D map and show the new one
	 * @param compositeId
	 */
	SnowMapController.prototype.showCompositeIn3DMap = function(compositeId){
		if (this._previousLayerId){
			var layer = this._worldWind.layers.getLayerById(compositeId);
			this._worldWind.layers.removeLayer(layer);
		}

		this._worldWind.layers.addWmsLayer({
			id: compositeId,
			url: Config.snowUrl + "geoserver/geonode/wms",
			layerPaths: "geonode:" + compositeId
		}, null, true);
	};

	/**
	 * @returns {OpenLayers.Layer.Vector}
	 */
	SnowMapController.prototype.addLayerForCountry = function(){
		return new OpenLayers.Layer.Vector({
			name: "Selected country"
		});
	};

	/**
	 * @param wkt {string}
	 * @returns {OpenLayers.Feature.Vector}
	 */
	SnowMapController.prototype.createFeatureFromWkt = function(wkt){
		return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.fromWKT(wkt), {}, {
			strokeWidth: 4,
			strokeColor: "#ff0000",
			fillOpacity: 0
		});
	};

	/**
	 * @param countryKey {string}
	 * @returns {*|Promise}
	 */
	SnowMapController.prototype.getCountryData = function(countryKey){
		var self = this;
		return new Attributes().getData({
			changes: {
				scope: true
			},
			config: ThemeYearConfParams
		}).then(function(result){
			var attr = result[0][0];
			if (!attr){
				console.error("There is no attribute for current configuration! Go to backoffice and map attribute to counry key.");
			} else {
				return attr;
			}
		}).then(self.getCountry.bind(self, countryKey));
	};

	/**
	 * @param attribute {Object}
	 * @param countryKey {string}
	 */
	SnowMapController.prototype.getCountry = function(countryKey, attribute){
		return new RemoteJQ({
			url: "rest/filter/attribute/filter",
			params: {
				areaTemplate: ThemeYearConfParams.auCurrentAt,
				periods: JSON.parse(ThemeYearConfParams.years),
				places: ThemeYearConfParams.allPlaces,
				attributes: [{
					attribute: attribute.attribute,
					attributeSet: attribute.attributeSet,
					value: [countryKey]
				}]
			}
		}).post();
	};

	return SnowMapController;
});


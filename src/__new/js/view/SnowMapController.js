define([
	'../util/metadata/Attributes',
	'../util/RemoteJQ',
	'../stores/Stores',

	'jquery'
], function (
	Attributes,
	RemoteJQ,
	Stores,

	$
) {
	"use strict";

	var SnowMapController = function(options) {
		this._iFrame = options.iFrame;

		this._countryLayer = null;
		this._previousLayer = null;
	};

	SnowMapController.prototype.rebuild = function(){
		this._iFrameSelector = $("#" + this._iFrame.getElementId());
		this._iFrameBodySelector = this._iFrameSelector.contents().find("body");
		this.addCompositeShowOnClickListener();
		this.addSceneShowOnClickListener();
		this.addShowListListener();
		this.addTimelineOnClickListener();
		this.addHideListListener();
	};

	SnowMapController.prototype.addShowListListener = function(){
		this._iFrameBodySelector.off("click.compositesList").on("click.compositesList", ".ptr-button.show-list", this.showMap.bind(this));
	};

	SnowMapController.prototype.addHideListListener = function(){
		this._iFrameBodySelector.off("click.compositesOverview").on("click.compositesOverview", ".ptr-button.show-overview", this.hideMap.bind(this));
	};

	SnowMapController.prototype.showMap = function(e){
		this.setPanelSize();
		setTimeout(function(){
			Observer.notify("resizeMap");
		},1000);
	};

	SnowMapController.prototype.hideMap = function(){
		$("#sidebar-reports").removeClass("show-map");
	};

	SnowMapController.prototype.setPanelSize = function(){
		var self = this;
		setTimeout(function(){
			var sidebar = $("#sidebar-reports");
			sidebar.attr("class", "snow-mode");
			var panelClasses = self._iFrameBodySelector.find("#content").attr("class");
			if (panelClasses){
				sidebar.addClass(panelClasses);
			}
			sidebar.addClass("show-map");
		},100);
	};


	SnowMapController.prototype.addTimelineOnClickListener = function(){
		var self = this;
		this._iFrameBodySelector.off("click.timeline").on("click.timeline", "#timelines", function(){
			Observer.notify("getMap");
			self._map = OlMap.map;

			if (!self._countryLayer){
				self._countryLayer = self.addLayerForCountry();
				self._map.addLayer(self._countryLayer);
			}

			var compositeId = $(this).attr("data-id");
			var locationKey = self._iFrameBodySelector.find("#composites").attr("data-country");
			var styleId = self._iFrameBodySelector.find("#composites").attr("data-style");

			self.highlightCountry(locationKey);
			self.showLayerInMap(compositeId, styleId);
		});
	};


	/**
	 * Add listener to iframe inner element
	 */
	SnowMapController.prototype.addCompositeShowOnClickListener = function(){
		var self = this;
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
			self.showLayerInMap(compositeId, styleId);
		});
	};

	/**
	 * Add listener to iframe inner element
	 */
	SnowMapController.prototype.addSceneShowOnClickListener = function(){
		var self = this;
		this._iFrameBodySelector.off("click.scenes").on("click.scene", ".ptr-scenes-scene .ptr-button", function(){
			Observer.notify("getMap");
			self._map = OlMap.map;

			if (!self._countryLayer){
				self._countryLayer = self.addLayerForCountry();
				self._map.addLayer(self._countryLayer);
			}

			var sceneId = $(this).parents(".ptr-scenes-scene").attr("data-id");
			var locationKey = self._iFrameBodySelector.find("#composites").attr("data-country");
			self.highlightCountry(locationKey);
			self.showLayerInMap(sceneId);
		});
	};

	/**
	 * Remove previously added composite layer and show the new one
	 * @param compositeId {string} ID of the layer
	 * @param styleId {string} ID of the style
	 */
	SnowMapController.prototype.showLayerInMap = function(layerId, styleId){
		var self = this;
		if (!this._zoomListener){
			this._zoomListener = this._map.events.register("zoomend", this._map, function() {
				self._previousLayer.redraw();
			});
		}

		if (this._previousLayer){
			this._map.removeLayer(this._previousLayer);
		}
		this.addLayerToMap(layerId, styleId, 0.7);
	};

	/**
	 * @param layerId {string} ID of the layer
	 * @param styleId {string} ID of the style
	 * @param opacity {number} layer opacity
	 */
	SnowMapController.prototype.addLayerToMap = function(layerId, styleId, opacity){
		var layer = this.createWmsLayer(layerId, styleId, opacity);
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
			Config.snowGeoserverUrl, {
				layers: "geonode:" + layerId,
				styles: styleId
			},{
				opacity: opacity
			});
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
		var state = Stores.retrieve('state').current();
		return new RemoteJQ({
			url: "rest/filter/attribute/filter",
			params: {
				areaTemplate: state.analyticalUnitLevel,
				periods: state.periods,
				places: state.places,
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


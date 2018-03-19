define([
	'../../error/ArgumentError',
	'../../util/Logger',

	'../../util/dataMining',

	'jquery'
], function (ArgumentError,
			 Logger,

			 DataMining,

			 $) {
	"use strict";

	/**
	 * Class for handling with map
	 * @param options {Object}
	 * @param options.map {Object} Open Layers map
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var Map = function (options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Map', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Map', 'constructor', 'Store state must be provided'));
        }

		this._map = options.map;
		this._layers = [];

        this._store = options.store;
		this._dataMining = new DataMining({
			store: {
				state: options.store.state
			}
		})
	};
	
	Map.prototype.rebuild = function(){
		if (!this._map){
			Observer.notify("getMap");
			this._map = OlMap.map;
			this._map2 = OlMap.map2;
		}
	};

	/**
	 * Add layer for drawing of custom polygons
	 * @param name
	 * @param color
	 */
	Map.prototype.addLayerForDrawing = function(name, color){
		var layer = this.createVectorLayer(color, name);
		this._map.addControl(new OpenLayers.Control.MousePosition());
		this._map.addLayer(layer);
		this._map.setLayerZIndex(layer, 99999);
		return layer;
	};

	Map.prototype.addControlsForPolygonDrawing = function(polygonLayer, onDrawEnd){
		var drawControl = new OpenLayers.Control.DrawFeature(polygonLayer,
			OpenLayers.Handler.Polygon);

		drawControl.events.register('featureadded', drawControl, onDrawEnd);
		this._map.addControl(drawControl);
		return drawControl;
	};

	Map.prototype.addControlsForLineDrawing = function(lineLayer, onDrawEnd){
		var drawControl2 = new OpenLayers.Control.DrawFeature(lineLayer,
			OpenLayers.Handler.Path);

		drawControl2.events.register('featureadded', drawControl2, onDrawEnd);
		this._map.addControl(drawControl2);
		return drawControl2;
	};

	/**
	 * Add layer to map
	 * @param data {Array}
	 * @param color {String}
	 * @param name {String}
	 */
	Map.prototype.addLayer = function(data, color, name){
		var vectorLayer = this.createVectorLayer(color, name);
		vectorLayer = this.addFeaturesToVectorLayer(vectorLayer, data);

		if(!this._layers[color]) {
			this._layers[color] = [];
		}
		this._layers[color].push(vectorLayer);
		this._map.addLayer(vectorLayer);
	};



	/**
	 * Create vector layer
	 * @param color {String}
	 * @param name {String}
	 * @returns {*}
	 */
	Map.prototype.createVectorLayer = function(color, name){
		return new OpenLayers.Layer.Vector(name, {
			styleMap: this.setStyle(color)
		});
	};

	/**
	 * Add features to vector layer
	 * @param vectorLayer {Object}
	 * @param data {Array}
	 * @returns {*}
	 */
	Map.prototype.addFeaturesToVectorLayer = function(vectorLayer, data){
		var features = [];
		var self = this;
		data.forEach(function(area){
			var attr = {};
			if (area.hasOwnProperty("uuid")){
				attr.uuid = area.uuid;
			}
			var style = self.prepareStyle("#FA6900", area.name);
			var feature = self.createVectorFeatruefromWKT(area.geometry, attr, style);
			features.push(feature);
		});
		vectorLayer.addFeatures(features);
		vectorLayer.redraw();
		return vectorLayer;
	};

	/**
	 *
	 * @param geom {string} WKT geometry format
	 * @returns {*}
	 */
	Map.prototype.createVectorFeatruefromWKT = function(geom, attributes, style){
		return new OpenLayers.Feature.Vector(
			new OpenLayers.Geometry.fromWKT(geom), attributes, style
		);
	};

	/**
	 * Set z index of given layer
	 * @param layer {OpenLayers.Layer}
	 * @param zIndex {number}
	 */
	Map.prototype.setLayerZIndex = function(layer, zIndex){
		this._map.setLayerZIndex(layer, zIndex);
	};

	/**
	 * Add
	 * @returns {*}
	 */
	Map.prototype.setStyle = function(color){
		return new OpenLayers.StyleMap(this.prepareStyle(color));
	};

	Map.prototype.prepareStyle = function(color, label){
		var style = {
			strokeWidth: 4,
			strokeColor: color,
			fillColor: color,
			fillOpacity: 0.3,
			fontColor: "#333",
			fontSize: "16px",
			fontFamily: "Arial, sans-serif",
			fontWeight: "bold",
			fontStyle: "italic"
		};
		if (label){
			style.label = label;
			style.labelOutlineColor = "white";
			style.labelOutlineWidth = 3;
		}
		return style;
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

	/**
	 * Get WKT geometry of the feature
	 * @param feature {OpenLayers.Feature}
	 * @returns {OpenLayers.Format.WKT.write}
	 */
	Map.prototype.getWKT = function(feature){
		return new OpenLayers.Format.WKT().write(feature);
	};

	Map.prototype.addOnClickListener = function(attributes, infoWindow){
		var layers = this._dataMining.getAuBaseLayers();
		this._attributes = attributes;
		this._map.selectInMapLayer.params['LAYERS'] = layers.join(',');
		this._map2.selectInMapLayer.params['LAYERS'] = layers.join(',');
		if (!this._newInfoControl){
			this._newInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
				id: "feature_info_map1",
				url: Config.url+'api/proxy/wms',
				vendorParams: {
					propertyName: 'gid',
					expectJson: true
				},
				layers: [this._map.selectInMapLayer]
			});
			this._newInfoControl2 = new OpenLayers.Control.WMSGetFeatureInfo({
				id: "feature_info_map2",
				url: Config.url+'api/proxy/wms',
				vendorParams: {
					propertyName: 'gid',
					expectJson: true
				},
				layers: [this._map2.selectInMapLayer]
			});
			this._newInfoControl.events.register("getfeatureinfo", this, this.getInfoAboutArea.bind(this, infoWindow));
			this._newInfoControl2.events.register("getfeatureinfo", this, this.getInfoAboutArea.bind(this, infoWindow));
			this._map.addControl(this._newInfoControl);
			this._map2.addControl(this._newInfoControl2);
		}
	};

	Map.prototype.getInfoAboutArea = function(infoWindow, e){
		var appState = this._store.state.current();
		var allFeatures = JSON.parse(e.text).features;
		if (allFeatures.length > 0){
			infoWindow.setVisibility("show");
			infoWindow.setScreenPosition(e.object.handler.evt.clientX, e.xy.y);

			var featureGid = allFeatures[allFeatures.length - 1].properties.gid;
			var years = appState.periods;
			var periods = [];
			if (e.object.hasOwnProperty("id") && e.object.id == "feature_info_map2"){
				periods.push(years[years.length - 1]);
			} else {
				periods.push(years[0]);
			}
			infoWindow.rebuild(this._attributes, featureGid, periods);
		}
		else {
			infoWindow.setVisibility("hide");
		}
	};

	Map.prototype.onClickActivate = function(){
		this._newInfoControl.activate();
		this._newInfoControl2.activate();
	};

	Map.prototype.onClickDeactivate = function(infoWindow){
		this._newInfoControl.deactivate();
		this._newInfoControl2.deactivate();
		infoWindow.setVisibility("hide");
	};

	/**
	 * Delete feature from vector layer
	 * @param attrName {string} name of the attribute
	 * @param attrValue {string} value of the attribute
	 * @param layer {OpenLayers.Layer.Vector}
	 */
	Map.prototype.deleteFeatureFromLayer = function (attrName, attrValue, layer) {
		var feature = this.getFeaturesByAttribute(attrName, attrValue, layer)[0];
		layer.removeFeatures(feature);
	};

	/**
	 * Delete feature from vector layer
	 * @param id {string} open layers id
	 * @param layer {OpenLayers.Layer.Vector}
	 */
	Map.prototype.deleteFeatureFromLayerById = function (id, layer) {
		var feature = this.getFeatureById(id, layer);
		layer.removeFeatures(feature);
	};

	/**
	 * Get feature by id
	 * @param id {string} id of the feature
	 * @param layer {OpenLayers.Layer.Vector}
	 * @returns {OpenLayers.Feature}
	 */
	Map.prototype.getFeatureById = function (id, layer){
		return layer.getFeatureById(id);
	};

	/**
	 * Get features by atributte value
	 * @param attrName {string} name of the attribute
	 * @param attrValue {string} value of the attribute
	 * @param layer {OpenLayers.Layer.Vector}
	 */
	Map.prototype.getFeaturesByAttribute = function (attrName, attrValue, layer){
		return layer.getFeaturesByAttribute(attrName, attrValue);
	};

	return Map;
});

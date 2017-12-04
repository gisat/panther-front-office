define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../util/dataMining',
	'../../components/Collapse/Collapse',
	'./FeatureInfoWindow',
	'../../table/Table',

	'jquery',
	'underscore',
	'css!./LayerInfoWindow'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 utils,
			 Collapse,
			 FeatureInfoWindow,
			 Table,

			 $,
			 _) {
	"use strict";


	var LayerInfoWindow = function (options) {
		FeatureInfoWindow.apply(this, arguments);

	};

	LayerInfoWindow.prototype = Object.create(FeatureInfoWindow.prototype);

	/**
	 * Rebuild window with current data
	 * @param data {Array}
	 */
	LayerInfoWindow.prototype.rebuild = function(data){
		if (data.length){
			var screenPos = data[0].options.screenCoordinates;
			var layersData = this.prepareData(data);
			if (layersData.length){
				this.setVisibility("show");
				this.setScreenPosition(screenPos.x, screenPos.y, true);
				this.redrawWindow(layersData);
			} else {
				this.setVisibility("hide");
			}
		} else {
			this.setVisibility("hide");
		}
	};

	/**
	 * Redraw content of info window
	 * @param data {Array} list of layers
	 */
	LayerInfoWindow.prototype.redrawWindow = function(data){
		this._infoWindowBodySelector.html("");
		var self = this;
		var counter = 0;
		data.forEach(function(layer, index){
			if (layer.layers !== "selectedAreasFilled"){
				counter++;
				var id = "layer-info-collapse-" + index;
				var collapse = new Collapse({
					title: layer.name,
					id: id,
					containerSelector: self._infoWindowBodySelector,
					open: false,
					customClasses: 'layer-info-collapse'
				});

				// add content to collapse body
				var bodySelector = collapse.getBodySelector();
				var table = self.renderTable(id, bodySelector.attr("id"));
				var layerInfo = self.cleanProjectSpecificData(layer);
				table.appendContent(layerInfo);
			}
		});
		if (counter === 0){
			this._infoWindowBodySelector.append('<p>' + polyglot.t("layerInfoDetails") + '</p>');
		}
	};

	/**
	 * Prepare data for feature info window content. Filter layers without single feature.
	 * @param data {Array} original data
	 * @returns {Array} prepared data
	 */
	LayerInfoWindow.prototype.prepareData = function(data){
		var dataPerLayer = [];
		data.forEach(function(content){
			var layerData = content.options;
			var featureInfo = content.featureInfo;

			if (typeof featureInfo === 'string'){
				var isJson = utils.isJson(featureInfo);
				if (isJson){
					featureInfo = JSON.parse(content.featureInfo);
					layerData.queryable = true;
				} else {
					layerData.queryable = false;
				}
			}

			if (featureInfo.features && featureInfo.features.length){
				var featureProperties = featureInfo.features[0].properties;
				if (featureProperties){
					layerData.featureProperties = featureProperties;
					delete layerData.position;
					delete layerData.screenCoordinates;
				}
			} else {
				delete layerData.position;
				delete layerData.screenCoordinates;
				if (layerData.queryable){
					layerData.featureProperties = polyglot.t("layerFeatureMissed");
				} else {
					layerData.featureProperties = polyglot.t("notQueryableLayerInfo");
				}
			}
			dataPerLayer.push(layerData);
		});
		return dataPerLayer;
	};

	/**
	 * Clean data for project specific layers
	 * @param data {Object} info about layer
	 * @returns {Object} original or cleaned info about layer
	 */
	LayerInfoWindow.prototype.cleanProjectSpecificData = function (data) {
		var layerInfo = {};
		if (data.serviceAddress){

			// clean data from sentinel hub
			var isFromSentinelHub = data.serviceAddress.includes("sentinel-hub");
			if (isFromSentinelHub){
				var properties = data.featureProperties;
				if (properties){
					layerInfo.featureProperties = {};
					if (properties.id){
						layerInfo.featureProperties.id = properties.id;
					}
					if (properties.date){
						layerInfo.featureProperties.date = properties.date;
					}
					if (properties.time){
						layerInfo.featureProperties.time = properties.time;
					}
					if (properties.cloudCoverPercentage || properties.cloudCoverPercentage === 0){
						layerInfo.featureProperties.cloudCoverPercentage = properties.cloudCoverPercentage;
					}
					return layerInfo;
				}
			}
		}
		return data;
	};

	/**
	 * @param id {string} Id of the table
	 * @param targetId {string} Id of the target
	 * @returns {Table}
	 */
	LayerInfoWindow.prototype.renderTable = function(id, targetId){
		return new Table({
			elementId: id + "-table",
			targetId: targetId,
			class: 'basic-table'
		});
	};

	return LayerInfoWindow;
});
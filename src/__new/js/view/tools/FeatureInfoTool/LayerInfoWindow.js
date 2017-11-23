define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./FeatureInfoWindow',
	'../../../util/Filter',
	'../../../util/MapExport',
	'../../../stores/Stores',
	'../../../util/viewUtils',

	'jquery',
	'string',
	'underscore'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 FeatureInfoWindow,
			 Filter,
			 MapExport,
			 InternalStores,
			 viewUtils,

			 $,
			 S,
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

	LayerInfoWindow.prototype.redrawWindow = function(data){
		this._infoWindowBodySelector.html(data.length);
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
				featureInfo = JSON.parse(content.featureInfo);
			}

			if (featureInfo.features.length){
				var featureProperties = featureInfo.features[0].properties;
				if (featureProperties){
					layerData.featureProperties = featureProperties;
					dataPerLayer.push(layerData);
				}
			}
		});
		return dataPerLayer;
	};

	return LayerInfoWindow;
});
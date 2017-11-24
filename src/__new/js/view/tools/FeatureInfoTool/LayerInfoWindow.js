define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../components/Collapse/Collapse',
	'./FeatureInfoWindow',
	'../../table/Table',

	'jquery',
	'underscore',
	'css!./LayerInfoWindow'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

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
		data.forEach(function(layer, index){
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
			table.appendContent(layer);
		});
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
					delete layerData.position;
					delete layerData.screenCoordinates;
					dataPerLayer.push(layerData);
				}
			}
		});
		return dataPerLayer;
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
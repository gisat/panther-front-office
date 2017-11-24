define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../components/Collapse/Collapse',
	'./FeatureInfoWindow',

	'jquery',
	'underscore'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Collapse,
			 FeatureInfoWindow,

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
			new Collapse({
				title: layer.name,
				id: "layer-info-collapse-" + index,

				// todo solve this
				content: '<div>Lorem ipsum dolor sit amet consectetur adipiscing. Turpis egestas maecenas pharetra convallis. Vestibulum lorem sed risus ultricies tristique nulla. Semper risus in hendrerit gravida rutrum quisque non. Nulla facilisi nullam vehicula ipsum. Turpis nunc eget lorem dolor sed viverra ipsum. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Sem integer vitae justo eget magna. Ac auctor augue mauris augue neque gravida in fermentum et. Tempor orci dapibus ultrices in iaculis nunc sed. Lorem mollis aliquam ut porttitor leo a.</div>',

				containerSelector: self._infoWindowBodySelector,
				open: false,
				customClasses: 'layer-info-collapse'
			});
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
					dataPerLayer.push(layerData);
				}
			}
		});
		return dataPerLayer;
	};

	return LayerInfoWindow;
});
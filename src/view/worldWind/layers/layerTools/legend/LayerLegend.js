

import LayerTool from '../LayerTool';
import stringUtils from '../../../../../util/stringUtils';

let Config = window.Config;
let polyglot = window.polyglot;

/**
 * Class representing layer legend
 * TODO join this class with Legend.js
 * @param options {Object}
 * @param options.id {string} Id of the tool
 * @param options.name {string} Name of the tool
 * @param options.class {string}
 * @param options.target {Object} JQuery selector of target element
 * @param options.layers {Array} List of layers associated with this legend
 * @param options.style {Object} Associated style
 * @augments LayerTool
 * @constructor
 */
let $ = window.$;
class LayerLegend extends LayerTool {
    constructor(options) {
        super(options);

        this._target = options.target;
        this._layers = options.layers;
        this._style = options.style;
        this._name = options.name;
        this._id = options.id;
        this._stateStore = options.stateStore;

        // TODO will there be the same legend for each period?
        this._defaultLayer = this._layers ? this._layers[0] : null;

        this.build();
        window.Stores.addListener(this.onEvent.bind(this), {key: this._id});
    };

    /**
     * Build a legend
     */
    build() {
        this._icon = this.buildIcon(polyglot.t("legend"), "legend-icon", "legend");
        this._floater = this.buildFloater(polyglot.t("legend"), "legend-floater");

        this._iconSelector = this._icon.getElement();
        this._floaterSelector = this._floater.getElement();

        if (this._defaultLayer){
			this.addContent();
        }
        this.addEventsListener();
    };

    /**
     * Add content to a legend floater
     */
    addContent() {
    	let floaterOpen = this._floater._floaterSelector.hasClass("open");
        if (this._defaultLayer && floaterOpen){
			let style = "";
			let layer = this._defaultLayer.path;
			let url = Config.url + "geoserver/wms?";
			try{
				const custom = JSON.parse(this._defaultLayer.custom);
				if(custom.url) {
					url = custom.url + '?';
				}
				if(custom.layerPaths) {
					layer = custom.layerPaths;
				}
			} catch(e) {

			}

			if (this._style) {
				style = this._style.path;
			}
			if (!layer) {
				layer = this._defaultLayer.layer;
				url = this._defaultLayer.url + '?';
			}

			// TODO Remove this ugly hack for PUCS
			if (this._defaultLayer.layerTemplateId === 75291){
				let currentPlaces = this._stateStore.current().locations;
				if (currentPlaces && currentPlaces[0] && currentPlaces[0] === 75379){
					style = "pucs_UHI_Ostrava";
				} else if (currentPlaces && currentPlaces[0] && currentPlaces[0] === 75281){
					style = "PUCS_UHI_Praha";
				}
			} else if (this._defaultLayer.layerTemplateId === 75292){
				let currentPlaces = this._stateStore.current().locations;
				if (currentPlaces && currentPlaces[0] && currentPlaces[0] === 75379){
					style = "PUCS_HWD_Ostrava";
				} else if (currentPlaces && currentPlaces[0] && currentPlaces[0] === 75281){
					style = "PUCS_HWD_Praha";
				}
			}

			let params = {
				'LAYER': layer,
				'REQUEST': 'GetLegendGraphic',
				'FORMAT': 'image/png',
				'WIDTH': 50,
				'STYLE': style
			};
			if (this._defaultLayer.hasOwnProperty('sldId')) {
				params['SLD_ID'] = this._defaultLayer.sldId;
			}

			let imgSrc = url + stringUtils.makeUriComponent(params);

			let self = this;
			$.get(imgSrc)
				.done(function (result) {
					// if result is XML, the legend is not available
					try {
						$.parseXML(result);
						self._floater.addContent('<p>' + polyglot.t('legendNotAvailable') + '<p>');
					}
					catch (err) {
						self._floater.addContent('<img src="' + imgSrc + '">');
					}
				}).fail(function () {
				self._floater.addContent('<p>' + polyglot.t('legendNotAvailable') + '<p>');
			});
        }
    };

    addContentForChoropleth(mapKey, mapPeriod, data){
		let url = Config.url + "api/proxy/wms?";

		let params = {
			'LAYER': data.layer,
			'REQUEST': 'GetLegendGraphic',
			'FORMAT': 'image/png',
			'WIDTH': 50,
            'SLD_ID': data.sldId
		};
		let imgSrc = url + stringUtils.makeUriComponent(params);

		let self = this;
		$.get(imgSrc)
			.done(function (result) {
				// if result is XML, the legend is not available
				try {
					$.parseXML(result);
					self._floater.addContent('<p>' + polyglot.t('legendNotAvailable') + '<p>');
				}
				catch (err) {
					self.addChoroplethLegend(mapKey, mapPeriod, imgSrc);
				}
			}).fail(function () {
			self._floater.addContent('<p>' + polyglot.t('legendNotAvailable') + '<p>');
		});
    };

    addChoroplethLegend(mapKey, mapPeriod, imgSrc){
		let target = $(this._floater._floaterBodySelector);
		let legend = target.find(`.legend-content-item[data-id="${mapKey}"]`);
		if (legend){
		    legend.remove();
        }

	    target.append(`<div class="legend-content-item" data-id="${mapKey}">
                <span>${mapPeriod ? mapPeriod : ""}</span>
                <img src="${imgSrc}">
            </div>`);
    };

	removeChoroplethLegend(mapKey){
		let target = $(this._floater._floaterBodySelector);
		let legend = target.find(`.legend-content-item[data-id="${mapKey}"]`);
		if (legend){
			legend.remove();
		}
	};

    onEvent(type, options){
	    if (type === "CHOROPLETH_ADD"){
	    	if (options.choroplethKey === this._id){
				this.addContentForChoropleth(options.mapKey, options.mapPeriod, options.data);
			}
		} else if (type === "CHOROPLETH_REMOVE"){
			if (options.choroplethKey === this._id) {
				this.removeChoroplethLegend(options.mapKey);
			}
        } else if (type === "CHOROPLETH_CHANGE"){
			if (options.choroplethKey === this._id){
				this.addContentForChoropleth(options.mapKey, options.mapPeriod, options.data);
			}
		}
	};
}

export default LayerLegend
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import Collapse from '../../components/Collapse/Collapse';
import LayerInfoWindow from './LayerInfoWindow';

import './PucsFeatureInfoWindow.css';
import _ from 'lodash';

let polyglot = window.polyglot;

/**
 *
 * @param options
 * @param options.store
 * @param options.store.state {StateStore}
 * @constructor
 */
class PucsFeatureInfoWindow extends LayerInfoWindow {
	constructor(options) {
		super(options);
	}

	/**
	 * Redraw content of info window
	 * @param data {Array} list of layers
	 */
	redrawWindow(data) {
		// show info only for the layer which is on the top
		let layerData = data && data.length && data[data.length - 1];
		let collection = layerData && layerData.featureProperties;

		let scope = this._store.state.current().scopeFull;
		let pucsConfig = scope.configuration.pucsLandUseScenarios.templates;
		let pucsFeatureInfoConfig = scope.configuration.pucsFeatureInfo;

		let columnsOfInterest = null;
		let layerTemplateId = null;
		let maps = this._store.map.getAll();
		if (layerData && maps){
			maps.forEach((map) => {
				if (map.layers._layers){
					let layer = _.find(map.layers._layers, (layer) => {
						return layer.urlBuilder.layerNames === layerData.layers;
					});
					if (layer){
						layerTemplateId = layer.metadata.templateId;
					}
				}
			});
		}

		if (layerTemplateId && pucsConfig){
			_.forIn(pucsConfig, (value, key) => {
				if (value === layerTemplateId){
					columnsOfInterest = pucsFeatureInfoConfig[key];
				}
			});
		}

		if (collection && _.isObject(collection) && columnsOfInterest){
			this._infoWindowBodySelector.html(this.renderContent(collection, columnsOfInterest));
		} else {
			this._infoWindowBodySelector.html(`<p>${polyglot.t('noDataInSelectedArea')}</p>`);
		}
	};

	renderContent(data, columns){
		let content = "";
		columns.forEach((column) => {
			let value = data[column.column];
			if (_.isNumber(value) && (value % 1 !== 0)){
				value = value.toFixed(2);
			}

			content += '<tr><td><i>' + column.description + '</i>: </td><td>' + value + '</td></tr>';
		});

		return '<table>' + content + '</table>';
	}
}

export default PucsFeatureInfoWindow;
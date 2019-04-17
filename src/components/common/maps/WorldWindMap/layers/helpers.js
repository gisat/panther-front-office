import WorldWind from "@nasaworldwind/worldwind";
import ExtendedWmsLayer from "./ExtendedWmsLayer";
import ExtendedOsmLayer from "./ExtendedOsmLayer";
import ColoredLayer from "./ColoredLayer";
import _ from "lodash";
import config from "../../../../../config/index";

const {Location, Sector} = WorldWind;

/**
 * Add layer to given wwd
 * @param wwd {WorldWindow}
 * @param layerData {Object}
 * @param [position] {number}
 */
function addLayer(wwd, layerData, position) {
	if (layerData){
		let layer = getLayerByType(layerData);
		if (layer) {
			if (position || position === 0){
				wwd.insertLayer(position, layer);
			} else {
				wwd.addLayer(layer);
			}
			wwd.redraw();
		}
	} else {
		throw new Error("WorldWindMap/layers/helpers#addLayer: Layer data missing!");
	}
}

/**
 * Return layer, if exists in given wwd
 * @param wwd {WorldWindow}
 * @param layerKey {string}
 * @returns {null | Layer}
 */
function findLayerByKey(wwd, layerKey) {
	let layer = _.find(wwd.layers, {key: layerKey});
	return layer ? layer : null;
}

/**
 * Return layer instance by given type
 * @param layerData {Object}
 * @param layerData.type {string}
 * @returns {ExtendedWmsLayer | ExtendedOsmLayer | ColoredLayer}
 */
function getLayerByType(layerData){
	if (layerData && layerData.type){
		switch (layerData.type){
			case "bingAerial":
				return new WorldWind.BingAerialLayer();
			case "wms":
				return getWmsLayer(layerData);
			case "wmts":
				return getWmtsOsmBasedLayer(layerData);
			case "colored":
				return getColoredLayer(layerData);
			case "vector":
				return getWmsVectorLayer(layerData);
			default:
				return null;
		}
	} else {
		return null;
	}
}

/**
 * @param layerData {Object}
 * @param layerData.configuration {Object}
 * @param layerData.configuration.numLevels {number}
 * @param layerData.configuration.params {Object}
 * @param layerData.configuration.version {string}
 * @param layerData.layers {string}
 * @param layerData.name {string}
 * @param layerData.opacity {number}
 * @param layerData.styles {string}
 * @param layerData.url {string} Service url
 * @returns {ExtendedWmsLayer}
 */
function getWmsLayer(layerData) {
	let imageFormat, version, params;
	let numLevels = 18;

	if (layerData.configuration) {
		if (layerData.configuration.params) {
			({imageFormat, version, ...params} = layerData.configuration.params);
		}
		if (layerData.configuration.numLevels) {
			numLevels = layerData.configuration.numLevels;
		}
	}

	return new ExtendedWmsLayer({
		key: layerData.key,
		format: imageFormat ? imageFormat : "image/png",
		layerNames: layerData.layers,
		levelZeroDelta: new Location(45, 45),
		name: layerData.name,
		numLevels,
		opacity: layerData.opacity,
		params: _.isEmpty(params) ? null : params,
		sector: new Sector(-90, 90, -180, 180),
		service: layerData.url,
		size: 256,
		styleNames: layerData.styles,
		version: version ? version : "1.3.0",
	}, null);
}

/**
 * @param layerData {Object}
 * @param layerData.name {string}
 * @param layerData.layerName {string}
 * @param layerData.attribution {string}
 * @param layerData.layerName {string}
 * @param layerData.nameInternal {string}
 * @param layerData.tableName {string}
 * @returns {ExtendedWmsLayer}
 */
function getWmsVectorLayer(layerData) {
	const numLevels = 18;
	
//fixme - selector přilepí config.geoserverurl
	const layer = new ExtendedWmsLayer({
		key: layerData.key,
		format: "image/png",
		layerNames: layerData.layerName,
		levelZeroDelta: new Location(45, 45),
		name: layerData.name,
		numLevels,
		opacity: 0,
		params: null,
		sector: new Sector(-90, 90, -180, 180),
		service: `${config.geoServerUrl}wms`,
		size: 256,
		styleNames: layerData.styles,
		styleNames: '',
		version: "1.3.0",
	}, null);
	return layer
}

/**
 * @param layerData {Object}
 * @returns {ExtendedOsmLayer}
 */
function getWmtsOsmBasedLayer(layerData) {
	return new ExtendedOsmLayer(layerData, null);
}

/**
 * @param layerColor {string}
 * @returns {ColoredLayer}
 */
function getColoredLayer(layerData) {
	return new ColoredLayer(layerData);
}

/**
 * Remove layer from given World Window
 * @param wwd {WorldWindow}
 * @param layerKey {string}
 */
function removeLayer(wwd, layerKey) {
	let layer = findLayerByKey(wwd, layerKey);
	if (layer){
		wwd.removeLayer(layer);
		wwd.redraw();
	}
}

export default {
	addLayer,
	findLayerByKey,
	getLayerByType,
	removeLayer
}
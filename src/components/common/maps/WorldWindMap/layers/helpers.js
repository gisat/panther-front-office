import WorldWind from "@nasaworldwind/worldwind";
import ExtendedWmsLayer from "./ExtendedWmsLayer";
import ExtendedOsmLayer from "./ExtendedOsmLayer";
import _ from "lodash";

const {Location, Sector} = WorldWind;

/**
 * Add layer to given wwd
 * @param wwd {WorldWindow}
 * @param layerData {Object}
 * @param [position] {number}
 */
function addLayer(wwd, layerData, position) {
	if (layerData){
		if (position || position === 0){
			wwd.insertLayer(position, getLayerByType(layerData));
		} else {
			wwd.addLayer(getLayerByType(layerData));
		}
		wwd.redraw();
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
 * @returns {ExtendedWmsLayer | ExtendedOsmLayer}
 */
function getLayerByType(layerData){
	if (layerData && layerData.type){
		switch (layerData.type){
			case "wms":
				return getWmsLayer(layerData);
			case "wmts":
				return getWmtsOsmBasedLayer(layerData);
			default:
				throw new Error("WorldWindMap/layers/helpers#getLayerByType: Unknown type of layer: " + layerData.type)
		}
	} else {
		throw new Error("WorldWindMap/layers/helpers#getLayerByType: Layer type is missing");
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
	let format = "image/png";
	let numLevels = 18;
	let version = "1.3.0";
	let params = null;

	if (layerData.configuration) {
		if (layerData.configuration.params) {
			if (layerData.configuration.params.format) {
				format = layerData.configuration.params.format;
			}
			if (layerData.configuration.params.version) {
				version = layerData.configuration.params.version;
			}
		}
		if (layerData.configuration.numLevels) {
			numLevels = layerData.configuration.numLevels;
		}
		params = layerData.configuration.params;
	}

	return new ExtendedWmsLayer({
		format,
		layerNames: layerData.layers,
		levelZeroDelta: new Location(45, 45),
		name: layerData.name,
		numLevels,
		opacity: layerData.opacity,
		params,
		sector: new Sector(-90, 90, -180, 180),
		service: layerData.url,
		size: 256,
		styleNames: layerData.styles,
		version,
	}, null);
}

/**
 * @param layerData {Object}
 * @returns {ExtendedOsmLayer}
 */
function getWmtsOsmBasedLayer(layerData) {
	return new ExtendedOsmLayer(layerData, null);
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
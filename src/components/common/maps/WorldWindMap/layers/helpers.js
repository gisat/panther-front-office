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
			case "wmts-osm-based":
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
 * @param layerData.url {string} Service url
 * @returns {ExtendedWmsLayer}
 */
function getWmsLayer(layerData) {
	return new ExtendedWmsLayer({
		...layerData,
		service: layerData.url,
		sector: new Sector(-90, 90, -180, 180),
		levelZeroDelta: new Location(45, 45),
		numLevels: layerData.numLevels ? layerData.numLevels : 18,
		format: "image/png",
		size: 256,
		version: "1.3.0",
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
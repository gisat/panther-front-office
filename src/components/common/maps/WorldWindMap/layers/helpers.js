import WorldWind from "@nasaworldwind/worldwind";
import ExtendedWmsLayer from "./ExtendedWmsLayer";
import ExtendedOsmLayer from "./ExtendedOsmLayer";
import _ from "lodash";

const {Location, Sector} = WorldWind;

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
	let layer = _.find(wwd.layers, {key: layerKey});
	if (layer){
		wwd.removeLayer(layer);
	}
}

export default {
	getWmsLayer,
	getWmtsOsmBasedLayer,
	removeLayer
}
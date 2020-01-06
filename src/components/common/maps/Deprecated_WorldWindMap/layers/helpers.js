import WorldWind from "webworldwind-esa";
import ExtendedWmsLayer from "./ExtendedWmsLayer";
import ExtendedOsmLayer from "./ExtendedOsmLayer";
import ExtendedGeoJsonLayer from "./ExtendedGeoJsonLayer";
import ExtendedRenderableLayer from "./VectorLayer";
import CartodiagramVectorLayer from "./CartodiagramVectorLayer";
import CartogramVectorLayer from "./CartogramVectorLayer";
import WikimediaLayer from './WikimediaLayer';
import ColoredLayer from "./ColoredLayer";
import _ from "lodash";
import {removeItemByIndex, addItemToIndex, addItem} from '../../../../../utils/stateManagement';
import {defaultVectorStyle} from "./utils/vectorStyle";
import WmtsLayer from "../../WorldWindMap/layers/WmtsLayer";

const {Location, Sector, Color, ShapeAttributes} = WorldWind;

/**
 * Add layer to given layers collection
 * @param layers {Array}
 * @param layerData {Object}
 * @param [position] {number}
 */
function addLayer(layers, layerData, position) {
	if (layerData){
		let layer = getLayerByType(layerData);
		if (layer) {
			if (position || position === 0) {
				return addItemToIndex(layers, position, layer)
			} else {
				return addItem(layers, layer)
			}
		} else {
			return layers;
		}
	} else {
		throw new Error("WorldWindMap/layers/helpers#addLayer: Layer data missing!");
		return layers;
	}
}

/**
 * Return layer index
 * @param layers {Array}
 * @param layerKey {string}
 * @returns {null | Layer}
 */
function findLayerIndexByKey(layers, layerKey) {
	let layer = _.findIndex(layers, {key: layerKey});
	return layer ? layer : null;
}

/**
 * Remove layer from given World Window
 * @param layers {Array}
 * @param layerKey {string}
 */
function removeLayer(layers, layerKey) {
	let layerIndex = findLayerIndexByKey(layers, layerKey);
	if (layerIndex > -1){
		return removeItemByIndex(layers, layerIndex);
	} else {
		return layers;
	}
}

/**
 * Return layer, if exists in given wwd
 * @param layers {Array}
 * @param layerKey {string}
 * @returns {null | Layer}
 */
function findLayerByKey(layers, layerKey) {
	let layer = _.find(layers, {key: layerKey});
	return layer ? layer : null;
}

/**
 * Return layer instance by given type
 * @param layerData {Object}
 * @param type {?string}
 * @param layerData.type {string}
 * @returns {ExtendedWmsLayer | ExtendedOsmLayer | ColoredLayer | OsmLayer}
 */
function getLayerByType(layerData, type){
	if (layerData && (layerData.type || type)){
		switch (type || layerData.type){
			case "wikimedia":
				return new WikimediaLayer({
					attribution: "Wikimedia maps - Map data \u00A9 OpenStreetMap contributors",
					sourceObject: {
						host: "maps.wikimedia.org",
						path: "osm-intl",
						protocol: "https"
					}
				});
			case "bingAerial":
				return new WorldWind.BingAerialLayer();
			case "wms":
				return getWmsLayer(layerData);
			case "wmts":
				return getWmtsOsmBasedLayer(layerData);
			case "colored":
				return getColoredLayer(layerData);
			case "vector":
				return getVectorLayer(layerData);
			case "vector-absolute":
				return getCartodiagramVectorLayer(layerData);
			case "vector-relative":
				return getCartogramVectorLayer(layerData);
			case "wmts-new":
				return new WmtsLayer(layerData);
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
		version: layerData.version ? layerData.version : "1.3.0",
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
 * @param layerData.mapServerUrl {string}
 * @returns {ExtendedWmsLayer}
 */
function getVectorLayer(layerData) {
	const layer = new ExtendedRenderableLayer({
		key: layerData.key,
		layerName: layerData.layerName,
		spatialIdKey: layerData.spatialIdKey ? layerData.spatialIdKey : layerData.spatialRelationsData && layerData.spatialRelationsData.fidColumnName,
		attributeIdKey: layerData.attributeIdKey ? layerData.attributeIdKey : layerData.attributeRelationsData && layerData.attributeRelationsData.fidColumnName,
		...layerData,
	}, defaultVectorStyle);

	return layer;
}

function getCartogramVectorLayer(layerData) {
	const layer = new CartogramVectorLayer({
		key: layerData.key,
		layerName: layerData.layerName,
		spatialIdKey: layerData.spatialRelationsData.fidColumnName,
		attributeIdKey: layerData.attributeRelationsData.fidColumnName,
		...layerData,
	}, defaultVectorStyle);

	return layer;
}

function getCartodiagramVectorLayer(layerData) {
	const layer = new CartodiagramVectorLayer({
		key: layerData.key,
		layerName: layerData.layerName,
		spatialIdKey: layerData.spatialRelationsData.fidColumnName,
		attributeIdKey: layerData.attributeRelationsData.fidColumnName,
		...layerData,
	}, defaultVectorStyle);

	return layer;
}

/**
 * @param layerData {Object}
 * @param layerData.name {string}
 * @param layerData.layerName {string}
 * @param layerData.attribution {string}
 * @param layerData.layerName {string}
 * @param layerData.nameInternal {string}
 * @param layerData.tableName {string}
 * @param layerData.mapServerUrl {string}
 * @returns {ExtendedWmsLayer}
 */
function getWmsVectorLayer(layerData) {
	const numLevels = 18;
	
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
		service: layerData.mapServerConfig.wmsMapServerUrl,
		size: 256,
		styleNames: layerData.styles,
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

export default {
	addLayer,
	findLayerByKey,
	getLayerByType,
	removeLayer
}
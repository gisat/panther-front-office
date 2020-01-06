import WorldWind from 'webworldwind-esa';

import VectorLayer from './VectorLayer';
import WikimediaLayer from './WikimediaLayer';
import WmsLayer from './WmsLayer';
import WmtsLayer from './WmtsLayer';
import LargeDataLayer from "./LargeDataLayerSource/LargeDataLayer";
import _ from "lodash";
import {DEFAULT_SIZE} from "../../../../../utils/mapStyles";

function getLayerByType(layerDefinition, wwd, onHover, onClick){
	if (layerDefinition.type){
		switch (layerDefinition.type){
			case "worldwind":
				switch (layerDefinition.options.layer){
					case "bingAerial":
						return new WorldWind.BingAerialLayer(null);
					case "bluemarble":
						return new WorldWind.BMNGLayer();
					case "wikimedia":
						return new WikimediaLayer({
							attribution: "Wikimedia maps - Map data \u00A9 OpenStreetMap contributors",
							sourceObject: {
								host: "maps.wikimedia.org",
								path: "osm-intl",
								protocol: "https"
							}
						});
					default:
						return null;
				}
			case "wmts":
				return new WmtsLayer(layerDefinition);
			case "wms":
				return new WmsLayer(layerDefinition);
			case "vector":
				return getVectorLayer(layerDefinition, wwd, onHover, onClick);
			default:
				return null;
		}
	} else {
		return null;
	}
}

function getVectorLayer(layerDefinition, wwd, onHover, onClick) {
	const url = layerDefinition.options && layerDefinition.options.url;
	const numOfFeatures = layerDefinition.options && layerDefinition.options.features && layerDefinition.options.features.length;
	const key = layerDefinition.key || 'Vector layer';
	const layerKey = layerDefinition.layerKey || key;

	let options = {
		...layerDefinition.options,
		key,
		layerKey,
		onHover,
		onClick
	};

	// TODO better deciding
	if (url || numOfFeatures > 499) {
		options.pointHoverBuffer = DEFAULT_SIZE; // in px TODO pass pointHoverBuffer
		return new LargeDataLayer(wwd, options, layerDefinition);
	} else {
		return new VectorLayer(layerDefinition, options);
	}
}

function updateVectorLayer(layerDefinition, wwd, onHover, onClick) {
	let mapLayer = null;
	let layerKey = layerDefinition.layerKey;
	let worldWindLayer = _.find(wwd.layers, (lay) => {
		return lay.pantherProps && lay.pantherProps.layerKey && (lay.pantherProps.layerKey === layerKey);
	});

	if (!worldWindLayer) {
		mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
	} else {
		let prevFeatures = worldWindLayer.pantherProps.features;
		let nextFeatures = layerDefinition.options.features;

		if (prevFeatures === nextFeatures) {
			mapLayer = worldWindLayer;
			// TODO still needed?
			// let prevHoveredKeys = worldWindLayer.pantherProps.hovered && worldWindLayer.pantherProps.hovered.keys;
			// let nextHoveredKeys = layerDefinition.options.hovered && layerDefinition.options.hovered.keys;
			// if (prevHoveredKeys !== nextHoveredKeys) {
			// 	worldWindLayer.updateHoveredKeys(nextHoveredKeys);
			// }
		}
		else {
			worldWindLayer.removeListeners();
			mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
		}
	}

	return mapLayer;
}

export default {
	getLayerByType,
	updateVectorLayer
}
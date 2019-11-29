import WorldWind from 'webworldwind-esa';

import VectorLayer from './VectorLayer';
import WikimediaLayer from './WikimediaLayer';
import WmsLayer from './WmsLayer';
import WmtsLayer from './WmtsLayer';
import LargeDataLayer from "./LargeDataLayerSource/LargeDataLayer";
import _ from "lodash";

function getLayerByType(layerDefinition, wwd, onHover){
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
				return getVectorLayer(layerDefinition, wwd, onHover);
			default:
				return null;
		}
	} else {
		return null;
	}
}

function getVectorLayer(layerDefinition, wwd, onHover) {
	const url = layerDefinition.options && layerDefinition.options.url;
	const numOfFeatures = layerDefinition.options && layerDefinition.options.features && layerDefinition.options.features.length;
	const key = layerDefinition.key || 'Vector layer';
	const layerKey = layerDefinition.layerKey || key;

	let options = {
		...layerDefinition.options,
		key,
		layerKey,
		onHover
	};

	// TODO better deciding
	if (url || numOfFeatures > 499) {
		options.pointHoverBuffer = 20; // in px TODO pass pointHoverBuffer
		return new LargeDataLayer(wwd, options, layerDefinition);
	} else {
		return new VectorLayer(layerDefinition, options);
	}
}

function updateVectorLayer(layerDefinition, wwd, onHover) {
	let mapLayer = null;
	let layerKey = layerDefinition.layerKey;
	let worldWindLayer = _.find(wwd.layers, (lay) => {
		return lay.pantherProps && lay.pantherProps .layerKey && (lay.pantherProps.layerKey === layerKey);
	});

	if (!worldWindLayer) {
		mapLayer = getLayerByType(layerDefinition, wwd, onHover);
	} else {

		// TODO better comparison than stringify?
		let prevFeatures = JSON.stringify(worldWindLayer.pantherProps.features);
		let nextFeatures = JSON.stringify(layerDefinition.options.features);

		if (prevFeatures === nextFeatures) {
			mapLayer = worldWindLayer;
			let prevHovered = JSON.stringify(worldWindLayer.pantherProps.hovered);
			let nextHovered = JSON.stringify(layerDefinition.options.hovered);
			if (prevHovered !== nextHovered) {
				worldWindLayer.updateHovered(layerDefinition.options.hovered);
			}
		}
		else {
			mapLayer = getLayerByType(layerDefinition, wwd, onHover);
		}
	}

	return mapLayer;
}

export default {
	getLayerByType,
	updateVectorLayer
}
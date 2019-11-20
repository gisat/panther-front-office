import WorldWind from 'webworldwind-esa';

import VectorLayer from './VectorLayer';
import WikimediaLayer from './WikimediaLayer';
import WmsLayer from './WmsLayer';
import WmtsLayer from './WmtsLayer';
import LargeDataLayer from "./LargeDataLayerSource/LargeDataLayer";

const {RenderableLayer} = WorldWind;


function getLayerByType(layer, wwd){
	if (layer.type){
		switch (layer.type){
			case "worldwind":
				switch (layer.options.layer){
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
				return new WmtsLayer(layer);
			case "wms":
				return new WmsLayer(layer);
			case "vector":
				const url = layer.options && layer.options.url;
				const numOfFeatures = layer.options && layer.options.features && layer.options.features.length;

				// TODO better deciding
				if (url || numOfFeatures > 10) {
					let renderableLayer = new RenderableLayer(layer.key || 'Large data layer');
					let options = {
						...layer.options,
						renderableLayer,
						pointHoverBuffer: 0.05,
						sizeColumnId: null
					};
					return new LargeDataLayer(wwd, options);
				} else {
					return new VectorLayer(layer);
				}
			default:
				return null;
		}
	} else {
		return null;
	}
}

export default {
	getLayerByType
}
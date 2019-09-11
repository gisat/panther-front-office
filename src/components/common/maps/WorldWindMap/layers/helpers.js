import WorldWind from 'webworldwind-esa';

import VectorLayer from './VectorLayer';
import WikimediaLayer from './WikimediaLayer';
import WmsLayer from './WmsLayer';
import WmtsLayer from './WmtsLayer';


function getLayerByType(layer){
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
				return new VectorLayer(layer);
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
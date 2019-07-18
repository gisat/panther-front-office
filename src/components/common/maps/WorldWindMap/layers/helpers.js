import WorldWind from 'webworldwind-esa';

import WikimediaLayer from './WikimediaLayer';
import WmsLayer from './WmsLayer';


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
			case "wms":
				return new WmsLayer(layer);
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
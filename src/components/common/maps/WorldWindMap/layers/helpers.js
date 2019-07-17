import WikimediaLayer from './WikimediaLayer';


function getLayerByType(type){
	if (type){
		switch (type){
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
	} else {
		return null;
	}
}

export default {
	getLayerByType
}
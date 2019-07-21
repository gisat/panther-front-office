import L from 'leaflet';

function getLayerByType(layer) {
	if (layer.type){
		switch (layer.type) {
			// todo move wikimedia to wmts
			case 'worldwind':
				if (layer.options.layer === 'wikimedia') {
					return L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png');
				}
				return L.tileLayer(layer.options.urls[0]);
			case 'wmts':
				return L.tileLayer(layer.options.urls[0]); // todo solve url templates in world wind
			case 'wms':
				// todo add other params
				return L.tileLayer.wms(layer.options.url, {
					layers: layer.options.params.layers,
					format: layer.options.params.imageFormat || 'image/png',
					transparent: true,
					opacity: layer.opacity || 1
				});
			case 'vector':
				return L.geoJSON(layer.options.features, {style: {opacity: layer.opacity || 1}});
			default:
				return null;
		}
	} else {
		return null
	}
}

export default {
	getLayerByType
}
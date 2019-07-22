import L from 'leaflet';

function getLayerByType(layer) {
	if (layer.type){
		switch (layer.type) {
			case 'wmts':
				return L.tileLayer(layer.options.url);
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
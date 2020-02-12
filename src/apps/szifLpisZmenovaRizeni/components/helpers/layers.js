const getSentinelRasterSpatialDataSource = (spatialDataSourceKey, name, time, layer) => {
	return {
			key: spatialDataSourceKey,
			title: `Sentinel-2 (${layer.time})`,
			type: "wms",
			options: {
				url: layer.options.url,
				params: {
					...layer.options.params,
					layers: layer.options.layers,
					time: layer.time,
				}
			}
	}
}

const getWMSRasterSpatialDataSource = (layer) => {
	let label
	if(layer.options.title === 'Ortofoto východ/západ') {
		const ortoLabelParts = layer.key.split('_');
		label = `Ortofoto - ${ortoLabelParts[1]} (${ortoLabelParts[2]})`	
	} else {
		label = layer.options.title || '';
	}
	return {
			key: layer.key,
			title: label,
			type: "wms",
			options: {
				"url": layer.options.url,
				params: {
					...layer.options.params
				}
			}
	}
}

const getLayerConfig = (layer) => {
	if(layer && layer.options && layer.options.type && layer.options.type === 'sentinel') {
		return getSentinelRasterSpatialDataSource(layer.key,  'sentinel', layer.time, layer);
	}

	if(layer && layer.options && layer.options.type && layer.options.type === 'wms') {
		return getWMSRasterSpatialDataSource(layer);
	}
}

export default {
    getLayerConfig,
}
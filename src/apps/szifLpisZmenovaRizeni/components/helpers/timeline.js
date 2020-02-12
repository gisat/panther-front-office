const getBaseLayers = (baseLayersCfg = [], activeWmsKey) => {
	return baseLayersCfg.map((layerCfg, index) => {
		return {
			layerTemplateKey: layerCfg.key,
			period: layerCfg.period,
			color: 'rgba(0, 237, 3, 0.7)',
			activeColor: 'rgba(255, 0, 0, 0.5)',
			active: layerCfg.key === activeWmsKey,
			title: layerCfg.title,
			info: layerCfg.info,
			options: {
				type: 'baselayer',
				info: layerCfg.info,
				title: layerCfg.title,
				...layerCfg.options
			},
			zIndex: layerCfg.zIndex,
		}
	})
}

const getSentinelLayers = (dates = [], activeIndex, zIndex, layerTemplateKey, title, url, layers) => {
	const ownLayers = [];
	ownLayers.push({
		layerTemplateKey,
		period: dates.map((date) => {
			return {
				start: date,
				end: date,
			}
		}),
		color: 'rgba(0, 237, 3, 0.7)',
		activeColor: 'rgba(255, 0, 0, 0.5)',
		active: true,
		title,
		options: {
			activePeriodIndex: activeIndex,
			type: 'sentinel',
			url: url,
			title: title,
			layers: layers,
		},
		zIndex,
	})
	return ownLayers
}

export default {
    getBaseLayers,
    getSentinelLayers,
}
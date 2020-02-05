const getToggledLayers = (activeLayers, layer) => {
	const layerActive = activeLayers.some((l) => l.key === layer.key);
	let updatedLayers = [];
	if(layerActive) {
		updatedLayers = [...activeLayers.filter(l => l.key !== layer.key)];
	} else {
		if(layer.options.type === 'sentinel') {
			//remove all sentinel layers before add new one
			const sentinelLayer = {
				key: layer.key,
				layerTemplateKey: layer.layerTemplateKey,
				time: layer.start.format("YYYY-MM-DD"), 
				options: layer.options,
			}
			// clear previous wms layers
			// updatedLayers = [...activeLayers.filter(l => l.options.type !== 'sentinel'), sentinelLayer];
			updatedLayers = [sentinelLayer];
		} else {
			const baseLayer = {
				key: layer.key,
				layerTemplateKey: layer.layerTemplateKey,
				time: layer.start.format("YYYY-MM-DD"), 
				options: layer.options,
			}
			// clear previous wms layers
			// updatedLayers = [...activeLayers.filter(l => l.options.type !== 'wms'), baseLayer];
			updatedLayers = [baseLayer];
		}
	}
    return updatedLayers
};

export default {
    getToggledLayers,
}
const cartoDbLight = {
	key: 'cartoDbBasemap',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
	}
};

const cartoDbVoyagerLight = {
	key: 'cartoDbBasemap',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
	}
};

export default {
	cartoDbLight,
	cartoDbVoyagerLight
}

export const fidColumnName = 'ID_DPB';
export const nameColumnName = 'NKOD_DPB';
export const climRegionColumnName = 'CLIM_LABEL';
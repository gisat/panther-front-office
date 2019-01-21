export const backgroundCuzk = {
	key: "ortofoto-uuid",
	data: {
		key: "ortofoto-uuid",
		name: "ČÚZK Ortofoto",
		type: "wms",
		url: "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?",
		layerNames: "GR_ORTFOTORGB",

		attribution: "<a href='https://cuzk.cz'>@ČÚZK</a>",
		numLevels: 14,
		opacity: 1,
		version: "1.3.0",
		customParams: null
	}
};

export const backgroundStamen = {
	key: "stamen-uuid",
	data: {
		key: "stamen-uuid",
		name: "Stamen terrain",
		type: "wmts-osm-based",
		url: "http://tile.stamen.com/terrain",

		attribution: "Data © <a href='https://osm.org'>OpenStreetMap contributors</a> | Map tiles by <a href='https://stamen.com/'>Stamen design</a>, under <a href='https://creativecommons.org/licenses/by/3.0/'>CC BY 3.0</a>",
		numLevels: null,
		opacity: null,
		prefixes: ["a", "b", "c"]
	}
};

const prgUrbanAtlas = {
	key: "prgUrbanAtlas-uuid",
	data: {
		key: "prgUrbanAtlas-uuid",
		name: "Urban Atlas",
		type: "wms",
		url: "http://192.168.2.205/backend/geoserver/wms",

		attribution: "Urban Atlas",
		layerNames: "geonode:pucs_cd4cc9e2b0024caabcccfcbc6f6965d8",
		styleNames: "pucs_urban_atlas",
		opacity: 0.7
	}
};

const prgUHI = {
	key: "prgUHI-uuid",
	data: {
		key: "prgUHI-uuid",
		name: "UHI",
		type: "wms",
		url: "http://192.168.2.205/backend/geoserver/wms",

		attribution: "UHI",
		layerNames: "geonode:pucs_2977611954154704abbcb6d072dbae02",
		styleNames: "pucs_uhi",
		opacity: 0.7
	}
};

const prgHWD = {
	key: "prgHWD-uuid",
	data: {
		key: "prgHWD-uuid",
		name: "HWD",
		type: "wms",
		url: "http://192.168.2.205/backend/geoserver/wms",

		attribution: "HWD",
		layerNames: "geonode:pucs_90da7b76f8c0407589bcfd93cdbe561d",
		styleNames: "pucs_hwd",
		opacity: 0.7
	}
};

export const layersInitial = [prgUrbanAtlas, prgUHI];
export const layersChange1 = [prgHWD];
export const layersChange2 = [prgHWD, prgUHI];
export const layersChange3 = [prgUHI, prgHWD, prgUrbanAtlas];
export const backgroundCuzk = {
	key: "ortofoto-uuid",
	data: {
		/* from template */
		name: "ČÚZK Ortofoto",
		opacity: 1,

		/* from data source */
		type: "wms",
		key: "ortofoto-uuid",
		attribution: "<a href='https://cuzk.cz'>@ČÚZK</a>",
		url: "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?",

		layers: "GR_ORTFOTORGB",
		styles: "",
		configuration: {
			params: {
				version: "1.3.0",
				imageFormat: "image/png"
			},
			numLevels: 14,
			getCapabilitiesRequest: false,
			getFeatureInfo: false
		}
	}
};

export const backgroundStamen = {
	key: "stamen-uuid",
	data: {
		/* from template */
		name: "Stamen terrain",
		type: "wmts",

		/* from data source */
		key: "stamen-uuid",
		urls: ["http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://b.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://c.tile.stamen.com/terrain/{z}/{x}/{y}.png"],
		attribution: "Data © <a href='https://osm.org'>OpenStreetMap contributors</a> | Map tiles by <a href='https://stamen.com/'>Stamen design</a>, under <a href='https://creativecommons.org/licenses/by/3.0/'>CC BY 3.0</a>",
	}
};

const prgUrbanAtlas = {
	key: "prgUrbanAtlas-uuid",
	data: {
		key: "prgUrbanAtlas-uuid",
		name: "Urban Atlas",
		type: "wms",
		url: "http://192.168.2.205/backend/geoserver/wms",
		opacity: 0.7,
		attribution: "Urban Atlas",
		layers: "geonode:pucs_cd4cc9e2b0024caabcccfcbc6f6965d8",
		styles: "pucs_urban_atlas"
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
		layers: "geonode:pucs_2977611954154704abbcb6d072dbae02",
		styles: "pucs_uhi",
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
		layers: "geonode:pucs_90da7b76f8c0407589bcfd93cdbe561d",
		styles: "pucs_hwd",
		opacity: 0.7
	}
};

export const layersInitial = [prgUrbanAtlas, prgUHI];
export const layersChange1 = [prgHWD];
export const layersChange2 = [prgHWD, prgUHI];
export const layersChange3 = [prgUHI, prgHWD, prgUrbanAtlas];
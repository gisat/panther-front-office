export const getSubstate = (state) => state.spatialDataSources;

export const BASIC_STATE = {
	spatialDataSources: {
		byKey: {
			ds1: {
				key: 'ds1',
				data: {
					layers: "Ortofoto",
					type: "wms",
					url: "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?"
				}
			},
			ds2: {
				key: 'ds2',
				data: {
					type: "wmts",
					urls: ["http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://b.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://c.tile.stamen.com/terrain/{z}/{x}/{y}.png"]
				}
			},
			ds3: {
				key: 'ds3',
				data: {
					layers: "UHI",
					type: "wms",
					url: "http://192.168.2.205/backend/geoserver/wms"
				}
			},
		}
	}
};

export const EMPTY_DATA_STATE = {...BASIC_STATE, spatialDataSources: {...BASIC_STATE.byKey, byKey: {}}};
export const NULL_DATA_STATE = {...BASIC_STATE, spatialDataSources: {...BASIC_STATE.byKey, byKey: null}};
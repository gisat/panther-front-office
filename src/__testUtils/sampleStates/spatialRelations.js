export const getSubstate = (state) => state.spatialRelations;

export const BASIC_STATE = {
	spatialRelations: {
		byKey: {
			rel1: {
				key: 'rel1',
				data: {
					caseKey: null,
					dataSourceKey: "ds1",
					layerTemplateKey: "lt1",
					periodKey: null,
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope1"
				}
			},
			rel2: {
				key: 'rel2',
				data: {
					caseKey: null,
					dataSourceKey: "ds2",
					layerTemplateKey: "lt1",
					periodKey: null,
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope1"
				}
			},
			rel3: {
				key: 'rel3',
				data: {
					caseKey: null,
					dataSourceKey: "ds3",
					layerTemplateKey: "lt2",
					periodKey: null,
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope1"
				}
			},
			rel4: {
				key: 'rel4',
				data: {
					caseKey: null,
					dataSourceKey: "ds4",
					layerTemplateKey: "lt3",
					periodKey: null,
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope2"
				}
			},
			rel5: {
				key: 'rel5',
				data: {
					caseKey: null,
					dataSourceKey: "ds2",
					layerTemplateKey: "lt1",
					periodKey: 'period1',
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope1"
				}
			},
			rel6: {
				key: 'rel6',
				data: {
					caseKey: null,
					dataSourceKey: "ds4",
					layerTemplateKey: "lt1",
					periodKey: 'period1',
					placeKey: null,
					scenarioKey: null,
					scopeKey: "scope1"
				}
			},
		}
	}
};

export const EMPTY_DATA_STATE = {...BASIC_STATE, spatialRelations: {...BASIC_STATE.byKey, byKey: {}}};
export const NULL_DATA_STATE = {...BASIC_STATE, spatialRelations: {...BASIC_STATE.byKey, byKey: null}};
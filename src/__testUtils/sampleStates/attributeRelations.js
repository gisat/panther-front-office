export const getSubstate = (state) => state.attributeRelations;

export const BASIC_STATE = {
	attributeRelations: {
		byKey: {
			rel1: {
				key: 'rel1',
				data: {
					dataSourceKey: "ds1",
					attributeKey: "att1",
					attributeSetKey: null,
					scopeKey: "scope1",
					periodKey: null,
					caseKey: null,
					scenarioKey: null,
					placeKey: null,
					layerTemplateKey: "lt1",
					areaTreeLevelKey: null,
				}
			},
			rel2: {
				key: 'rel2',
				data: {
					dataSourceKey: "ds2",
					attributeKey: "att2",
					attributeSetKey: "attSet1",
					scopeKey: "scope1",
					periodKey: null,
					caseKey: null,
					scenarioKey: null,
					placeKey: null,
					layerTemplateKey: "lt1",
					areaTreeLevelKey: null,
				}
			},
		}
	}
};

export const EMPTY_DATA_STATE = {...BASIC_STATE, attributeRelations: {...BASIC_STATE.byKey, byKey: {}}};
export const NULL_DATA_STATE = {...BASIC_STATE, attributeRelations: {...BASIC_STATE.byKey, byKey: null}};
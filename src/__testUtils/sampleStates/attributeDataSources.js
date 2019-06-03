export const getSubstate = (state) => state.attributeDataSources;

export const BASIC_STATE = {
	attributeDataSources: {
		byKey: {
			ds1: {
				key: 'ds1',
				data: {
					value: 'field'
				}
			},
			ds2: {
				key: 'ds2',
				data: {
					value: 'field'
				}
			},
		}
	}
};

export const EMPTY_DATA_STATE = {...BASIC_STATE, attributeDataSources: {...BASIC_STATE.byKey, byKey: {}}};
export const NULL_DATA_STATE = {...BASIC_STATE, attributeDataSources: {...BASIC_STATE.byKey, byKey: null}};
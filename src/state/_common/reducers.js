import _ from 'lodash';

export const DEFAULT_INITIAL_STATE = {
	activeKey: null,
	byKey: null,
	count: null,
	editedByKey: null,
	indexes: null,
	lastChangedOn: null,
	loading: false,
	loadingKeys: null,
};

export default {
	add: (state, action) => {
		let newData = {...state.byKey};
		if (action.data && action.data.length) {
			action.data.forEach(model => {
				newData[model.key] = {...newData[model.key], ...model};
			});
		}
		return {...state, byKey: newData}
	},

	setActive: (state, action) => {
		return {...state, activeKey: action.activeKey};
	},

	setActiveMultiple: (state, action) => {
		return {...state, activeKeys: action.keys, activeKey: null};
	}
}

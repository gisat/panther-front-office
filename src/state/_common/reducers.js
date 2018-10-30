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

	addIndex: (state, action) => {
		let indexes = [];
		let selectedIndex = {};

		if (state.indexes){
			state.indexes.forEach(index => {
				if (_.isEqual(index.filter, action.filter) && _.isEqual(index.order, action.order)){
					selectedIndex = index;
				} else {
					indexes.push(index);
				}
			});
		}

		let index;
		if (action.data.length){
			index = {...selectedIndex.index};
			action.data.forEach((model, i) => {
				index[action.start + i] = model.key;
			});
		}

		selectedIndex = {
			filter: selectedIndex.filter || action.filter,
			order: selectedIndex.order || action.order,
			count: action.count,
			changedOn: action.changedOn,
			index: index || selectedIndex.index
		};
		indexes.push(selectedIndex);

		return {...state, indexes: indexes};
	},


	remove: (state, action) => {
		let newData = state.byKey ? _.omit(state.byKey, action.keys) : null;
		return {...state, byKey: newData}
	},

	removeEdited: (state, action) => {
		let newData = state.editedByKey ? _.omit(state.editedByKey, action.keys) : null;
		return {...state, editedByKey: newData}
	},

	removeEditedActive: (state) => {
		let newData = _.omit(state.editedByKey, state.activeKey);
		return {...state, editedByKey: newData}
	},

	removeEditedProperty: (state, action) => {
		let newEditedModelData = state.editedByKey && state.editedByKey[action.key] && state.editedByKey[action.key].data ?
			_.omit(state.editedByKey[action.key].data, action.property) : null;


		if (newEditedModelData){
			return {
				...state,
				editedByKey: {
					...state.editedByKey,
					[action.key]: {
						...state.editedByKey[action.key],
						data: newEditedModelData
					}
				}
			}
		} else {
			return state;
		}

	},

	setActive: (state, action) => {
		return {...state, activeKey: action.key, activeKeys: null};
	},

	setActiveMultiple: (state, action) => {
		return {...state, activeKeys: action.keys, activeKey: null};
	},

	updateEdited: (state, action) => {
		let newEditedData = {...state.editedByKey};
		if (action.data && action.data.length) {
			action.data.forEach(model => {
				if (newEditedData[model.key]){
					newEditedData[model.key] = {
						...newEditedData[model.key],
						data: {
							...newEditedData[model.key].data,
							...model.data
						}
					}
				} else {
					newEditedData[model.key] = model;
				}
			});
		}
		return {...state, editedByKey: newEditedData};
	}
}
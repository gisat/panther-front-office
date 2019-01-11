import _ from 'lodash';

export const DEFAULT_INITIAL_STATE = {
	activeKey: null,
	byKey: null,
	count: null,
	editedByKey: null,
	indexes: null,
	inUse: {
		indexes: null,
		keys: null
	},
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
				delete newData[model.key].outdated;
				delete newData[model.key].unreceived;
			});
		}
		return {...state, byKey: newData}
	},

	addUnreceivedKeys: (state, action) => {
		let newData = {...state.byKey};
		if (action.keys && action.keys.length) {
			action.keys.forEach(key => {
				newData[key] = {key, unreceived: true};
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

	// TODO It will be removed along with Ext
	initializeForExt: (state) => {
		return {...state, initializedForExt: true}
	},

	registerUseIndexed: (state, action) => {
		// TODO save link to index?
		// replace use - todo option to add to use?
		let newUse = {
			filterByActive: action.filterByActive,
			filter: action.filter,
			order: action.order,
			start: action.start,
			length: action.length
		};
		return {...state, inUse: {...state.inUse, indexes: {...state.inUse.indexes, [action.componentId]: newUse}}};
	},

	useIndexedClear: (state, action) => {
		if (state.inUse && state.inUse.indexes && state.inUse.indexes.hasOwnProperty(action.componentId)) {
			let indexes = {...state.inUse.indexes};
			delete indexes[action.componentId];
			return {...state, inUse: {...state.inUse, indexes: _.isEmpty(indexes) ? null : indexes}};
		} else {
			// do not mutate if no index was changed
			return state;
		}
	},

	useKeysRegister: (state, action) => {
		return {
			...state,
			inUse: {
				...state.inUse,
				keys: {
					...state.inUse.keys,
					[action.componentId]: action.keys
				}
			}
		}
	},

	useKeysClear: (state, action) => {
		let keys = {...state.inUse.keys};
		delete keys[action.componentId];

		return {
			...state,
			inUse: {
				...state.inUse,
				keys: _.isEmpty(keys) ? null : keys
			}
		}
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
		let newData = null;
		if (state.editedByKey){
			newData = _.omit(state.editedByKey, state.activeKey);
		}
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
	},

	clearIndexes: (state, action) => {
		let indexes = _.map(state.indexes, index => {
			return {...index, index: null, count: null}
		});

		return {
			...state,
			indexes: indexes.length ? indexes : null
		}
	},

	dataSetOutdated: (state, action) => {
		if (state.byKey){
			let byKey = {};
			_.each(state.byKey, (model, key) => {
				byKey[key] = {
					...model,
					outdated: true
				}
			});
			return {
				...state,
				byKey
			};
		} else {
			return state;
		}
	},

	cleanupOnLogout: (state, action) => {
		if (state.byKey){
			let byKey = {};
			_.each(state.byKey, (model, key) => {
				if(model.permissions && model.permissions.guest.get) {
					byKey[key] = {
						...model,
						permissions: {
							guest: model.permissions.guest
						}
					}
				}
			});
			return {...state, byKey};
		} else {
			return state
		}
	}
}
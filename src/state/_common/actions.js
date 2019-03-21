import _ from "lodash";
import path from "path";
import moment from 'moment';

import request from './request';
import commonHelpers from './helpers';
import commonSelectors from './selectors';
import Select from "../Select";
import ActionTypes from "../../constants/ActionTypes";

import Action from '../Action';
import utils from '../../utils/utils';

const PAGE_SIZE = 10;
const DEFAULT_CATEGORY_PATH = 'metadata';


// ============ factories ===========

const add = (action) => {
	return (data) => {
		return dispatch => {
			if (!_.isArray(data)) data = [data];
			dispatch(action(data));
		};
	}
};

const addIndex = (action) => {
	return (filter, order, count, start, data, changedOn) => {
		return dispatch => {
			dispatch(action(filter, order, count, start, data, changedOn));
		};
	}
};

const apiDelete = (dataType, data) => {
	return dispatch => {
		const apiPath = 'backend/rest/metadata';
		const payload = {
			data: {
				[dataType]: data
			}
		};
		return request(apiPath, 'DELETE', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					const itemsDeleted = result.data[dataType];
					if (itemsDeleted.length > 0) {
						return result;
					} else {
						console.warn(`No data updated for ${dataType} metadata type`);
					}
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
};

const apiUpdate = (getSubstate, dataType, actionTypes, categoryPath, editedData) => {
	return dispatch => {
		const apiPath = 'backend/rest/metadata';
		const payload = {
			data: {
				[dataType]: editedData
			}
		};
		return request(apiPath, 'PUT', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					dispatch(receiveUpdated(getSubstate, actionTypes, result, dataType));
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
};

const updateEdited = (getSubstate, actionTypes) => {
	return (modelKey, key, value) => {
		return (dispatch, getState) => {
			if (!getSubstate) {
				return dispatch(actionGeneralError('common/actions#updateEdited: setSubstate parameter is missing!'));
			}
			if (!actionTypes) {
				return dispatch(actionGeneralError('common/actions#updateEdited: actionTypes parameter is missing!'));
			}
			if (!modelKey) {
				return dispatch(actionGeneralError('common/actions#updateEdited: Model key is missing!'));
			}
			if (!key) {
				return dispatch(actionGeneralError('common/actions#updateEdited: Property key is missing!'));
			}

			let originalModel = commonSelectors.getByKey(getSubstate)(getState(), modelKey);

			// delete property from edited, if the value in update is the same as in state
			if (originalModel && (value === originalModel.data[key] || (!originalModel.data[key] && value.length === 0))){
				dispatch(actionRemovePropertyFromEdited(actionTypes, modelKey, key));
			} else {
				dispatch(actionUpdateEdited(actionTypes, [{key: modelKey, data: {[key]: value}}]));
			}
		};
	}
};

const deleteItem = (getSubstate, dataType, actionTypes) => {
	return (item) => {
		return (dispatch, getState) => {
			if (!item) {
				return dispatch(actionGeneralError('common/actions#deleteItem: item to delete is missing!'));
			}

			if (!item.key) {
				return dispatch(actionGeneralError('common/actions#deleteItem: item key to delete is missing!'));
			}

			dispatch(apiDelete(dataType, [{key: item.key}])).then((result) => {
				const data = result.data[dataType];
				const deletedKeys = data.map(d => d.key);
				//Check if item deleted
				if(deletedKeys.includes(item.key)) {
					// mark deleted items by "deleted" date
					const deleteDate = moment(new Date().toString()).utc().format();
					deletedKeys.forEach((key) => 
						dispatch(actionMarkAsDeleted(actionTypes, key, deleteDate))
					);

					//refresh proper indexes
					const state = getState();
					const indexes = commonSelectors.getIndexesByFilteredItem(getSubstate)(state, item);
					indexes.forEach(index => {
						//invalidate data
						dispatch(actionClearIndex(actionTypes, index.filter, index.order));
						//refresh data
						dispatch(refreshIndex(getSubstate, dataType, index.filter, index.order, actionTypes));
					})
				}
			});
		}
	}
};

const saveEdited = (getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) => {
	return (key) => {
		return (dispatch, getState) => {
			if (!getSubstate) {
				return dispatch(actionGeneralError('common/actions#saveEdited: setSubstate parameter is missing!'));
			}
			if (!dataType) {
				return dispatch(actionGeneralError('common/actions#saveEdited: dataType parameter is missing!'));
			}
			if (!actionTypes) {
				return dispatch(actionGeneralError('common/actions#saveEdited: actionTypes parameter is missing!'));
			}
			if (!key) {
				return dispatch(actionGeneralError('common/actions#saveEdited: Model key is missing!'));
			}
			let state = getState();
			let saved = commonSelectors.getByKey(getSubstate)(state, key);
			let edited = commonSelectors.getEditedByKey(getSubstate)(state, key);

			if (saved) {
				// update
				dispatch(apiUpdate(getSubstate, dataType, actionTypes, categoryPath, [edited])).then(() => {
					//FIXME - check indexes
				})

			} else {
				// create
				debugger;
			}
		};
	}
};

const useKeys = (getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) => {
	return (keys, componentId) => {
		return dispatch => {
			dispatch(actionUseKeysRegister(actionTypes, componentId, keys));
			dispatch(ensureKeys(getSubstate, dataType, actionTypes, keys, categoryPath));
		};
	}
};

const useIndexed = (getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) => {
	return (filterByActive, filter, order, start, length, componentId) => {
		return (dispatch, getState) => {
			dispatch(actionUseIndexedRegister(actionTypes, componentId, filterByActive, filter, order, start, length));
			let state = getState();
			let fullFilter = commonHelpers.mergeFilters({
				activeApplicationKey: commonSelectors.getActiveKey(state => state.apps)(state),
				activeScopeKey: commonSelectors.getActiveKey(state => state.scopes)(state),
				activePeriodKey: commonSelectors.getActiveKey(state => state.periods)(state),
				activePeriodKeys: commonSelectors.getActiveKeys(state => state.periods)(state),
				activePlaceKey: commonSelectors.getActiveKey(state => state.places)(state),
				activePlaceKeys: commonSelectors.getActiveKeys(state => state.places)(state),
			}, filterByActive, filter);
			return dispatch(ensureIndexed(getSubstate, dataType, fullFilter, order, start, length, actionTypes, categoryPath));
		};
	}
};

const setActiveKeyAndEnsureDependencies = (actionTypes, filterKey) => {
	return key => {
		return dispatch => {
			dispatch(actionSetActiveKey(actionTypes, key));
			dispatch(ensureIndexesWithActiveKey(filterKey));
		};
	};
};
/**
 * If not refresh data, call clearIndex to invalidate data.
 */
function refreshIndex(getSubstate, dataType, filter, order, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return (dispatch, getState) => {
		let state = getState();
		let usesForIndex = commonSelectors.getUsesForIndex(getSubstate)(state, filter, order);
		if (usesForIndex){
			_.each(usesForIndex.uses, (use) => {
				dispatch(ensureIndexed(getSubstate, dataType, usesForIndex.filter, usesForIndex.order, use.start, use.length, actionTypes, categoryPath))
			});
		}
	}
}

function receiveIndexed(actionTypes, result, dataType, filter, order, start) {
		return dispatch => {
			// add data to store
			if (result.data[dataType].length){
				dispatch(actionAdd(actionTypes, result.data[dataType]));
			}

			// add to index
			dispatch(actionAddIndex(actionTypes, filter, order, result.total, start, result.data[dataType], result.changes[dataType]));
		}
}

function requestWrapper(apiPath, method, query, payload, successAction, errorAction) {
	return dispatch => {
		request(apiPath, method, query, payload)
			.then(result => {
				dispatch(successAction(result.data));
			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	}
}

function create(getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return (key) => {
		return (dispatch, getState) => {
			const apiPath = path.join('backend/rest', categoryPath);
			const payload = getCreatePayload(dataType, key);
			return request(apiPath, 'POST', null, payload).then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					const item = result.data[dataType];
					dispatch(actionAdd(actionTypes, item));

					const state = getState();
					const indexes = commonSelectors.getIndexesByFilteredItem(getSubstate)(state, item);
					indexes.forEach(index => {
						//invalidate data
						dispatch(actionClearIndex(actionTypes, index.filter, index.order))
						//refresh data
						dispatch(refreshIndex(getSubstate, dataType, index.filter, index.order, actionTypes));
					})
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
		}
	}
}

function loadAll(dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return dispatch => {
		const apiPath = getAPIPath(categoryPath, dataType);
		let payload = {
			limit: PAGE_SIZE
		};
		request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						dispatch(actionAdd(actionTypes, result.data[dataType]));
					} else {
						// load remaining pages
						let promises = [];
						let remainingPageCount = Math.ceil((result.total - PAGE_SIZE) / PAGE_SIZE);
						for (let i = 0; i < remainingPageCount; i++) {
							let pagePayload = {
								offset: (i + 1) * PAGE_SIZE,
								limit: PAGE_SIZE
							};
							promises.push(request(apiPath, 'POST', null, pagePayload)); //todo what if one fails?
						}
						Promise.all(promises).then(results => {
							let remainingData = _.flatten(results.map(res => res.data[dataType]));
							dispatch(actionAdd(actionTypes, [...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
}

function ensureKeys(getSubstate, dataType, actionTypes, keys, categoryPath = DEFAULT_CATEGORY_PATH){
	return (dispatch, getState) => {
		let state = getState();

		let keysToLoad = commonSelectors.getKeysToLoad(getSubstate)(state, keys);
		if (keysToLoad){
			keysToLoad = _.chunk(keysToLoad, PAGE_SIZE);
			_.each(keysToLoad, keysToLoadPage => {
				dispatch(loadKeysPage(dataType, actionTypes, keysToLoadPage, categoryPath));
			});
		}
	}
}

function ensureIndexed(getSubstate, dataType, filter, order, start, length, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH){
	return (dispatch, getState) => {
		let state = getState();
		let total = commonSelectors.getIndexTotal(getSubstate)(state, filter, order);
		let changedOn = commonSelectors.getIndexChangedOn(getSubstate)(state, filter, order);

		if (total || total === 0){
			let promises = [];
			let indexPage = commonSelectors.getIndexPage(getSubstate)(state, filter, order, start, length);
			let amount = indexPage ? Object.keys(indexPage).length : 0;
			for (let i = 0; i < amount; i += PAGE_SIZE){
				let loadedKeys = [], requestNeeded = false;
				for (let j = 0; j < PAGE_SIZE && (start+i+j) <= total; j++){
					if (indexPage[start + i + j]){
						loadedKeys.push(indexPage[start + i + j]);
					} else {
						requestNeeded = true;
					}
				}
				if (requestNeeded){
					let completeFilter = loadedKeys.length ? {...filter, key: {notin: loadedKeys}} : filter;

					let promise = dispatch(loadIndexedPage(dataType, completeFilter, order, start + i, changedOn, actionTypes, categoryPath))
							.catch((err) => {
								if (err.message === 'Index outdated'){
									dispatch(refreshIndex(getSubstate, dataType, filter, order, actionTypes, categoryPath));
								}
							});
					promises.push(promise);
				}
			}
			return promises.length ? Promise.all(promises) : Promise.resolve();
		} else {
			// we don't have index
			return dispatch(loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes, categoryPath)).then((response) => {
				if (response && response.message){
					// do nothing
				} else {
					return dispatch(ensureIndexed(getSubstate, dataType, filter, order, start + PAGE_SIZE, length - PAGE_SIZE, actionTypes, categoryPath));
				}
			}).catch((err)=>{
				if (err.message === 'Index outdated'){
					dispatch(refreshIndex(getSubstate, dataType, filter, order, actionTypes, categoryPath));
				} else {
					throw new Error(`_common/actions#ensure: ${err}`);
				}
			});
		}
	};
}

function loadKeysPage(dataType, actionTypes, keys, categoryPath = DEFAULT_CATEGORY_PATH) {
	return dispatch => {
		const apiPath = getAPIPath(categoryPath, dataType);

		let payload = {
			filter: {
				key: {
					in: keys
				}
			}
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					throw new Error(result.errors[dataType] || 'no data');
				} else {
					dispatch(receiveKeys(actionTypes, result, dataType, keys));
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	}
}

function loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return dispatch => {
		const apiPath = getAPIPath(categoryPath, dataType);

		let payload = {
			filter: {...filter},
			offset: start -1,
			order: order,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					throw new Error(result.errors[dataType] || 'no data');
				} else if (result.changes && result.changes[dataType] && moment(result.changes[dataType]).isAfter(changedOn)) {
					throw new Error('Index outdated');
				} else {
					dispatch(receiveIndexed(actionTypes, result, dataType, filter, order, start));
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	};
}

function loadFiltered(dataType, actionTypes, filter, categoryPath = DEFAULT_CATEGORY_PATH) {
	return dispatch => {
		const apiPath = getAPIPath(categoryPath, dataType);
		const payload = {
			filter: filter,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						return dispatch(actionAdd(actionTypes, result.data[dataType]));
					} else {
						// load remaining pages
						let promises = [];
						let remainingPageCount = Math.ceil((result.total - PAGE_SIZE) / PAGE_SIZE);
						for (let i = 0; i < remainingPageCount; i++) {
							let pagePayload = {
								filter: filter,
								offset: (i + 1) * PAGE_SIZE,
								limit: PAGE_SIZE
							};
							promises.push(request(apiPath, 'POST', null, pagePayload)); //todo what if one fails?
						}
						return Promise.all(promises).then(results => {
							let remainingData = _.flatten(results.map(res => res.data[dataType]));
							dispatch(actionAdd(actionTypes, [...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
}

function receiveUpdated(getSubstate, actionTypes, result, dataType) {
	return (dispatch, getState) => {
		let data = result.data[dataType];
		if (data.length){
			dispatch(actionAdd(actionTypes, data));
			let editedData = commonSelectors.getEditedAllAsObject(getSubstate)(getState());

			data.forEach(model => {
				let edited = editedData[model.key].data;
				_.forIn(edited, (value, key) => {
					if (model.data[key] === value) {
						dispatch(actionRemovePropertyFromEdited(actionTypes, model.key, key));
					}
				});
			});
		} else {
			console.warn(`No data updated for ${dataType} metadata type`);
		}
	};
}

function receiveKeys(actionTypes, result, dataType, keys) {
	return dispatch => {
		// add data to store
		if (result.data[dataType].length){
			dispatch(actionAdd(actionTypes, result.data[dataType]));
		}

		// add unreceived keys
		_.remove(keys, key => {
			return _.find(result.data[dataType], {key});
		});
		if (keys.length) {
			dispatch(actionAddUnreceivedKeys(actionTypes, keys));
		}
	}
}

function refreshUses(getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return () => {
		return(dispatch, getState) => {
			dispatch(actionClearIndexes(actionTypes));

			let state = getState();

			let usedKeys = commonSelectors.getUsedKeys(getSubstate)(state);
			dispatch(ensureKeys(getSubstate, dataType, actionTypes, usedKeys, categoryPath));

			let usedIndexPages = commonSelectors.getUsedIndexPages(getSubstate)(state);

			_.each(usedIndexPages, (usedIndexPage) => {
				_.each(usedIndexPage.uses, (use) => {
					dispatch(ensureIndexed(getSubstate, dataType, usedIndexPage.filter, usedIndexPage.order, use.start, use.length, actionTypes, categoryPath))
				});
			})
		}
	}
}

function ensureIndexesWithFilterByActive(getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) {
	return filterByActive => {
		return (dispatch, getState) => {

			let state = getState();
			let usedIndexes = commonSelectors.getUsesWithActiveDependency(getSubstate)(state, filterByActive);

			_.each(usedIndexes, (usedIndex) => {
				_.each(usedIndex.uses, (use) => {
					dispatch(ensureIndexed(getSubstate, dataType, usedIndex.filter, usedIndex.order, use.start, use.length, actionTypes, categoryPath))
				});
			})

		}
	}
}

function ensureIndexesWithActiveKey(filterKey, categoryPath = DEFAULT_CATEGORY_PATH) {
		return dispatch => {

			let filterByActive = {
				[filterKey]: true
			};

			// dispatch ensureIndexesWithFilterByActive on all stores implementing it
			_.each(Action, actions => {
				if (actions.hasOwnProperty('ensureIndexesWithFilterByActive')) {
					dispatch(actions.ensureIndexesWithFilterByActive(filterByActive, categoryPath))
				}
			});

		};
}

// ============ common namespace actions ===========

function actionDataSetOutdated() {
	return {
		type: ActionTypes.COMMON.DATA.SET_OUTDATED
	}
}

function actionGeneralError(e) {
	console.error('common/actions error', e);
	return {type: 'ERROR'};
}

// ============ specific store namespace actions ===========

const creator = (action) => {
	return (actionTypes) => {
		return (...args) => {
			return dispatch => {
				dispatch(action(actionTypes, ...args));
			};
		};
	};
};

function action(actionTypes, type, payload) {
	type = type.split('.');
	_.each(type, pathSegment => {
		if (!actionTypes.hasOwnProperty(pathSegment)) {
			console.error('common/actions#action: Action not in namespace', type, payload);
			throw new Error('common/actions#action: Action not in namespace');
		}
		actionTypes = actionTypes[pathSegment];
	});
	if (typeof actionTypes !== 'string') throw new Error('common/actions#action: Action type not string');
	return {...payload, type: actionTypes};
}

function actionAdd(actionTypes, data) {
	if (!_.isArray(data)) data = [data];
	return action(actionTypes, 'ADD', {data});
}

function actionAddUnreceivedKeys(actionTypes, keys) {
	if (!_.isArray(keys)) keys = [keys];
	return action(actionTypes, 'ADD_UNRECEIVED', {keys});
}

function actionAddIndex(actionTypes, filter, order, count, start, data, changedOn) {
	return action(actionTypes, 'INDEX.ADD', {filter, order, count, start, data, changedOn});
}

/**
 * Useful for invalidate data before refresh indexes
 */
function actionClearIndex(actionTypes, filter, order) {
	return action(actionTypes, 'INDEX.CLEAR_INDEX', {filter, order});
}


const actionMarkAsDeleted = (actionTypes, key, date) => {
	return action(actionTypes, 'MARK_DELETED', {key, date});
}

function actionClearIndexes(actionTypes) {
	return action(actionTypes, 'INDEX.CLEAR_ALL');
}

function actionDelete(actionTypes, keys) {
	return action(actionTypes, 'DELETE', {keys});
}

function actionSetActiveKey(actionTypes, key) {
	return action(actionTypes, 'SET_ACTIVE_KEY', {key});
}

function actionSetActiveKeys(actionTypes, keys) {
	return action(actionTypes, 'SET_ACTIVE_KEYS', {keys});
}

function actionRemoveEdited(actionTypes, keys) {
	return action(actionTypes, 'EDITED.REMOVE', {keys});
}

function actionUpdateEdited(actionTypes, data) {
	return action(actionTypes, 'EDITED.UPDATE', {data});
}

function actionRemovePropertyFromEdited(actionTypes, key, property) {
	return action(actionTypes, 'EDITED.REMOVE_PROPERTY', {key, property});
}

function actionUseIndexedRegister(actionTypes, componentId, filterByActive, filter, order, start, length) {
	return action(actionTypes, 'USE.INDEXED.REGISTER', {componentId, filterByActive, filter, order, start, length});
}

function actionUseIndexedClear(actionTypes, componentId) {
	return action(actionTypes, 'USE.INDEXED.CLEAR', {componentId});
}

function actionUseKeysClear(actionTypes, componentId) {
	return action(actionTypes, 'USE.KEYS.CLEAR', {componentId});
}

function actionUseKeysRegister(actionTypes, componentId, keys) {
	return action(actionTypes, 'USE.KEYS.REGISTER', {componentId, keys});
}

// ============ utilities ===========
const getAPIPath = (categoryPath = DEFAULT_CATEGORY_PATH, dataType) => {
	return path.join('backend/rest', categoryPath ,'filtered', dataType);
};

const getCreatePayload = (datatype, key = utils.uuid(), data = {}) => {
	const payload = {
		"data": {}
	};
	payload.data[datatype] = [{
		key,
		data,
	}];
	return payload;
}

// ============ export ===========

export default {
	add: creator(actionAdd),
	action,
	actionAdd,
	actionGeneralError,
	apiUpdate,
	creator,
	create,
	delete: deleteItem,
	ensure: ensureKeys,
	ensureIndexed,
	ensureIndexesWithFilterByActive,
	ensureKeys,
	loadAll,
	loadFiltered,
	loadIndexedPage,
	loadKeysPage,
	setActiveKey: creator(actionSetActiveKey),
	setActiveKeyAndEnsureDependencies,
	setActiveKeys: creator(actionSetActiveKeys),
	receiveUpdated,
	receiveIndexed,
	receiveKeys,
	refreshUses,
	request: requestWrapper,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear: creator(actionUseKeysClear),
	useIndexed,
	clearIndex: creator(actionClearIndex),

	useIndexedRegister: actionUseIndexedRegister,
	useIndexedClear: creator(actionUseIndexedClear),
	actionDataSetOutdated,
	actionSetActiveKey
}

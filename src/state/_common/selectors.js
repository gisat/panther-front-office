import {createSelector} from "reselect";
import {createCachedSelector} from "re-reselect";
import _ from "lodash";
import commonHelpers from './helpers';
import Select from "../Select";

const activeScopeKey = state => state.scopes.activeKey;

const getAllAsObject = (getSubstate) => {
	return (state) => getSubstate(state).byKey;
};

const getAll = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate)],
		byKey => {
			return byKey ? Object.values(byKey) : null;
		}
	);
};

const getAllForActiveScope = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getIndexes(getSubstate), activeScopeKey, (state, order) => order],
		(models, indexes, activeScopeKey, order) => {
			if (models && indexes && activeScopeKey) {
				// TODO change dataset to scope
				let filter = {
					dataset: activeScopeKey
				};
				let index = commonHelpers.getIndex(indexes, filter, order);
				if (index && index.index) {
					let indexedModels = [];
					for (let i = 1; i <= index.count; i++){
						let modelKey = index.index[i];
						if (modelKey){
							let indexedModel = models[modelKey];
							if (indexedModel){
								indexedModels.push(indexedModel);
							} else {
								indexedModels.push({key: modelKey});
							}
						} else {
							indexedModels.push(null);
						}
					}
					return indexedModels.length ? indexedModels : null;
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
	);
};

const getAllForDataviewAsObject = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate)],
		byKey => {
			if (byKey){
				let data = {};
				_.forIn(byKey, (value, key) => {
					data[key] = {
						...value.data,
						_id: Number(key),
						id: Number(key)
					}
				});
				return data;
			} else {
				return null;
			}
		}
	);
};

const getAllForDataview = (getSubstate) => {
	return createSelector(
		[getAllForDataviewAsObject(getSubstate)],
		byKey => {
			return byKey ? Object.values(byKey) : null;
		}
	);
};

const getActiveKey = (getSubstate) => {
	return (state) => getSubstate(state).activeKey
};

const getActiveKeys = (getSubstate) => {
	return (state) => getSubstate(state).activeKeys
};

const getActive = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getActiveKey(getSubstate)],
		(models, activeKey) => {
			return models && models[activeKey];
		}
	);
};

const getActiveModels = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getActiveKeys(getSubstate)],
		(models, activeKeys) => {
			let activeModels = [];
			if (models && !_.isEmpty(models) && activeKeys && !_.isEmpty(activeKeys)){
				activeKeys.map(key => {
					let model = models[key];
					if (model){
						activeModels.push(model);
					}
				});
			}
			return activeModels.length ? activeModels : null;
		}
	)
};

const getByKey = (getSubstate) => {
	return (state, key) => {
		let allData = getAllAsObject(getSubstate)(state);
		return key && allData && allData[key];
	}
};

const getEditedAll = (getSubstate) => {
	return (state) => {
		let data = getSubstate(state).editedByKey;
		return data ? Object.values(data) : null;
	}
};

const getEditedAllAsObject = (getSubstate) => {
	return (state) => getSubstate(state).editedByKey;
};

const getEditedActive = (getSubstate) => {
	return createSelector(
		[getEditedAllAsObject(getSubstate), getActiveKey(getSubstate)],
		(models, activeKey) => {
			return models && models[activeKey];
		}
	);
};

const getEditedByKey = (getSubstate) => {
	return (state, key) => {
		let allEditedData = getEditedAllAsObject(getSubstate)(state);
		return key && allEditedData && allEditedData[key];
	}
};

const getEditedKeys = (getSubstate) => {
	return createSelector(
		[getEditedAll(getSubstate)],
		(edited) => {
			if (edited && !_.isEmpty(edited)){
				return edited.map(model => model.key);
			}
			return null;
		}
	);
};

const getIndexes = (getSubstate) => {
	return (state) => getSubstate(state).indexes;
};

const getIndex = (getSubstate) => {
	return createSelector([
		getIndexes(getSubstate),
		(state, filter) => filter,
		(state, filter, order) => order],
		(indexes, filter, order) => {
			return commonHelpers.getIndex(indexes, filter, order);
		}
	);
};

const getIndexChangedOn = (getSubstate) => {
	return createSelector(
		[getIndex(getSubstate)],
		(index) => {
			if (index && index.changedOn){
				return index.changedOn;
			} else {
				return null;
			}
		}
	);
};

const getIndexPage = (getSubstate) => {
	return createSelector([
		getIndex(getSubstate),
		(state, filter, order, start) => (start),
		(state, filter, order, start, length) => (length)],
		(index, start, length) => {
			if (index && index.index){
				let indexed = {};
				for (let o = start; o < (start + length) && o <= index.count; o++){
					let key = index.index[o];
					indexed[o] = key ? key : null;
				}
				return indexed;
			} else {
				return null;
			}
		}
	);
};

/**
 * call with (state, filter, order)
 */
const getIndexTotal = (getSubstate) => {
	return createSelector(
		[getIndex(getSubstate)],
		(index) => {
			if (index && (index.count || index.count === 0)){
				return index.count;
			} else {
				return null;
			}
		}
	);
};

/**
 * Compare keys with loaded models and return which keys need to be loaded
 */
const getKeysToLoad = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate),
			(state, keys) => (keys)],
		(models, keys) => {
			if (keys && keys.length){
				if (!models){
					return keys;
				} else {
					let toLoad = [];
					keys.forEach(key => {
						if (!models[key] || models[key].outdated){
							toLoad.push(key);
						}
					});
					return toLoad.length ? toLoad : null;
				}
			} else {
				return null;
			}
		}
	);
};

const isInitializedForExt = (getSubstate) => {
	return (state) => getSubstate(state).initializedForExt;
};

const getUsedKeys = (getSubstate) => {
	return (state) => {
		let inUse = getSubstate(state).inUse.keys;
		return inUse && _.uniq(_.flatten(Object.values(inUse)));
	}
};

const getIndexedDataUses = (getSubstate) => {
	return (state) => getSubstate(state).inUse.indexes;
};

const getUsedIndexPages = (getSubstate) => {
	return createSelector([
			getIndexedDataUses(getSubstate),
			Select.scopes.getActiveKey,
			Select.themes.getActiveKey,
			Select.places.getActiveKey,
			Select.places.getActiveKeys,
			Select.periods.getActiveKey,
			Select.periods.getActiveKeys
		],
		(indexedDataUses, activeScopeKey, activeThemeKey, activePlaceKey, activePlaceKeys, activePeriodKey, activePeriodKeys) => {
			let groupedUses = [];
			let usedIndexes = [];
			_.each(indexedDataUses, (usedIndex) => {
				let mergedFilter = commonHelpers.mergeFilters({
					activeScopeKey,
					activeThemeKey,
					activePlaceKey,
					activePlaceKeys,
					activePeriodKey,
					activePeriodKeys
				}, usedIndex.filterByActive, usedIndex.filter);
				if (mergedFilter){
					let existingIndex = _.find(groupedUses, (use) => {
						return _.isEqual(use.filter, mergedFilter) && _.isEqual(use.order, usedIndex.order) ;
					});
					if (existingIndex){
						existingIndex.inUse.push({
							start: usedIndex.start,
							length: usedIndex.length
						});
					} else {
						groupedUses.push({
							filter: mergedFilter,
							order: usedIndex.order,
							inUse: [{
								start: usedIndex.start,
								length: usedIndex.length
							}]
						});
					}
				}
			});

			_.each(groupedUses, index => {
				if (index.inUse && Object.keys(index.inUse).length) {
					usedIndexes.push({
						filter: index.filter,
						order: index.order,
						uses: _mergeIntervals(Object.values(index.inUse))
					});
				}
			});
			return usedIndexes;
		}
	);
};

const getUsesForIndex = (getSubstate) => {
	createCachedSelector(
		getIndexedDataUses(getSubstate),
		(state, filter) => filter,
		(state, filter, order) => order,
		(indexedDataUses, filter, order) => {

		}
	)(
		(state, filter, order) => {
			let stringOrder = JSON.stringify(order);
			let stringFilter = JSON.stringify(_.map(filter, (value, key) => {
				return `${key}:${value}`;
			}).sort());
			return `${stringOrder}:${stringFilter}`;
		}
	);
};

const _mergeIntervals = (intervals) => {	// todo make it better
	let sortedIntervals = _.sortBy(intervals, ['start']);


	let start, end, mergedIntervals = [];

	_.each(sortedIntervals, (interval) => {
		let intervalEnd = interval.start + interval.length - 1;

		if(!start && !end) {
			start = interval.start;
			end = intervalEnd;
		}
		if(end > interval.start) {
			end = intervalEnd;
		} else {
			mergedIntervals.push({start, length: end - start + 1});
			start = interval.start;
			end = intervalEnd;
		}
	});

	mergedIntervals.push({start, length: end - start + 1});

	return mergedIntervals;
};

export default {
	getActive,
	getActiveModels,
	getActiveKey,
	getActiveKeys,
	getAll,
	getAllAsObject,
	getAllForActiveScope,
	getAllForDataview,
	getAllForDataviewAsObject,

	getByKey,

	getEditedActive,
	getEditedAll,
	getEditedAllAsObject,
	getEditedByKey,
	getEditedKeys,

	getIndex,
	getIndexes,
	getIndexChangedOn,
	getIndexPage,
	getIndexTotal,

	getKeysToLoad,

	getUsesForIndex,
	getUsedIndexPages,
	getUsedKeys,

	isInitializedForExt // TODO It will be removed along with Ext
}
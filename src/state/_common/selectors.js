import {createSelector} from "reselect";
import createCachedSelector from "re-reselect";
import _, {pickBy} from "lodash";
import commonHelpers from './helpers';
import Select from "../Select";

const activeAppKey = state => state.apps.activeKey;
const activeScopeKey = state => state.scopes.activeKey;
const activeThemeKey = state => state.themes.activeKey;

const getAllNotRemovedAsObject = (getSubstate) => {
	return (state) => {
		const byKey = getSubstate(state).byKey;
		return pickBy(byKey, (item) => !item.hasOwnProperty('removed'));
	}
};

const getAllAsObject = getAllNotRemovedAsObject;

const getAll = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate)],
		byKey => {
			return byKey ? Object.values(byKey) : null;
		}
	);
};

const getAllForActiveApp = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getIndexes(getSubstate), activeAppKey, (state, order) => order],
		(models, indexes, activeAppKey, order) => {
			if (models && indexes) {
				let filter = null;
				if (activeAppKey) {
					filter = {
						applicationKey: activeAppKey
					}
				}
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

const getAllForActiveScope = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getIndexes(getSubstate), activeScopeKey, (state, order) => order],
		(models, indexes, activeScopeKey, order) => {
			if (models && indexes && activeScopeKey) {
				let filter = {
					scope: activeScopeKey
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
			if (models && models[activeKey]){
				return models[activeKey];
			} else {
				return null;
			}
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
		if (key && allData && !_.isEmpty(allData) && allData[key]) {
			return allData[key];
		} else {
			return null;
		}
	}
};

const getDataByKey = (getSubstate) => {
	return createSelector(
		[getByKey(getSubstate)],
		(model) => {
			if (model && model.data) {
				return model.data;
			} else {
				return null;
			}
		}
	);
};

const getDeletePermissionByKey = (getSubstate) => {
	return createSelector(
		[getByKey(getSubstate)],
		(model) => {
			if (model && model.permissions) {
				return (model.permissions.activeUser && model.permissions.activeUser.delete) || (model.permissions.guest && model.permissions.guest.delete);
			} else {
				return false;
			}
		}
	);
};

const getUpdatePermissionByKey = (getSubstate) => {
	return createSelector(
		[getByKey(getSubstate)],
		(model) => {
			if (model && model.permissions) {
				return (model.permissions.activeUser && model.permissions.activeUser.update) || (model.permissions.guest && model.permissions.guest.update);
			} else {
				return false;
			}
		}
	);
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
			if (models && models[activeKey]){
				return models[activeKey];
			} else {
				return null;
			}
		}
	);
};

const getEditedByKey = (getSubstate) => {
	return (state, key) => {
		let allEditedData = getEditedAllAsObject(getSubstate)(state);
		if (key && allEditedData && !_.isEmpty(allEditedData) && allEditedData[key]) {
			return allEditedData[key];
		} else {
			return null;
		}
	}
};

const getEditedDataByKey = (getSubstate) => {
	return createSelector(
		[getEditedByKey(getSubstate)],
		(model) => {
			if (model && model.data) {
				return model.data;
			} else {
				return null;
			}
		}
	);
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
 * Get a page of data
 * call with (state, filter, order, start, length)
 */
const getIndexedPage = (getSubstate) => {
	return createSelector(
		[
			getIndexPage(getSubstate),
			getAllAsObject(getSubstate)
		],
		(page, models) => {
			return page && page.length && page.map(key => (models[key] || null)) || null; //todo check loading
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

const getIndexesByFilteredItem = (getSubstate) => {
	return createSelector([
		getIndexes(getSubstate),
		(state, item) => item,
		],
		(indexes, item) => {
			const nullFiltersIndexes = indexes.filter((index) => commonHelpers.itemFitFilter(index.filter, item));
			return nullFiltersIndexes;
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

const getUsedKeys = (getSubstate) => {
	return (state) => {
		let inUse = getSubstate(state).inUse.keys;
		if (inUse) {
			let keys = _.uniq(_.flatten(Object.values(inUse)));
			return keys.length ? keys : null;
		} else {
			return null;
		}
	}
};

const getIndexedDataUses = (getSubstate) => {
	return (state) => getSubstate(state).inUse.indexes;
};

const getAllActiveKeys = state => {
	// TODO add scenarios, cases
	return {
		activeApplicationKey: state.apps.activeKey,
		activeScopeKey: state.scopes.activeKey,
		activePlaceKey: state.places.activeKey,
		activePlaceKeys: state.places.activeKeys,
		activePeriodKey: state.periods.activeKey,
		activePeriodKeys: state.periods.activeKeys
	};
};

const getUsedIndexPages = (getSubstate) => {
	return createSelector([
			getIndexedDataUses(getSubstate),
			getAllActiveKeys
		],
		(indexedDataUses, activeKeys) => {
			let groupedUses = [];
			let finalUsedIndexes = [];
			_.each(indexedDataUses, (usedIndexes) => {
				usedIndexes.forEach(usedIndex => {
					let mergedFilter = commonHelpers.mergeFilters(activeKeys, usedIndex.filterByActive, usedIndex.filter);

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
				});
			});

			_.each(groupedUses, index => {
				if (index.inUse && Object.keys(index.inUse).length) {
					finalUsedIndexes.push({
						filter: index.filter,
						order: index.order,
						uses: _mergeIntervals(Object.values(index.inUse))
					});
				}
			});
			return finalUsedIndexes.length ? finalUsedIndexes : null;
		}
	);
};

const getUsesForIndex = (getSubstate) => {
	return createCachedSelector(
		getIndexedDataUses(getSubstate),
		(state, filter) => filter,
		(state, filter, order) => order,
		getAllActiveKeys,
		(indexedDataUses, filter, order, activeKeys) => {
			let index = null;
			_.each(indexedDataUses, (usedIndexes) => {
				_.each(usedIndexes, usedIndex => {
					let mergedFilter = commonHelpers.mergeFilters(activeKeys, usedIndex.filterByActive, usedIndex.filter);

					if (_.isEqual(filter, mergedFilter) && _.isEqual(order, usedIndex.order)){
						if (index){
							index.inUse.push({
								start: usedIndex.start,
								length: usedIndex.length
							});
						} else {
							index = {
								filter: filter,
								order: usedIndex.order,
								inUse: [{
									start: usedIndex.start,
									length: usedIndex.length
								}]
							};
						}
					}
				});
			});

			if (index){
				return {
					filter: index.filter,
					order: index.order,
					uses: _mergeIntervals(Object.values(index.inUse))
				}
			} else {
				return null;
			}
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

const getUsesWithActiveDependency = (getSubstate) => {
	/**
	 * @param state {Object}
	 * @param filterByActive {Object} Something like {scope: true}
	 */
	return createSelector([
			getIndexedDataUses(getSubstate),
			getAllActiveKeys,
			(state, filterByActive) => filterByActive
		],
		/**
		 * @param indexedDataUses {Object} inUse.indexes
		 * @param activeKeys {Object} active keys of all metadata
		 * @param filterByActive {Object} given metadata type active key for filtering (e.g. {scope: true})
		 */
		(indexedDataUses, activeKeys, filterByActive) => {
			let groupedUses = []; // uses grouped by filter
			let usedIndexes = [];

			if (filterByActive) {
				// loop through components
				_.each(indexedDataUses, (componentUsedIndexes) => {
					// loop through uses for component
					_.each(componentUsedIndexes, (usedIndex) => {
						if (_.reduce(filterByActive, (accumulator, value, index) => accumulator && value && usedIndex.filterByActive && usedIndex.filterByActive[index], true)) {
							// if usedIndex.filterByActive has all the properties of filterByActive

							let mergedFilter = commonHelpers.mergeFilters(activeKeys, usedIndex.filterByActive, usedIndex.filter);

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
				});

				// loop through uses grouped by filter and merge intervals
				_.each(groupedUses, index => {
					if (index.inUse && Object.keys(index.inUse).length) {
						usedIndexes.push({
							filter: index.filter,
							order: index.order,
							uses: _mergeIntervals(Object.values(index.inUse))
						});
					}
				});
				return usedIndexes.length ? usedIndexes : null;
			} else {
				return null;
			}
		}
	);
};

const _mergeIntervals = (intervals) => {
	//sort intervals
	let sortedIntervals = _.sortBy(intervals, ['start', 'length']);
	//merge intervals
	return sortedIntervals.reduce((mergedIntervals, interval) => {
		if (!interval || !interval.start || !interval.length) {
			// invalid interval
			return mergedIntervals;
		} else if (!mergedIntervals) {
			//first pass, just return first interval
			return [interval];
		} else {
			let last = mergedIntervals.pop();
			if (interval.start <= (last.start + last.length)) {
				//merge last & current
				let end = Math.max((last.start + last.length), (interval.start + interval.length));
				return [...mergedIntervals, {
					start: last.start,
					length: (end - last.start)
				}];
			} else {
				//add both
				return [...mergedIntervals, last, interval];
			}
		}
	}, null);
};

export default {
	getActive,
	getActiveModels,
	getActiveKey,
	getActiveKeys,
	getAll,
	getAllActiveKeys,
	getAllAsObject,
	getAllForActiveApp,
	getAllForActiveScope,

	getByKey,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedActive,
	getEditedAll,
	getEditedAllAsObject,
	getEditedByKey,
	getEditedDataByKey,
	getEditedKeys,

	getIndex,
	getIndexes,
	getIndexChangedOn,
	getIndexPage,
	getIndexedPage,
	getIndexTotal,
	getIndexesByFilteredItem,

	getKeysToLoad,

	getUpdatePermissionByKey,
	getUsesForIndex,
	getUsedIndexPages,
	getUsedKeys,
	getUsesWithActiveDependency,

	_mergeIntervals
}
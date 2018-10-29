import {createSelector} from "reselect";
import _ from "lodash";

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

const getCount = (getSubstate) => {
	return (state) => getSubstate(state).count;
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
			if (indexes){
				// todo re-reselect?
				let index = _.find(indexes, (index) => {
					return _.isEqual(index.filter, filter) && _.isEqual(index.order, order);
				});
				return index ? index : null;
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
			if (index){
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
			return (index && index.count) || null;
		}
	);
};

export default {
	getActive,
	getActiveModels,
	getActiveKey,
	getActiveKeys,
	getAll,
	getAllAsObject,

	getByKey,

	getEditedActive,
	getEditedAll,
	getEditedAllAsObject,
	getEditedByKey,
	getEditedKeys,

	getIndex,
	getIndexPage,
	getIndexTotal
}
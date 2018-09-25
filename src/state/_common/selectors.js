import {createSelector} from "reselect";
import _ from "lodash";

const getAll = (getSubstate) => {
	return (state) => {
		let data = getSubstate(state).byKey;
		return data ? Object.values(data) : null;
	}
};

const getAllAsObject = (getSubstate) => {
	return (state) => getSubstate(state).byKey;
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
			let filteredModels = [];
			_.forIn(models, (model, modelKey) => {
				if (activeKeys){
					activeKeys.map(key => {
						if (key.toString() === modelKey){
							filteredModels.push(model);
						}
					});
				}
			});
			return filteredModels.length ? filteredModels : null;
		}
	)
};

const getByKey = (getSubstate) => {
	return (state, key) => {
		return key && getAllAsObject(getSubstate)(state)[key];
	}
};

export default {
	getActive,
	getActiveModels,
	getActiveKey,
	getActiveKeys,
	getAll,
	getAllAsObject,
	getByKey
}
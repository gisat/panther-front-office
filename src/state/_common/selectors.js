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

const getActive = (getSubstate) => {
	return createSelector(
		[getAllAsObject(getSubstate), getActiveKey(getSubstate)],
		(models, activeKey) => {
			return models && models[activeKey];
		}
	);
};

const getByKey = (getSubstate) => {
	return (state, key) => {
		return key && getAllAsObject(getSubstate)(state)[key];
	}
};

export default {
	getActive,
	getActiveKey,
	getAll,
	getAllAsObject,
	getByKey
}
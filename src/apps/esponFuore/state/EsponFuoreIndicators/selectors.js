import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../../../../state/_common/selectors";
import commonHelpers from "../../../../state/_common/helpers";

const getSubstate = state => state.specific.esponFuoreIndicators;

const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getByKey = common.getByKey(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);

const getIndexed = common.getIndexed(getSubstate);
const getIndexes = common.getIndexes(getSubstate);

const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);


const getAllOrdered = createSelector(
	[
		getAllAsObject,
		getIndexes,
		(state, order) => (order)
	],
	(models, indexes, order) => {
		if (models && indexes) {
			let index = commonHelpers.getIndex(indexes, null, order);
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

export default {
	getActive,
	getActiveKey,
	getAll,
	getAllAsObject,
	getAllOrdered,
	getByKey,

	getDataByKey,
	getDeletePermissionByKey,

	getIndexed,

	getEditedDataByKey,
	getUpdatePermissionByKey,

	getSubstate,
};
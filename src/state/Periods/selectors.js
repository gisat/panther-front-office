import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelectors from "../Scopes/selectors";
import commonHelpers from "../_common/helpers";

const getSubstate = state => state.periods;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

const getIndexes = common.getIndexes(getSubstate);

// TODO use common selector instead
const getAllForActiveScope = createSelector([
	getAllAsObject,
	getIndexes,
	ScopesSelectors.getActive,
	(state, order) => order],
	(models, indexes, activeScope, order) => {
		if (models && indexes && activeScope){
			let filter = {
				key: {
					in: activeScope.data.years
				}
			};
			let index = commonHelpers.getIndex(indexes, filter, order);
			if (index) {
				let selectedModels = [];
				if (index.index) {
					_.each(index.index, (value) => {
						let model = models[value];
						if (model) {
							selectedModels.push(model);
						}
					});
				}

				if (selectedModels.length) {
					return selectedModels;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} else {
			return null;
		}
	});

export default {
	getActivePeriod: getActive,
	getPeriods: getAll,
	getActiveKey,
	getActiveKeys,
	getActiveModels,
	getAll,
	getAllAsObject,
	getAllForActiveScope,
	getAllForDataview,
	getAllForDataviewAsObject,
	getSubstate
};
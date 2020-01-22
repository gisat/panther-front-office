import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';
import _ from "lodash";

// ============ creators ===========

const add = common.add(ActionTypes.VIEWS);
const addIndex = common.addIndex(ActionTypes.VIEWS);
const setActiveKey = common.setActiveKey(ActionTypes.VIEWS);
const setActiveKeys = common.setActiveKeys(ActionTypes.VIEWS);
const create = common.create(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const deleteItem = common.delete(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const saveEdited = common.saveEdited(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const updateEdited = common.updateEdited(Select.views.getSubstate, ActionTypes.VIEWS, 'views');
const useKeys = common.useKeys(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const useKeysClear = common.useKeysClear(ActionTypes.VIEWS);
const useIndexedClear = common.useIndexedClear(ActionTypes.VIEWS);
const useIndexed = common.useIndexed(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const refreshUses = common.refreshUses(Select.views.getSubstate, `views`, ActionTypes.VIEWS, 'views');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');

// ============ actions ===========
const apply = (key, actions) => {
	return (dispatch, getState) => {
		return dispatch(common.ensureKeys(Select.views.getSubstate, 'views', ActionTypes.VIEWS, [key], 'views')).then(() => {
			let data = Select.views.getDataByKey(getState(), key);
			if (data && data.state) {

				let actionCreators = [];
				_.each(actions, (storeActions, key) => {
					if (storeActions.hasOwnProperty('updateStateFromView') && data.state[key]) {
						actionCreators.push(storeActions.updateStateFromView(data.state[key]));
					}
				});

				if (actions.specific) {
					_.each(actions.specific, (storeActions, key) => {
						if (storeActions.hasOwnProperty('updateStateFromView') && data.state[key]) {
							actionCreators.push(storeActions.updateStateFromView(data.state[key]));
						}
					});
				}
				dispatch(actionCreators);


			} else {
				dispatch(common.actionGeneralError("Views#apply: View or state of view doesn't exist! View key: " + key));
			}
		}).catch(err => {
			dispatch(common.actionGeneralError("Views#apply: " + err));
		});
	}
};

// ============ export ===========

export default {
	add,
	addIndex,
	apply,
	setActiveKey,
	setActiveKeys,
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	refreshUses,
	useIndexed,
	useIndexedClear,
}

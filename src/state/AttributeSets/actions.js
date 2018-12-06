import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import AttributesActions from '../Attributes/actions';

import _ from 'lodash';
import common from "../_common/actions";


// ============ creators ===========

const add = common.add(ActionTypes.ATTRIBUTE_SETS);
const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTE_SETS);

function addAndSetActive(data){
	return (dispatch) => {
		if (data && data.length){
			dispatch(add(data));
			let keys = _.map(data, 'key');
			dispatch(setActiveKeys(keys));
		}
		dispatch(actionInitializeForExt());
	}
}

function loadForTopics(topics) {
	return (dispatch) => {
		let filter = {
			topic: {
				in: topics
			}
		};
		return dispatch(common.loadFiltered('attributesets', filter, addAndSetActive, actionLoadError));
	}
}

// ============ actions ===========

function actionLoadError(error) {
	return {
		type: ActionTypes.ATTRIBUTE_SETS.LOAD.ERROR,
		error: error
	}
}

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.ATTRIBUTE_SETS.INITIALIZE_FOR_EXT,
	}
}

// ============ export ===========

export default {
	add,
	setActiveKeys,
	loadForTopics
}

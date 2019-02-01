import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import AttributesActions from '../Attributes/actions';

import _ from 'lodash';
import common from "../_common/actions";


// ============ creators ===========

const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTE_SETS);

function loadForTopics(topics, options) {
	return (dispatch) => {
		let filter = {
			topic: {
				in: topics
			}
		};
		return dispatch(common.loadFiltered('attributesets', ActionTypes.ATTRIBUTE_SETS, filter, 'metadata', options));
	}
}

// ============ actions ===========

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.ATTRIBUTE_SETS.INITIALIZE_FOR_EXT,
	}
}

// ============ export ===========

export default {
	setActiveKeys,
	loadForTopics
}

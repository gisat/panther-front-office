import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const useKeys = common.useKeys(Select.topics.getSubstate, 'topics', ActionTypes.TOPICS);

// ============ actions ===========

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.TOPICS.INITIALIZE_FOR_EXT,
	}
}


// ============ export ===========

export default {
	initializeForExt: actionInitializeForExt,
	useKeys
}

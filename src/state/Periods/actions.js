import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.PERIODS_ADD,
		data: periods
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.PERIODS_SET_ACTIVE,
		key: key
	}
}

// ============ export ===========

export default {
	add,
	setActiveKey
}

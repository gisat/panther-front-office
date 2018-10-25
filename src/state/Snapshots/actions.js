import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';

// ============ creators ===========
const add = (data) => {
	return (dispatch) => {
		if (!_.isArray(data)) data = [data];
		dispatch(actionAdd(data));
	}
};

// ============ actions ===========
function actionAdd(data){
	return {
		type: ActionTypes.SNAPSHOTS_ADD,
		data: data
	}
}


// ============ export ===========

export default {
	add
}

import ActionTypes from '../../../../constants/ActionTypes';
import Action from  '../../../Action';
import Select from '../../../Select';
import _ from 'lodash';

// ============ creators ===========
function checkForActiveUser(){
	return (dispatch, getState) => {
		let isAdmin = Select.users.isAdmin(getState());
		let isInItroMode = Select.components.isAppInIntroMode(getState());
		if (!isAdmin && isInItroMode){
			dispatch(Action.components.overlays.openOverlay('views'))
		}
	}
}

function setSelectedScope(key){
	return (dispatch, getState) => {
		let data = Select.components.overlays.getOverlay(getState(), {key: 'views'});
		let update = {...data, selectedScope: key};
		dispatch(Action.components.overlays.actionUpdateOverlay('views', update));
	}
}

// ============ actions ===========

// ============ export ===========

export default {
	checkForActiveUser: checkForActiveUser,
	setSelectedScope: setSelectedScope
}

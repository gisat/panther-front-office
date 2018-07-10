import ActionTypes from '../../../../constants/ActionTypes';
import Action from  '../../../Action';
import Select from '../../../Select';
import _ from 'lodash';

// ============ creators ===========
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
	setSelectedScope: setSelectedScope
}

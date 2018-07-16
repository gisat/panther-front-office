import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';

import Overlays from './Overlays/actions';
import Windows from './Windows/actions';

// ============ creators ===========
function update(component, data) {
	return dispatch => {
		dispatch(actionUpdate(component, data));
	};
}

function redirectToView(params) {
	return dispatch => {
		// TODO need login parameter
		let url = window.location.origin + window.location.pathname + "?id=" + params.key + "&needLogin=true" + "&lang=" + params.language;
		dispatch(actionRedirectToView(url));
		window.location = url;
	}
}


// ============ actions ===========
function actionRedirectToView(url) {
	return {
		type: ActionTypes.REDIRECT_TO_VIEW,
		url: url
	}
}

function actionUpdate(component, data) {
	return {
		type: ActionTypes.COMPONENTS_UPDATE,
		component: component,
		update: data
	}
}


// ============ export ===========

export default {
	redirectToView: redirectToView,
	update: update,

	windows: Windows,
	overlays: Overlays
}

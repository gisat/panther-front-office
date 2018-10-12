import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';

import Overlays from './Overlays/actions';
import Windows from './Windows/actions';

// ============ creators ===========
function setApplicationStyleActiveKey(key) {
	return (dispatch, getState) => {
		let style = Select.components.getApplicationStyle(getState());
		dispatch(update('application', {style: {...style, activeKey: key}}));
	};
}

function setApplicationStyleHtmlClass(htmlClass) {
	return (dispatch, getState) => {
		let style = Select.components.getApplicationStyle(getState());
		let updatedClases = null;

		if (htmlClass.hasOwnProperty('forUrl')){
			updatedClases = {...style.htmlClasses, forUrl: htmlClass.forUrl};
		} else if (htmlClass.hasOwnProperty('forScope')) {
			updatedClases = {...style.htmlClasses, forScope: htmlClass.forScope};
		}

		dispatch(update('application', {style: {...style, htmlClasses: updatedClases}}));
	};
}

function setIntro(visibility) {
	return dispatch => {
		let updatedData = {
			intro: visibility
		};
		dispatch(update('application', updatedData));
	};
}
function updateMapsContainer(data) {
	return dispatch => {
		dispatch(update('mapsContainer', data));
	};
}

function update(component, data) {
	return dispatch => {
		dispatch(actionUpdate(component, data));
	};
}

function redirectToView(params) {
	return (dispatch, getState) => {
		let urlParams = [];

		// view id
		urlParams.push(`id=${params.key}`);

		// language
		if (params.language){
			urlParams.push(`lang=${params.language}`);
		}

		// need login
		// todo need login in params?
		let hasGuestGroupPermission = Select.views.hasGuestGroupGetPermission(getState(), params.key);
		if (!hasGuestGroupPermission){
			urlParams.push(`needLogin=true`);
		}

		let url = `${window.location.origin}${window.location.pathname}?${urlParams.join('&')}`;
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
	redirectToView,
	setApplicationStyleActiveKey,
	setApplicationStyleHtmlClass,
	setIntro,
	update,
	updateMapsContainer,

	windows: Windows,
	overlays: Overlays
}

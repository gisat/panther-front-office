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

function setApplicationStyleHtmlClass(configuration, htmlClass) {
	return (dispatch, getState) => {
		let style = Select.components.getApplicationStyle(getState());
		let updatedConfiguration = {...style.configuration,
			[configuration]: {
				...style.configuration[configuration],
				htmlClass: htmlClass
			}
		};
		dispatch(update('application', {style: {...style, configuration: updatedConfiguration}}));
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
		if (!params.public){
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

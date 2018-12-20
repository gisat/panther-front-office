import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import Select from '../../Select';
import _ from 'lodash';

import Scenarios from './Scenarios/actions';

// ============ creators ===========
function changeWindowPosition(window, options){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					positionX: options.positionX,
					positionY: options.positionY
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function changeWindowSize(window, options){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					width: options.width,
					height: options.height
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function dockWindow(window){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					floating: false,
					expanded: false,
					docked: true
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function expandWindow(window){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					floating: false,
					expanded: true,
					docked: false
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function handleWindowVisibility(window, open){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let openState = false;
			if (open){
				openState = true;
			}
			let stateUpdate = {...windows, [window]: {...windows[window], open: openState}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function handleShareClearContent(){
	return (dispatch) => {
		dispatch(Action.components.setShareSaveState(null));
	};
}

function floatWindow(window){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					floating: true,
					expanded: false,
					docked: false
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function updateWindow(windowKey, data){
	return (dispatch) => {
		dispatch(actionUpdateWindow(windowKey, data));
	};
}

// ============ actions ===========
function actionUpdateWindow(windowKey, data) {
	return {
		type: ActionTypes.COMPONENTS_WINDOW_UPDATE,
		windowKey: windowKey,
		update: data
	}
}

// ============ export ===========

export default {
	changeWindowPosition: changeWindowPosition,
	changeWindowSize: changeWindowSize,
	dockWindow: dockWindow,
	expandWindow: expandWindow,
	floatWindow: floatWindow,
	handleWindowVisibility: handleWindowVisibility,
	handleShareClearContent: handleShareClearContent,
	updateWindow: updateWindow,

	scenarios: Scenarios
}

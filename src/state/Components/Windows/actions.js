import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import Select from '../../Select';
import _ from 'lodash';

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

function setWindowActiveScreen(windowKey, screenKey){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (windowKey && windows[windowKey]){
			let stateUpdate = {...windows, [windowKey]: {
					...windows[windowKey],
					activeScreenKey: screenKey
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

// ============ export ===========

export default {
	changeWindowPosition: changeWindowPosition,
	changeWindowSize: changeWindowSize,
	dockWindow: dockWindow,
	expandWindow: expandWindow,
	floatWindow: floatWindow,
	handleWindowVisibility: handleWindowVisibility,

	setWindowActiveScreen: setWindowActiveScreen
}

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
					positionY: options.positionY,
					floaterPositionX: options.floaterPositionX,
					floaterPositionY: options.floaterPositionY
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
					height: options.height,
					floaterWidth: options.floaterWidth,
					floaterHeight: options.floaterHeight
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

function expandWindow(window, options){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					floating: false,
					width: '100%',
					height: '100%',
					positionX: 0,
					positionY: 0
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

function shrinkWindow(window, options){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.windows.getWindows(state);
		if (window && windows[window]){
			let stateUpdate = {...windows, [window]: {
					...windows[window],
					floating: true,
					width: options.width ? options.width : windows[window].width,
					height: options.height ? options.height : windows[window].height,
					positionX: options.positionX ? options.positionX : windows[window].positionX,
					positionY: options.positionY ? options.positionY : windows[window].positionY
				}};
			dispatch(Action.components.update("windows", stateUpdate));
		}
	};
}

// ============ export ===========

export default {
	changeWindowPosition: changeWindowPosition,
	changeWindowSize: changeWindowSize,
	expandWindow: expandWindow,
	handleWindowVisibility: handleWindowVisibility,
	shrinkWindow: shrinkWindow
}

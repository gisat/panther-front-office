import React from "react";
import {connect} from 'react-redux';

import './style.scss';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {
		set: Select.windows.getSetByKey(state, ownProps.setKey),
		windows: Select.windows.getWindowsBySetKeyAsObject(state, ownProps.setKey),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onWindowClick: (windowKey) => {
			dispatch(Action.windows.topWindow(ownProps.setKey, windowKey));
		},
		onWindowClose: (windowKey) => {
			dispatch(Action.windows.remove(ownProps.setKey, windowKey));
		},
		onWindowDragStart: (windowKey) => {
			dispatch(Action.windows.topWindow(ownProps.setKey, windowKey));
		},
		onWindowDragStop: (windowKey, position) => {
			dispatch(Action.windows.updateSettings(windowKey, {position}));
		},
		onWindowResize: (windowKey, width, height, position) => {
			dispatch(Action.windows.updateSettings(windowKey, {width, height, position}));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
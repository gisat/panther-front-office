import React from "react";
import { connect } from 'react-redux';

import './style.scss';
import Select from "../../../apps/esponFuore/state/Select";
import utils from "../../../utils/utils";
import Action from "../../../apps/esponFuore/state/Action";

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
		onWindowDragStop: (windowKey, position) => {
			dispatch(Action.windows.topWindow(ownProps.setKey, windowKey));
			dispatch(Action.windows.updateSettings(windowKey, {position: position}));
		},
		onWindowResize: (windowKey, width, height) => {
			dispatch(Action.windows.updateSettings(windowKey, {width, height}));
		},


		update: (windowKey, update) => {
			// dispatch(Action.windows.update(ownProps.set, windowKey, update));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
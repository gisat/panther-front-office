import React from "react";
import { connect } from 'react-redux';

import './style.scss';
import Select from "../../../apps/esponFuore/state/Select";
import utils from "../../../utils/utils";
import Action from "../../../apps/esponFuore/state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {
		// windows: Select.windows.get(ownProps.set),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		update: (windowKey, update) => {
			// dispatch(Action.windows.update(ownProps.set, windowKey, update));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
import React from 'react';
import { connect } from 'react-redux';
import {utils} from "panther-utils"
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import Presentation from "./presentation";

const order = [['key', 'ascending']];

const mapStateToProps = (state, ownProps) => {
	return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const componentId = 'LPISCheckList_' + utils.randomString(6);
	
	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.dataviews.useIndexed({scope: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.dataviews.useIndexedClear(componentId));
			}
		}

	}

};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);

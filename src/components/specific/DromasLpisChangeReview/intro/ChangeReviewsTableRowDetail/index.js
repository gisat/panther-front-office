import React from 'react';
import { connect } from 'react-redux';

import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import Presentation from "./presentation";
import {utils} from "panther-utils"

const mapStateToProps = (state, ownProps) => {
	return {
		createdByData: Select.users.getByKey(state, ownProps.createdBy),
		updatedByData: Select.users.getByKey(state, ownProps.updatedBy)
	};
};

const mapDispatchToPropsFactory = (dispatch, ownProps) => {
	const componentId = 'ChangeReviewsDetail_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				let userKeys = [];
				if (ownProps.createdBy){
					userKeys.push(ownProps.createdBy);
				}
				if (ownProps.updatedBy){
					userKeys.push(ownProps.updatedBy);
				}
				if (userKeys.length){
					dispatch(Action.users.useKeys(userKeys, componentId));
				}
			},
			onUnmount: () => {
				dispatch(Action.users.useKeysClear(componentId));
			}
		}

	}

};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(Presentation);

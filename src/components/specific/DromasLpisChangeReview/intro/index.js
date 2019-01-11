import React from 'react';
import { connect } from 'react-redux';

import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import Presentation from "./presentation";

const mapStateToProps = (state) => {
	return {
		changeReviewsActiveScreenKey: Select.components.overlays.views.getChangeReviewsActiveScreenKey(state),
		activeEditedCase: Select.specific.lpisChangeReviewCases.getActiveEditedCase(state),
		activeUserDromasLpisChangeReviewGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setChangeReviewsActiveScreen: (screenKey) => {
			dispatch(Action.components.overlays.views.setChangeReviewsActiveScreen(screenKey));
		},
		createLpisCase: () => {
			dispatch(Action.specific.lpisChangeReviewCases.createLpisCase());
		},
		createNewActiveEditedCase: () => {
			dispatch(Action.specific.lpisChangeReviewCases.createNewActiveEditedCase());
		},
		editActiveEditedCase: (column, value, file) => {
			dispatch(Action.specific.lpisChangeReviewCases.editActiveEditedCase(column, value, file));
		},
		clearActiveEditedCase: () => {
			dispatch(Action.specific.lpisChangeReviewCases.clearActiveEditedCase());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);

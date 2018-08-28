import React from 'react';
import { connect } from 'react-redux';

import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import Presentation from "./presentation";

const mapStateToProps = (state) => {
	return {
		changeReviewsActiveScreenKey: Select.components.overlays.views.getChangeReviewsActiveScreenKey(state),
		activeEditedCase: Select.lpisCases.getActiveEditedCase(state),
		activeUserDromasLpisChangeReviewGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setChangeReviewsActiveScreen: (screenKey) => {
			dispatch(Action.components.overlays.views.setChangeReviewsActiveScreen(screenKey));
		},
		createLpisCase: () => {
			dispatch(Action.lpisCases.createLpisCase());
		},
		createNewActiveEditedCase: () => {
			dispatch(Action.lpisCases.createNewActiveEditedCase());
		},
		editActiveEditedCase: (column, value, file) => {
			dispatch(Action.lpisCases.editActiveEditedCase(column, value, file));
		},
		clearActiveEditedCase: () => {
			dispatch(Action.lpisCases.clearActiveEditedCase());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
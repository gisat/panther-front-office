import React from 'react';
import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import ScopeIntroSwitch from "../../presentation/controls/ScopeIntroSwitch";

const mapStateToProps = (state, ownProps) => {
	return {
		scope: Select.scopes.getScopeData(state, ownProps.scopeKey),
		intro: Select.components.overlays.views.getIntro(state),
		changeReviewsActiveScreenKey: Select.components.overlays.views.getChangeReviewsActiveScreenKey(state),
		activeNewEditedCase: Select.lpisCases.getActiveNewEditedCase(state)
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScopeIntroSwitch);

import React from 'react';
import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import ScopeIntroSwitch from "../../presentation/controls/ScopeIntroSwitch";

const mapStateToProps = (state, ownProps) => {
	return {
		scope: Select.scopes.getScopeData(state, ownProps.scopeKey),
		intro: Select.components.overlays.views.getIntro(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScopeIntroSwitch);

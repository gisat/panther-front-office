import React from 'react';
import { connect } from 'react-redux';
import Select from '../../../state/Select';
import ViewsList from "./ViewsList";

const ScopeIntroSwitch = ({scope, intro}) => {
	if (scope){
		if (scope.configuration && scope.configuration && scope.configuration.introComponent){
			if (scope.configuration.introComponent === "dromasLpisChangeReview"){
				return <div>Dromas component</div>
			}
		} else {
			return <ViewsList
				selectedScope={scope}
			/>
		}
	} else if (!scope && intro){
		return <div>Intro component</div>
	}
	return null;
};


const mapStateToProps = (state, ownProps) => {
	return {
		scope: Select.scopes.getScopeData(state, ownProps.scopeKey),
		intro: Select.components.overlays.views.getIntro(state),
	};
};

export default connect(mapStateToProps)(ScopeIntroSwitch);

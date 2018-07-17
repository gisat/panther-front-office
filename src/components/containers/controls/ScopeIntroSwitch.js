import React from 'react';
import { connect } from 'react-redux';
import Names from '../../../constants/Names';
import Select from '../../../state/Select';

import ChangeReviewsList from './ChangeReviewsList';
import Intro from "../Intro";
import ViewsList from "./ViewsList";

const ScopeIntroSwitch = ({scope, intro}) => {
	if (scope){
		if (scope.configuration && scope.configuration && scope.configuration.introComponent){
			if (scope.configuration.introComponent === "dromasLpisChangeReview"){
				return <ChangeReviewsList/>
			}
		} else {
			return <ViewsList
				selectedScope={scope}
			/>
		}
	} else if (!scope && intro){
		return <Intro
			plainContent
		/>
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

import React from 'react';
import { connect } from 'react-redux';
import Names from '../../../constants/Names';
import Select from '../../../state/Select';

import ChangeReviewsList from './ChangeReviewsList';
import ChangeReviewForm from '../../presentation/controls/changeReviews/ChangeReviewForm/ChangeReviewForm';
import Intro from "../Intro";
import ScreenAnimator from "../../presentation/ScreenAnimator/ScreenAnimator";
import ViewsList from "./ViewsList";
import Action from "../../../state/Action";

const ScopeIntroSwitch = ({scope, intro, changeReviewsActiveScreenKey,setChangeReviewsActiveScreen}) => {
	if (scope){
		if (scope.configuration && scope.configuration && scope.configuration.introComponent){
			if (scope.configuration.introComponent === "dromasLpisChangeReview"){
				return (
					<ScreenAnimator
						activeScreenKey={changeReviewsActiveScreenKey}
					>
						<ChangeReviewsList
							screenKey="changeReviewsList"
							changeActiveScreen={setChangeReviewsActiveScreen}
						/>
						<ChangeReviewForm
							screenKey="changeReviewForm"
							changeActiveScreen={setChangeReviewsActiveScreen}
						/>
					</ScreenAnimator>
				);
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
		changeReviewsActiveScreenKey: Select.components.overlays.views.getChangeReviewsActiveScreenKey(state),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setChangeReviewsActiveScreen: (screenKey) => {
			dispatch(Action.components.overlays.views.setChangeReviewsActiveScreen(screenKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScopeIntroSwitch);

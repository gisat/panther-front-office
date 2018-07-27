import React from 'react';

import ChangeReviewsList from '../../containers/controls/ChangeReviewsList';
import ChangeReviewForm from '../../presentation/controls/changeReviews/ChangeReviewForm/ChangeReviewForm';
import ScreenAnimator from "../../presentation/ScreenAnimator/ScreenAnimator";
import ViewsList from "../../containers/controls/ViewsList";
import Intro from "../../containers/Intro";

export default ({scope, intro, changeReviewsActiveScreenKey, activeNewEditedCase, setChangeReviewsActiveScreen, createLpisCase, editActiveEditedCase, createNewActiveEditedCase}) => {
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
							createLpisCase={createLpisCase}
							activeNewEditedCase={activeNewEditedCase}
							editActiveEditedCase={editActiveEditedCase}
							createNewActiveEditedCase={createNewActiveEditedCase}
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

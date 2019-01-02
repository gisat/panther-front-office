import React from 'react';

import ViewsList from "../containers/controls/ViewsList";
import Intro from "../containers/Intro";
import DromasLpisChangeReviewIntro from '../specific/DromasLpisChangeReview/intro';

export default ({scope, intro}) => {
	if (scope){
		if (scope.data.configuration && scope.data.configuration && scope.data.configuration.introComponent){
			switch(scope.data.configuration.introComponent) {
				case 'dromasLpisChangeReview':
					return (
						<DromasLpisChangeReviewIntro />
					);
			}
		} else {
			return <ViewsList
				selectedScopeData={scope && scope.data}
			/>
		}
	} else if (!scope && intro){
		return <Intro
			plainContent
		/>
	}
	return null;
};

import React from 'react';

import ViewsList from "../containers/controls/ViewsList";
import Intro from "../containers/Intro";
import DromasLpisChangeReviewIntro from '../scopeSpecific/DromasLpisChangeReview/intro';
import LpisCheckIntro from '../scopeSpecific/LPISCheck/intro';

export default ({scope, intro}) => {
	if (scope){
		if (scope.configuration && scope.configuration && scope.configuration.introComponent){
			switch(scope.configuration.introComponent) {
				case 'dromasLpisChangeReview':
					return (
						<DromasLpisChangeReviewIntro />
					);
				case 'LPISCheck':
					return (
						<LpisCheckIntro />
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

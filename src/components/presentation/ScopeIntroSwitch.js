import React from 'react';

import ViewsList from "../containers/controls/ViewsList";
import Intro from "../containers/Intro";
import GeoinvIntro from '../specific/Geoinvaze/Intro';
import LpisCheckIntro from '../specific/LPISCheck/intro';
import DromasLpisChangeReviewIntro from '../specific/DromasLpisChangeReview/intro';

export default ({scope, intro, styleClass}) => {
	if (scope){
		if (scope.data.configuration && scope.data.configuration && scope.data.configuration.introComponent){
			switch(scope.data.configuration.introComponent) {
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
				selectedScopeData={scope && scope.data}
			/>
		}
	} else if (!scope && intro){
		if (styleClass && styleClass === "geoinvaze"){
			return <GeoinvIntro/>
		} else {
			return <Intro
				plainContent
			/>
		}
	}
	return null;
};

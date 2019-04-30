import React from 'react';

import ViewsList from "../containers/controls/ViewsList";
import Intro from "../containers/Intro";
import LpisCheckIntro from '../specific/LPISCheck/intro/presentation';
import GeoinvIntro from '../specific/Geoinvaze/Intro';
import DromasLpisChangeReviewIntro from '../specific/DromasLpisChangeReview/intro';
import UTEP from '../specific/UTEP/intro';

export default ({scope, intro, isInIntroMode, styleClass}) => {
	if (scope){
		if (scope.data.configuration && scope.data.configuration && scope.data.configuration.introComponent){
			switch(scope.data.configuration.introComponent) {
				case 'dromasLpisChangeReview':
					return (
						<DromasLpisChangeReviewIntro />
					);
				case 'LPISCheck':
					return (
						<LpisCheckIntro scope={scope} key={scope.key}/>
					);
			}
		} else if(!isInIntroMode) {
			return <UTEP
				selectedScopeData={scope && scope.data}
			/>
		} else {
			return <ViewsList
				selectedScopeData={scope && scope.data} />
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

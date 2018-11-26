import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';

import DromasLpisChangeReviewHeader from '../components/scopeSpecific/DromasLpisChangeReview/header';
import SentinelViewer from '../components/scopeSpecific/SentinelViewer/header';

const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.configuration && scope.configuration.headerComponent === "dromasLpisChangeReview") {
			return <DromasLpisChangeReviewHeader />
		//FIXME - How identify showTimeline
		} else if (scope.configuration && scope.configuration.headerComponent === "sentinelPreview") {
			return <SentinelViewer />
		}
	}
	return null;
};


const mapStateToProps = state => {
	return {
		scope: Select.scopes.getActiveScopeData(state)
	};
};

export default connect(mapStateToProps)(MagicSwitch);

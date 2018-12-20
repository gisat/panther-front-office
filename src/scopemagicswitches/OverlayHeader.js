import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';

import DromasLpisChangeReviewHeader from '../components/scopeSpecific/DromasLpisChangeReview/header';
import SentinelViewer from '../components/scopeSpecific/SentinelViewer/header';
import LPISCheck from '../components/scopeSpecific/LPISCheck/header';

const MagicSwitch = ({scope, activeLpisCheckCase}) => {
	if (scope) {
		if (scope.configuration && scope.configuration.headerComponent === "dromasLpisChangeReview") {
			return <DromasLpisChangeReviewHeader />
		} else if (scope.configuration && scope.configuration.sentinelViewer) {
			return <SentinelViewer />
		} else if (scope.configuration && scope.configuration.lpisCheckReview && activeLpisCheckCase) {
			return <LPISCheck />
		}
	}
	return null;
};


const mapStateToProps = state => {
	return {
		scope: Select.scopes.getActiveScopeData(state),
		activeLpisCheckCase: Select.lpisCheckCases.getActiveCase(state),
	};
};

export default connect(mapStateToProps)(MagicSwitch);

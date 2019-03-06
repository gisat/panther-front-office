import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import DromasLpisChangeReviewHeader from '../components/specific/DromasLpisChangeReview/header';
import SentinelViewer from '../components/specific/SentinelViewer/header';
import LPISCheck from '../components/specific/LPISCheck/header';

const MagicSwitch = ({scope, activeLpisCheckCase}) => {
	if (scope && scope.data) {
		if (scope.data.configuration && scope.data.configuration.headerComponent === "dromasLpisChangeReview") {
			return <DromasLpisChangeReviewHeader />
		} else if (scope.data.configuration && scope.data.configuration.sentinelViewer) {
			return <SentinelViewer />
		} else if (scope.data.configuration && scope.data.configuration.lpisCheckReview && activeLpisCheckCase) {
			return <LPISCheck scope_key={scope.key}/>
		}
	}
	return null;
};


const mapStateToProps = state => {
	return {
		scope: Select.scopes.getActiveScopeData(state),
		activeLpisCheckCase: Select.specific.lpisCheckCases.getActiveCase(state),
	};
};

export default connect(mapStateToProps)(MagicSwitch);

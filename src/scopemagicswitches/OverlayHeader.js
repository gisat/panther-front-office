import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';

import DromasLpisChangeReviewHeader from '../components/scopeSpecific/DromasLpisChangeReview/header';

const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.configuration && scope.configuration.headerComponent === "dromasLpisChangeReview") {
			return <DromasLpisChangeReviewHeader />
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

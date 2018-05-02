import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiPeriodsSelector from '../components/containers/view-selectors/AoiPeriodsSelector';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';


const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.viewSelection === 'aoiPeriodsSelector' && scope.aoiLayer) {
			return <AoiPeriodsSelector />
		}
		if (scope.viewSelection === 'placeSelector' && scope.featurePlaceChangeReview) {
			return <PlaceSelector label="DPB" homeLink />
		}
		if (scope.viewSelection === 'placeSelector') {
			return <PlaceSelector />
		}
		if (scope.viewSelection === 'placeAuPeriodFrequency') {
			// todo component
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

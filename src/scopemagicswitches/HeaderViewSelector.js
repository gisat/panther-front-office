import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiPeriodsSelector from '../components/containers/view-selectors/AoiPeriodsSelector';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';
import ChangeReviewPlaceSelector from '../components/containers/view-selectors/ChangeReviewPlaceSelector';
import ScenariosPlaceSelector from '../components/containers/view-selectors/ScenariosPlaceSelector';


const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.viewSelection === 'aoiPeriodsSelector' && scope.aoiLayer) {
			return <AoiPeriodsSelector />
		}
		if (scope.viewSelection === 'placeSelector' && scope.featurePlaceChangeReview) {
			return <ChangeReviewPlaceSelector label="Ohlášení územní změny" homeLink />
		}
		if (scope.viewSelection === 'placeSelector' && scope.config && scope.config.pucsLandUseScenarios) { //todo model!!!!
			return <ScenariosPlaceSelector />
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

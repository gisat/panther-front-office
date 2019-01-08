import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiPeriodsSelector from '../components/containers/view-selectors/AoiPeriodsSelector';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';
import ChangeReviewPlaceSelector from '../components/containers/view-selectors/ChangeReviewPlaceSelector';
import ScenariosPlaceSelector from '../components/containers/view-selectors/ScenariosPlaceSelector';
import ShareButton from '../components/common/controls/Share/Button';


const MagicSwitch = ({scope, isLoggedIn}) => {
	if (scope && scope.data) {
		if (scope.data.viewSelection === 'aoiPeriodsSelector' && scope.data.aoiLayer) {
			return <AoiPeriodsSelector />
		}
		if (scope.data.viewSelection === 'placeSelector' && scope.data.featurePlaceChangeReview) {
			return <ChangeReviewPlaceSelector classes="change-review-place-selector" label="Ohlášení územní změny" homeLink />
		}
		if (scope.data.viewSelection === 'placeSelector' && scope.data.configuration && scope.data.configuration.pucsLandUseScenarios) { //todo model!!!!
			return (<div><ScenariosPlaceSelector />{isLoggedIn ? <div className="ptr-view-selection-container"><ShareButton/></div> : null}</div>)
			
		}
		if (scope.data.viewSelection === 'placeSelector') {
			return <PlaceSelector />
		}
		if (scope.data.viewSelection === 'placeAuPeriodFrequency') {
			// todo component
		}
	}
	return null;
};


const mapStateToProps = state => {
	return {
		scope: Select.scopes.getActiveScopeData(state),
		isLoggedIn: Select.users.isLoggedIn(state),
	};
};

export default connect(mapStateToProps)(MagicSwitch);

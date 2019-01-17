import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ChangeReviewMapControl from '../components/containers/controls/ChangeReviewMapControl';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';
import ThemeSelector from '../components/common/viewSelectors/ThemeSelector';
import PeriodsSelector from "../components/common/viewSelectors/PeriodsSelector";
import VisualizationSelector from "../components/common/viewSelectors/VisualizationSelector";
import ShareButton from '../components/common/controls/Share/Button';

const MagicSwitch = ({scope, isLoggedIn}) => {
	if (scope && scope.data) {
		if (scope.data.featurePlaceChangeReview) {
			return <ChangeReviewMapControl />
		} else if (scope.data.configuration && scope.data.configuration.viewSelection === "geoinvaze"){
			return (
				<div className="ptr-view-selection-wrapper">
					<PlaceSelector/>
					<ThemeSelector/>
					{isLoggedIn ? <div className="ptr-view-selection-container"><ShareButton/></div> : null}
				</div>
			);
		} else if (!scope.data.viewSelection) {
			return (
				<div className="ptr-view-selection-wrapper">
					<PlaceSelector/>
					<ThemeSelector/>
					<PeriodsSelector/>
					<VisualizationSelector/>
					{isLoggedIn ? <div className="ptr-view-selection-container"><ShareButton/></div> : null}
				</div>
			);
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

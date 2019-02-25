import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ChangeReviewMapControl from '../components/containers/controls/ChangeReviewMapControl';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';
import ThemeSelector from '../components/common/viewSelectors/ThemeSelector';
import PeriodsSelector from "../components/common/viewSelectors/PeriodsSelector";
import VisualizationSelector from "../components/common/viewSelectors/VisualizationSelector";
import ShareButton from '../components/common/controls/Share/Button';
import VisualizationManagement from "../components/common/viewSelectors/VisualizationManagement";

const MagicSwitch = ({scope, isLoggedIn, isAdmin}) => {
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
					<div className="ptr-view-selection-selectors">
						<PlaceSelector/>
						<ThemeSelector/>
						<PeriodsSelector/>
						<VisualizationSelector/>
						{isAdmin ? <VisualizationManagement/> : null}
					</div>
					<div className="ptr-view-selection-tools">
						{isLoggedIn ? <div className="ptr-view-selection-container"><ShareButton/></div> : null}
					</div>
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
		isAdmin: Select.users.isAdminOrAdminGroupMember(state)
	};
};

export default connect(mapStateToProps)(MagicSwitch);

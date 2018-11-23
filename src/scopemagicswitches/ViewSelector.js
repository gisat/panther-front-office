import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ChangeReviewMapControl from '../components/containers/controls/ChangeReviewMapControl';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';
import ThemeSelector from '../components/common/viewSelectors/ThemeSelector';

const MagicSwitch = ({scope}) => {
	if (scope && scope.data) {
		if (scope.data.featurePlaceChangeReview) {
			return <ChangeReviewMapControl />
		} else if (!scope.data.viewSelection) {
			return (
				<div className="ptr-view-selection-wrapper">
					<PlaceSelector/>
					<ThemeSelector/>
				</div>
			);
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

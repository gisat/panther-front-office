import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ChangeReviewMapControl from '../components/containers/controls/ChangeReviewMapControl';
import PlaceSelector from '../components/containers/view-selectors/PlaceSelector';

const MagicSwitch = ({scope}) => {
	if (scope && scope.data) {
		if (scope.data.featurePlaceChangeReview) {
			return <ChangeReviewMapControl />
		} else if (!scope.data.viewSelection) {
			return <PlaceSelector/>
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

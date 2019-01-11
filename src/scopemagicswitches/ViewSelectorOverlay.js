import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiPeriodsSelectorOverlay from '../components/containers/view-selectors/AoiPeriodsSelector/Overlay';


const MagicSwitch = ({scope}) => {
	if (scope && scope.data) {
		if (scope.data.viewSelection === 'aoiPeriodsSelector' && scope.data.aoiLayer) {
			return <AoiPeriodsSelectorOverlay />
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

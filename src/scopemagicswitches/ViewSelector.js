import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiPeriodsSelector from '../components/containers/view-selectors/AoiPeriodsSelector';


const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.viewSelection === 'aoiPeriodsSelector' && scope.aoiLayer) {
			return <AoiPeriodsSelector />
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

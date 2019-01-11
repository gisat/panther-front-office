import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ScenarioMapEditingOverlay from '../components/containers/overlays/ScenarioMapEditingOverlay';

const MagicSwitch = ({scope}) => {
	if (scope && scope.data) {
		if (scope.data.scenarios) {
			return <ScenarioMapEditingOverlay />
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

import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import MapEditingOverlay from '../components/containers/overlays/MapEditingOverlay';

const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.scenarios) {
			return <MapEditingOverlay />
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

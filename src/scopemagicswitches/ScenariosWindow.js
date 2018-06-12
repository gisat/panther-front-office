import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import ScenariosWindow from '../components/containers/windows/ScenariosWindow/ScenariosWindow';

const MagicSwitch = ({scope}) => {
	if (scope){
		if (scope.scenarios){
			return <ScenariosWindow />;
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

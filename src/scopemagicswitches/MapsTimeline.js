import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import MapsTimelineContainer from '../components/controls/MapsTimelineContainer';


const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.showTimeline && scope.aoiLayer) {
			return <MapsTimelineContainer />
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

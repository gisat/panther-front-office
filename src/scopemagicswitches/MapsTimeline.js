import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiWmsMapsTimeline from '../components/containers/controls/AoiWmsMapsTimeline';
import MapsTimeline from '../components/containers/controls/MapsTimeline';
import PlaceWmsMapsTimeline from '../components/containers/controls/PlaceWmsMapsTimeline';
import AuAttributeFrequencyGraph from '../components/containers/controls/MapsTimeline/content/AuAttributeFrequencyGraph';


const MagicSwitch = ({scope}) => {
	if (scope) {
		if (scope.showTimeline && scope.aoiLayer) {
			return <AoiWmsMapsTimeline />
		}
		// todo indication on scope
		if (scope.showTimeline && scope.viewSelection === 'placeSelector') {
			return <PlaceWmsMapsTimeline />
		}
		if (scope.showTimeline && scope.timelineContent === "auAttributeFrequencyGraph") {
			return <MapsTimeline content={AuAttributeFrequencyGraph} />
		}
		if (scope.showTimeline) {
			return <MapsTimeline />
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

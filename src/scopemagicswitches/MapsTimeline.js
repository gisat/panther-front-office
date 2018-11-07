import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import AoiWmsMapsTimeline from '../components/containers/controls/AoiWmsMapsTimeline';
import MapsTimeline from '../components/containers/controls/MapsTimeline';
import PlaceWmsMapsTimeline from '../components/containers/controls/PlaceWmsMapsTimeline';
import DromasLpisChangeReviewMapsTimeline from '../components/scopeSpecific/DromasLpisChangeReview/mapsTimeline';
import AuAttributeFrequencyGraph from '../components/containers/controls/MapsTimeline/content/AuAttributeFrequencyGraph';


const MagicSwitch = ({scope}) => {
	if (scope && scope.data) {
		if (scope.data.showTimeline && scope.data.aoiLayer) {
			return <AoiWmsMapsTimeline />
		}
		if (scope.data.configuration && scope.data.configuration.dromasLpisChangeReview) {
			return <DromasLpisChangeReviewMapsTimeline />
		}
		// todo indication on scope
		if (scope.data.showTimeline && scope.data.viewSelection === 'placeSelector') {
			return <PlaceWmsMapsTimeline />
		}
		if (scope.data.showTimeline && scope.data.timelineContent === "auAttributeFrequencyGraph") {
			return <MapsTimeline content={AuAttributeFrequencyGraph} />
		}
		if (scope.data.showTimeline) {
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

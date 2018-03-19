import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import MapsTimelineContainer from '../MapsTimelineContainer/MapsTimelineContainer';

const mapStateToProps = state => {
	return {
		maps: Select.maps.getMaps(state),
		activeMapKey: Select.maps.getActiveMapKey(state),
		period: Select.periods.getActivePeriod(state),
		scope: Select.scopes.getActiveScopeData(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setActive: (key) => {
			dispatch(Action.maps.setActive(key));
		},
		initialize: () => {
			dispatch(Action.maps.initialize());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MapsTimelineContainer);
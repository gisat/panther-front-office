import { connect } from 'react-redux';
import Action from '../../../state/Action';
import MapsTimeline from './MapsTimeline';

const mapStateToProps = state => {
	return {
		maps: state.maps
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

export default connect(mapStateToProps, mapDispatchToProps)(MapsTimeline);
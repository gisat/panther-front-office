import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import MapEditingOverlay from "../../presentation/overlays/MapEditingOverlay/MapEditingOverlay";

const mapStateToProps = (state, ownProps) => {
	return {
		open: false
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		close: () => {
			dispatch(Action.components.overlays.closeOverlay('mapEditing'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditingOverlay);
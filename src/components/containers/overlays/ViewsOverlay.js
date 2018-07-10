import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

const mapStateToProps = (state) => {
	return {
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'})
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		close: () => {
			dispatch(Action.components.overlays.closeOverlay('views'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsOverlay);
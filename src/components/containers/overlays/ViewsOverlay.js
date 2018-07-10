import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

const mapStateToProps = (state) => {
	let scopes = Select.scopes.getScopes(state);

	return {
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'}),
		scopes: scopes ? scopes : [],
		selectedScope: Select.components.overlays.views.getSelectedScopeData(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		selectScope: (key) => {
			dispatch(Action.components.overlays.views.setSelectedScope(key));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsOverlay);
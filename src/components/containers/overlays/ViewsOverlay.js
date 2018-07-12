import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

const mapStateToProps = (state) => {
	let scopes = Select.scopes.getScopes(state);

	return {
		active: Select.components.overlays.isOverlayActive(state, {key: 'views'}),
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'}),
		intro: Select.components.overlays.views.getIntro(state),
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
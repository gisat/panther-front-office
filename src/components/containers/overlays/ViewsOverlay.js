import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

import {filterScopesByUrl} from '../../../utils/models';

const mapStateToProps = (state) => {
	let scopes = Select.scopes.getScopesForActiveUser(state);
	let url = window.location.origin;
	let filteredScopes = filterScopesByUrl(scopes, url);

	return {
		active: Select.components.overlays.isOverlayActive(state, {key: 'views'}),
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'}),
		intro: Select.components.overlays.views.getIntro(state),
		scopes: filteredScopes ? filteredScopes : [],
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
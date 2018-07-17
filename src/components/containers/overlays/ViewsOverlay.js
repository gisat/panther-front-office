import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

import {filterScopesByUrl} from '../../../utils/models';

const mapStateToProps = (state) => {
	let scopes = Select.scopes.getScopesForActiveUser(state);
	let isAdmin = Select.users.isDromasAdmin(state);
	let url = window.location.origin;
	let hostName = window.location.hostname;
	let filteredScopes = (isAdmin || hostName === "localhost")  ? scopes : filterScopesByUrl(scopes, url);

	return {
		active: Select.components.isAppInIntroMode(state),
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
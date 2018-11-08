import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsOverlay from "../../presentation/overlays/ViewsOverlay/ViewsOverlay";

import utils from '../../../utils/utils';
import {filterScopesByUrl} from '../../../utils/models';

const mapStateToProps = (state) => {
	let scopes = Select.scopes.getScopesForActiveUser(state);
	let isAdminGroupMember = Select.users.isAdminGroupMember(state);
	let url = window.location.origin;
	let hostName = window.location.hostname;

	// todo move hostName to configuration
	let filteredScopes = (isAdminGroupMember || hostName === "localhost" || hostName === "192.168.2.205")  ? scopes : filterScopesByUrl(scopes, url);

	return {
		active: Select.components.isAppInIntroMode(state),
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'}),
		intro: Select.components.overlays.views.getIntro(state),
		scopes: filteredScopes ? filteredScopes : [],
		selectedScope: Select.components.overlays.views.getSelectedScopeData(state)
	}
};

const mapDispatchToPropsFactory = () => {

	const componentId = 'ViewsOverlay_' + utils.randomString(6);

	return (dispatch) => {
		return {
			selectScope: (key) => {
				dispatch(Action.components.overlays.views.setSelectedScope(key));
				dispatch(Action.scopes.setActiveKey(key));
				// dispatch(Action.dataviews.ensureForScope(key, 1, 1000));
				dispatch(Action.dataviews.useIndexedClear(componentId));
				dispatch(Action.dataviews.useIndexed({dataset: key}, null, 1, 1000, componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(ViewsOverlay);
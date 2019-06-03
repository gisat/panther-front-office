import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';
import utils from '../../utils/utils';

import Store from './store';
import Demo from './Demo';
import Select from '../../state/Select';

import User from '../../components/common/controls/User';


export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('demo'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());


	// TODO only for testing
	Store.dispatch(Action.scopes.setActiveKey("c883e330-deb2-4bc4-b1e3-6b412791e5c0"));

	Store.dispatch(Action.maps.addMap({key: 'Map1'}));
	Store.dispatch(Action.maps.addMap({key: 'Map2'}));
	Store.dispatch(Action.maps.addSet({key: 'MapSet1'}));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map1'));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map2'));
	Store.dispatch(Action.maps.setSetWorldWindNavigator('MapSet1'));
	Store.dispatch(Action.maps.setSetSync('MapSet1', {
		location: true,
		range: true
	}));

	Store.dispatch(Action.screens.addSet('demo'));
	Store.dispatch(Action.app.setKey('demo'));
	// Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User', 40, 40, User, null));
	// Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User-2', 40, 40, User, null));
	// Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User-3', 40, 40, User, null));


	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));

}
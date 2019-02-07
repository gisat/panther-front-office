import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';

import Store from './store';
import Demo from './Demo';
import Select from '../../state/Select';

import User from '../../components/common/controls/User';

import '../../index.css';

export default () => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());


	// TODO only for testing
	Store.dispatch(Action.scopes.setActiveKey("b612fb63-ba4f-4e1f-b1df-ad63c2ff8cf0"));

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
	Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User', 40, 40, User, null));
	Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User-2', 40, 40, User, null));
	Store.dispatch(Action.screens.addOrUpdate('demo', 'demo-User-3', 40, 40, User, null));

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));

	Store.dispatch(Action.maps.addLayer('Map1', {layerTemplate: "fcbd3f6b-d376-4e83-a0e2-03bdf36c3b46"}));

	Store.dispatch(Action.maps.addLayer('Map2', {layerTemplate: "54b2d81b-9cd2-4409-ac1c-464c864bd1dc"}));
}
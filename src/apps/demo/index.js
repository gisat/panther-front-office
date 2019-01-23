import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';

import Store from './store';
import Demo from './Demo';


export default () => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// TODO only for testing
	Store.dispatch(Action.maps.addMap({key: 'Map1'}));
	Store.dispatch(Action.maps.setMapWorldWindNavigator('Map1'));
	Store.dispatch(Action.maps.addMap({key: 'Map2'}));
	Store.dispatch(Action.maps.setMapWorldWindNavigator('Map2'));
	Store.dispatch(Action.maps.addSet({key: 'MapSet1'}));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map1'));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map2'));

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));
}
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

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));
}
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';

import Store from './store';
import Demo from './Demo';


export default () => {
	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));
}
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Store, {history} from './store';

import i18n from '../../i18n';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Action from "../../state/Action";
import DocsPage from "./components/DocsPage";


export default (path) => {

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<ConnectedRouter history={history}>
				<Switch>
					<Route path={path + "/"} component={DocsPage} />
				</Switch>
			</ConnectedRouter>
		</Provider>,document.getElementById('ptr')
	);
}
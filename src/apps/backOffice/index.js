import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';

import Store, {history} from './store';
import Select from '../../state/Select';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router'

import Page from './components/Page';

import '../../index.css';

const page = component => props => (
	<Page {...props}>
		{component}
	</Page>
);

export default (path) => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<ConnectedRouter history={history}>
				<Switch>
					<Route exact path={path + "/"} render={page(<div>Dashboard</div>)} />
					<Route path={path + "/metadata"} render={({ match }) => (
						<Switch>
							<Route exact path={match.url} render={() => (<div>Metadata</div>)} />
							<Route path={`${match.url}/:dataType`} render={({match}) => (<div>{match.params.dataType}</div>)} />
						</Switch>
					)} />
				</Switch>
			</ConnectedRouter>
		</Provider>,document.getElementById('ptr')
	);
}
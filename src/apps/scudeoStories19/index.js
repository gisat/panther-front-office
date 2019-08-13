import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from "react-helmet";
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import createStore, {createHistory} from './state/Store';
import Action from "../../state/Action";

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import AppContainer from "../../components/common/AppContainer/presentation";
import GlobalWSF from "./components/GlobalWSF/presentation";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.setKey('scudeoCities19'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | SCUDEO Stories"
					defaultTitle="SCUDEO Stories"
				/>
				<AppContainer appKey="scudeoStories19">
					<ConnectedRouter history={history}>
						<>
							<Route path="/globalWSF" component={GlobalWSF} />
						</>
					</ConnectedRouter>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
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

import Docs, {Directory, Page, Anchor} from "./components/Docs";


export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('docs'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));


	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<ConnectedRouter history={history}>
				<Switch>
					<Docs>
						<Directory path="components">
							<Page path="button"/>
							<Page path="forms"/>
							<Page path="pantherSelect">
								<Anchor path="usage"/>
								<Anchor path="extending"/>
							</Page>
						</Directory>
					</Docs>
				</Switch>
			</ConnectedRouter>
		</Provider>,document.getElementById('ptr')
	);
}
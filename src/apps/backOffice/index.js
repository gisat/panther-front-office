import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import Action from '../../state/Action';
import Store, {history} from './store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Page from './components/Page';
import TestSelectPage from './components/TestSelect';

import Test from './components/Test';
import MetadataBase from './components/pages/MetadataBase';
import AppContainer from "../../components/common/AppContainer";

import cz from "./locales/cz/common";
import en from "./locales/en/common";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

/**
 * Returns function returning BO Page for given component & screen set key
 * @param appPath - path on which the app is currently running
 * @param managedAppKey (optional) - limits BO to managing one given app
 * @returns {function(*=, *): function(*): *}
 */
const pageFactory = (appPath, managedAppKey) => (component, screenSetKey) => props => {
	props = {...props, screenSetKey, appPath};
	return (
		<Page {...props} managedAppKey={managedAppKey}>
			{React.createElement(component, {...props})}
		</Page>
	)
};

export default (path, managedAppKey) => {
	let page = pageFactory(path, managedAppKey);

	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<AppContainer loginRequired>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path={path + "/"} render={page(Test, "base")} />
						<Route exact path={path + "/test"} render={page(Test, "test")} />
						<Route exact path={path + "/testselect"} render={page(TestSelectPage, "testselect")} />
						<Route path={path + "/metadata"} render={page(MetadataBase, "metadata")} />
					</Switch>
				</ConnectedRouter>
			</AppContainer>
		</Provider>,document.getElementById('ptr')
	);
}
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import Action from './state/Action';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Page from './components/Page';
import TestSelectPage from './components/TestSelect';

import Test from './components/Test';
import AppContainer from "../../components/common/AppContainer";
import Apps from './components/pages/Apps';
import Dashboard from './components/pages/Dashboard';
import Places from './components/pages/Places';
import SpatialDataSources from './components/pages/SpatialDataSources';
import AttributeDataSources from './components/pages/AttributeDataSources';
import MetadataBase from './components/pages/MetadataBase';
import Users from './components/pages/Users';

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
const pageFactory = (appPath, managedAppKey) => (component, screenSetKey, baseActiveWidth = 40) => props => {
	props = {...props, screenSetKey, appPath, baseActiveWidth};
	return (
		<Page {...props} managedAppKey={managedAppKey}>
			{React.createElement(component, {...props})}
		</Page>
	)
};

export default (path, baseUrl, managedAppKey) => {

	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	let page = pageFactory(path, managedAppKey);

	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Set managed app if called with managedAppKey
	if (managedAppKey) Store.dispatch(Action.specific.apps.setManaged(managedAppKey));

	ReactDOM.render(
		<Provider store={Store}>
			<AppContainer loginRequired>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path={path + "/"} render={page(Dashboard, "base")} />
						<Route path={path + "/apps"} render={page(Apps, "apps", 40)} />
						<Route path={path + "/places"} render={page(Places, "base")} />
						<Route path={path + "/spatialDataSources"} render={page(SpatialDataSources, "base")} />
						<Route path={path + "/attributeDataSources"} render={page(AttributeDataSources, "base")} />
						<Route path={path + "/metadata"} render={page(MetadataBase, "metadata", 40)} />
						<Route path={path + "/users"} render={page(Users, "base")} />

						<Route exact path={path + "/test"} render={page(Test, "test")} />
						<Route exact path={path + "/testselect"} render={page(TestSelectPage, "testselect")} />
					</Switch>
				</ConnectedRouter>
			</AppContainer>
		</Provider>,document.getElementById('ptr')
	);
}
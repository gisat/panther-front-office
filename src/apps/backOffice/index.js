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
import User from "../../components/common/controls/User";

import cz from "./locales/cz/common";
import en from "./locales/en/common";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

const page = (component, screenSetKey, appPath) => props => {
	props = {...props, screenSetKey, appPath};
	return (
		<Page {...props}>
			{React.createElement(component, {...props})}
		</Page>
	)
};

export default (path) => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// TODO move User somwhere else
	ReactDOM.render(
		<Provider store={Store}>
			<AppContainer loginRequired>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path={path + "/"} render={page(Test, "base", path)} />
						<Route exact path={path + "/test"} render={page(Test, "test", path)} />
						<Route exact path={path + "/testselect"} render={page(TestSelectPage, "testselect", path)} />
						<Route path={path + "/metadata"} render={page(MetadataBase, "metadata", path)} />
					</Switch>
				</ConnectedRouter>
			</AppContainer>
		</Provider>,document.getElementById('ptr')
	);
}
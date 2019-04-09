import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";

import Action from './state/Action';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import en from "./locales/en/common";

import AppContainer from "../../components/common/AppContainer";
import ReactRouterViewController from "./components/ReactRouterViewController";
import App from "./components/App";

// override and extend locales in namespaces
utils.addI18nResources('common', {en});


export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('esponFuore'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	Store.dispatch(Action.maps.addSet({key: 'esponFuore'}));
	Store.dispatch(Action.maps.setSetWorldWindNavigator('esponFuore'));
	Store.dispatch(Action.maps.setSetSync('esponFuore', {
		location: true,
		range: true
	}));
	Store.dispatch(Action.maps.addMap({key: 'Map1'}));
	Store.dispatch(Action.maps.addMapToSet('esponFuore', 'Map1'));

	ReactDOM.render(
		<Provider store={Store}>
			<Helmet
				titleTemplate="%s | ESPON FUORE"
				defaultTitle="ESPON FUORE"
			/>
			<AppContainer>
				<ConnectedRouter history={history}>
					<>
						<Route path={path + "/:viewKey"} component={ReactRouterViewController} />
						<Route component={App} />
					</>
				</ConnectedRouter>
			</AppContainer>
		</Provider>, document.getElementById('ptr')
	);
}
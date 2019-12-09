import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";
import Favicon from 'react-favicon';

import Action from './state/Action';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import en from "./locales/en/common";

import AppContext from './context';
import AppContainer from "../../components/common/AppContainer";
import ReactRouterViewController from "./components/ReactRouterViewController";
import App from "./components/App";

import favicon from './assets/favicon.ico';

// override and extend locales in namespaces
utils.addI18nResources('common', {en});


const WINDOW_SET_KEY = "esponFuore";
const MAP_SET_KEY = "esponFuore";

export default (path, baseUrl) => {

	let componentId = 'Fuore-LayersTree';

	Store.dispatch(Action.app.setKey('esponFuore'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.01));
	Store.dispatch(Action.app.setLocalConfiguration('simplifyGeometriesTolerance', 0.01));
	Store.dispatch(Action.app.loadConfiguration());

	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	//add visible layers

	ReactDOM.render(
		<>
			<Favicon url={favicon}/>
			<Provider store={Store}>
				<AppContext.Provider value={{windowSetKey: WINDOW_SET_KEY, mapSetKey: MAP_SET_KEY}}>
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
				</AppContext.Provider>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
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

import AppContext from './context';
import AppContainer from "../../components/common/AppContainer";
import ReactRouterViewController from "./components/ReactRouterViewController";
import App from "./components/App";

// override and extend locales in namespaces
utils.addI18nResources('common', {en});


const WINDOW_SET_KEY = "esponFuore";
const MAP_SET_KEY = "esponFuore";

export default (path, baseUrl) => {

	let componentId = 'Fuore-LayersTree';

	Store.dispatch(Action.app.setKey('esponFuore'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.app.setConfiguration({
		geometriesAccuracy: 0.001
	}));

	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Store.dispatch(Action.maps.addSet({key: MAP_SET_KEY}));
	// Store.dispatch(Action.maps.setSetWorldWindNavigator(MAP_SET_KEY));
	// Store.dispatch(Action.maps.setSetSync(MAP_SET_KEY, {
	// 	location: true,
	// 	range: true
	// }));
	// Store.dispatch(Action.maps.addMap({key: 'Map1'}));
	// Store.dispatch(Action.maps.addMapToSet(MAP_SET_KEY, 'Map1'));
	//applyLayerTree	
	Store.dispatch(Action.layersTrees.useIndexed({application: true}, null, null, 1, 1000, componentId)).then(() => {
		//add visible layers

		ReactDOM.render(
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
			</Provider>, document.getElementById('ptr')
		);
	})

}
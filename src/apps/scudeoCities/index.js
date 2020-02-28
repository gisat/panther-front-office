import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";

import {Action} from '@gisatcz/ptr-state';
import createStore, {createHistory} from './state/Store';
import {i18n, localesUtils} from '@gisatcz/ptr-locales';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';import './styles/index.scss';

import en from "./locales/en/common";

import AppContainer from "../../components/common/AppContainer";

import App from './components/App';
import config from "../../config";

// override and extend locales in namespaces
localesUtils.addI18nResources('common', {en});

export default (path, baseUrl) => {
	
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	Store.dispatch(Action.app.setKey('scudeoCities'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.001));
	// Store.dispatch(Action.app.loadConfiguration());

	Store.dispatch(Action.maps.addMap({key: 'scudeoCities'}));
	// Store.dispatch(Action.maps.addSet({key: 'scudeoCities'}));
	// Store.dispatch(Action.maps.addMapToSet('scudeoCities', 'scudeoCities'));
	Store.dispatch(Action.maps.setMapView('scudeoCities', {
		center: {
			lat: 49.8,
			lon: 15.4
		},
		boxRange: 500000
	}));


	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());



	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | City explorer"
					defaultTitle="City explorer"
				/>
				<AppContainer appKey="scudeoCities">
					<ConnectedRouter history={history}>
						<>
							<Route path="/:placeKey?/:contentKey?/:contentQuery?" component={App} />
						</>
					</ConnectedRouter>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
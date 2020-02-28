import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@gisatcz/ptr-state';
import Helmet from "react-helmet";

import {Action, Select} from '@gisatcz/ptr-state';
import Store, {history} from './state/Store';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

// import cz from "./locales/cz/common";

import AppContainer from "../../components/common/AppContainer";
import App from './components/App';
import _ from "lodash";
import config from "../../config";

// import App from './components/App';

export default (path, baseUrl) => {

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	Store.dispatch(Action.app.setKey('szdcInsar19'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.001));
	Store.dispatch(Action.app.loadConfiguration()).then(() => {

		let state = Store.getState();
		let activeCustomLayerKeys = Select.components.get(state, 'szdcInsar19_CustomLayers', 'active');
		let customLayersConfiguration = Select.app.getConfiguration(state, 'customLayers');
		let areaTreesAndLevels = Select.app.getConfiguration(state, 'areaTreesAndLevels');

		if (activeCustomLayerKeys && customLayersConfiguration) {
			let selectedCustomLayers = [];
			customLayersConfiguration.forEach(layer => {
				const {key, data} = layer;
				if (_.includes(activeCustomLayerKeys, key)) {
					selectedCustomLayers.push({...data, key});
				}
			});

			if (selectedCustomLayers.length) {
				Store.dispatch(Action.maps.setMapLayers('szdcInsar19', selectedCustomLayers));
			}
		}

		if (areaTreesAndLevels) {
			let areaTreeKeys = Object.keys(areaTreesAndLevels);
			Store.dispatch(Action.areas.areaTrees.useKeys(areaTreeKeys));
		}

	});
	
	// Set language
	// i18n.changeLanguage("cz");
	
	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Add default active custom layers
	// TODO move to the app configuration
	Store.dispatch(Action.components.set('szdcInsar19_CustomLayers', 'active', ['ortophoto', 'dem']));

	// Set up map
	Store.dispatch(Action.maps.addMap({
		key: 'szdcInsar19',
		data: {
			view: {
				boxRange: 2000,
				center: {lat: 50.232390, lon: 12.810656}
			},
			// backgroundLayer: {
			// 	layerTemplateKey: '2793f35f-5433-45e1-9f59-55aa99985fc2'
			// }
			backgroundLayer: {
				type: 'worldwind',
				options: {
					layer: 'wikimedia'
				}
			}
		}
	}));
	
	
	
	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | S"
					defaultTitle="S"
				/>
				<AppContainer appKey="szdcInsar19">
					<App/>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);
	
}
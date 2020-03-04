import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@gisatcz/ptr-state';
import { ConnectedRouter, connects } from '@gisatcz/ptr-state';
import { Route, Switch } from '@gisatcz/ptr-state';
import Helmet from "react-helmet";
import config from "../../../src/config";

import {Action, Select} from '@gisatcz/ptr-state';
import Store, {history} from './state/Store';
import {i18n, localesUtils} from '@gisatcz/ptr-locales';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

import cz from "./locales/cz/common";
import App from './components/App';

import {AppContainer} from "@gisatcz/ptr-components";
const ConnectedAppContainer = connects.AppContainer(AppContainer);

// override and extend locales in namespaces
localesUtils.addI18nResources('common', {cz});

export default (path, baseUrl) => {

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	Store.dispatch(Action.app.setKey('tacrGeoinvaze'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.components.set('tacrGeoinvaze_CaseSelectContent', 'showIntro', true));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.001));
	// Store.dispatch(Action.app.loadConfiguration());
	Store.dispatch(Action.app.loadConfiguration()).then(() => {
		let state = Store.getState();
		let actualExpansionTemplateKey = Select.app.getConfiguration(state, 'templates.actualExpansion');
		if (actualExpansionTemplateKey) Store.dispatch(Action.layerTemplates.setActiveKey(actualExpansionTemplateKey));
	});

	Store.dispatch(Action.periods.useIndexed({application: true}, null, [["period", "descending"]], 1, 1, 'tacrGeoinvaze')).then(() => {
		let state = Store.getState();
		let latestPeriodInArray = Select.periods.getIndexed(state, {application: true}, null, [["period", "descending"]], 1, 1);
		if (latestPeriodInArray && latestPeriodInArray[0]) Store.dispatch(Action.periods.setActiveKey(latestPeriodInArray[0].key));
	});

	// TODO just for testing
	// Store.dispatch(Action.layerTemplates.setActiveKey('5ff15c35-e6dc-4204-9720-80ad5f7b67a0'));
	// Store.dispatch(Action.periods.setActiveKey('b8d08665-ca80-4fd7-968d-9cad82f4e1a3'));
	// Store.dispatch(Action.cases.setActiveKey('fa8f6402-2f4d-4286-9b4b-7f48cf6e60bf'));

	Store.dispatch(Action.maps.addMap({
		key: 'tacrGeoinvaze',
		data: {
			backgroundLayer: {
				layerTemplateKey: '7fe2f005-b7db-408e-bdc9-a2f928a62ab7'
			},
			layers: [
				{
					key: 'thematicLayer',
					filterByActive: {
						layerTemplate: true,
						period: true,
						case: true
					}
				}
			]
		}
	}));
	Store.dispatch(Action.maps.addSet({
		key: 'tacrGeoinvaze',
		data: {
			view: {
				center: {
					lat: 49.7,
					lon: 15.5
				},
				boxRange: 525000
			}
		}
	}));
	Store.dispatch(Action.maps.addMapToSet('tacrGeoinvaze', 'tacrGeoinvaze'));

	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());


	path = path || '';

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					// titleTemplate="%s | Geoinvaze"
					defaultTitle="Geoinformační portál biologických invazí"
				/>
				<ConnectedAppContainer appKey="tacrGeoinvaze">
					<ConnectedRouter history={history}>
						<>
							<Route path={path + "/:caseKey?/:layerTemplateKey?/:periodKey?"} component={App} />
						</>
					</ConnectedRouter>
				</ConnectedAppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";
import Favicon from 'react-favicon';

import Action from './state/Action';
import Select from './state/Select';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import favicon from './assets/favicon.ico';

import AppContainer from "../../components/common/AppContainer";
import App from "./App";


const cz = {};
// override and extend locales in namespaces
utils.addI18nResources('common', {cz});

export default (path, baseUrl) => {

	i18n.changeLanguage('cz');

	Store.dispatch(Action.app.setKey('szifLpisZmenovaRizeni'));
	Store.dispatch(Action.specific.szifLpisZmenovaRizeni.reloadLeftCases());
	Store.dispatch(Action.app.loadConfiguration()).then(() => {
		// Add default view
		Store.dispatch(Action.views.setActiveKey(Select.app.getConfiguration(Store.getState(),'defaultViewKey')));
	});

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Add default view
	const explorerMapsState = {
		"activeSetKey": 'szifLpisZmenovaRizeni-explorerMap-set',
		"maps": {
			"szifLpisZmenovaRizeni-explorerMap-1": {
				"key": "szifLpisZmenovaRizeni-map-1",
				"name": null,
				"data": {}
			},
			"szifLpisZmenovaRizeni-explorerMap-2": {
				"key": "szifLpisZmenovaRizeni-map-2",
				"name": null,
				"data": {}
			}
		},
		"sets": {
			"szifLpisZmenovaRizeni-explorerMap-set": {
				"key": "szifLpisZmenovaRizeni-explorerMap-set",
				"maps": [
					"szifLpisZmenovaRizeni-explorerMap-1",
					"szifLpisZmenovaRizeni-explorerMap-2"
				],
				"sync": {
					"center": true,
					"roll": true,
					"range": true,
					"tilt": true,
					"heading": true,
					"boxRange": true
				},
				"data": {
					"backgroundLayer": {
						key: 'zm',
						type: 'wmts',
						options: {
							url: 'https://ags.cuzk.cz/arcgis/rest/services/zmwm/MapServer/tile/{z}/{y}/{x}?blankTile=false'
						}
					},
					"view": {
						"center": {
							"lat": 50,
							"lon": 15
						},
						"boxRange": 1000000
					}
				},
				"activeMapKey": "szifLpisZmenovaRizeni-explorerMap-1"
			}
		}
	};

	const defaultExplorerState = {
		maps: explorerMapsState,
		dates: {},
		activeLayers: {},
		search: {}
	}

	Store.dispatch(Action.components.update('szifZmenovaRizeni_SentinelExplorer', defaultExplorerState));

	ReactDOM.render(
		<>
			<Favicon url={favicon}/>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | LPIS - Změnová řízení"
					defaultTitle="LPIS - Změnová řízení"
				/>
				<AppContainer appKey="szifLpisZmenovaRizeni" loginRequired>
					<App />
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
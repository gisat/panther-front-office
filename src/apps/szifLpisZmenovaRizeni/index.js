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

import AppContainer from "../../components/common/AppContainer";
import SzifCaseList from "./components/SzifCaseList";
import SzifMapViewWrapper from "./components/SzifMapViewWrapper";
import ScreenAnimator from "../../components/common/ScreenAnimator";


const cz = {};
// override and extend locales in namespaces
utils.addI18nResources('common', {cz});

export default (path, baseUrl) => {

	i18n.changeLanguage('cz');

	Store.dispatch(Action.app.setLocalConfiguration('period', {start: '2017', end: '2020'}));
	Store.dispatch(Action.app.setLocalConfiguration('defaultLayers', [
		{
				key: 'ortofoto_akt',
				title: 'Ortofoto aktuální',
				period: {start:'2017',end:'2020'},
				type: "wms",
				zIndex: 1,
				options: {
					type: 'wms',
					"url": 'http://eagri.cz/public/app/wms/plpis.fcgi',
					params: {
						layers: 'ILPIS_RASTRY',
					}
				}
		},
		{
				key: 'ortofoto_2017_zapad',
				title: 'Ortofoto historická',
				info: 'západ 2017',
				period: {start:'2017',end:'2018'},
				type: "wms",
				zIndex: 2,
				options: {
					type: 'wms',
					"url": 'http://eagri.cz/public/app/wms/public_podklad.fcgi',
					params: {
						layers: 'ORTOFOTO_17_ZAPAD',
						time: '2017',		
					}
				}
		},
		{
				key: 'ortofoto_2018_vychod',
				info: 'východ 2018',
				title: 'Ortofoto historická',
				period: {start:'2018',end:'2019'},
				type: "wms",
				zIndex: 2,
				options: {
					type: 'wms',
					"url": 'http://eagri.cz/public/app/wms/public_podklad.fcgi',
					params: {
						layers: 'ORTOFOTO_AKT_VYCHOD',
						time: '2018',		
					}
				}
		},
		{
				key: 'ortofoto_2019_zapad',
				info: 'západ 2019',
				title: 'Ortofoto historická',
				period: {start:'2019',end:'2020'},
				type: "wms",
				zIndex: 2,
				options: {
					type: 'wms',
					"url": 'http://eagri.cz/public/app/wms/public_podklad.fcgi',
					params: {
						layers: 'ORTOFOTO_AKT_ZAPAD',
						time: '2019',		
					}
				}
		}
	]));

	Store.dispatch(Action.app.setKey('szifLpisZmenovaRizeni'));
	Store.dispatch(Action.specific.szifLpisZmenovaRizeni.reloadLeftCases());
	Store.dispatch(Action.app.loadConfiguration());

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Add default view
	const indexKey = '3bb594c3-dd3a-4ac7-992c-af8b50b6091b';
	Store.dispatch(Action.views.setActiveKey(indexKey));

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
						"type": "worldwind",
						"options": {
							"layer": "wikimedia"
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
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | LPIS - Změnová řízení"
					defaultTitle="LPIS - Změnová řízení"
				/>
				<AppContainer appKey="szifLpisZmenovaRizeni" loginRequired>
					<ScreenAnimator
						screenAnimatorKey='szifScreenAnimator'
						activeScreenKey='szifCaseList'
					>
						<SzifCaseList screenKey="szifCaseList"/>
						<SzifMapViewWrapper screenKey="szifMapView"/>
					</ScreenAnimator>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
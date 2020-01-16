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
import SzifMapView from "./components/SzifMapView";
import ScreenAnimator from "../../components/common/ScreenAnimator";


const cz = {};
// override and extend locales in namespaces
utils.addI18nResources('common', {cz});

export default (path, baseUrl) => {

	i18n.changeLanguage('cz');

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// Add default view
	Store.dispatch(Action.views.add({
		key: '3bb594c3-dd3a-4ac7-992c-af8b50b6091b',
		data: {
			state: {
				maps: {
					"activeSetKey": 'szifLpisZmenovaRizeni-map-set',
					"maps": {
						"szifLpisZmenovaRizeni-map-1": {
							"key": "szifLpisZmenovaRizeni-map-1",
							"name": null,
							"data": {}
						},
						"szifLpisZmenovaRizeni-map-2": {
							"key": "szifLpisZmenovaRizeni-map-2",
							"name": null,
							"data": {}
						}
					},
					"sets": {
						"szifLpisZmenovaRizeni-map-set": {
							"key": "szifLpisZmenovaRizeni-map-set",
							"maps": [
								"szifLpisZmenovaRizeni-map-1",
								"szifLpisZmenovaRizeni-map-2"
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
							"activeMapKey": "szifLpisZmenovaRizeni-map-1"
						}
					}
				}
			}
		}
	}));

	Store.dispatch(Action.views.setActiveKey('3bb594c3-dd3a-4ac7-992c-af8b50b6091b'));

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
						<SzifMapView screenKey="szifMapView"/>
					</ScreenAnimator>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
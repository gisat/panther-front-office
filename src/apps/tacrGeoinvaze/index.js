import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";

import Action from '../../state/Action';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import cz from "./locales/cz/common";

import AppContainer from "../../components/common/AppContainer";

import App from './components/App';

// override and extend locales in namespaces
utils.addI18nResources('common', {cz});

export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('tacrGeoinvaze'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.components.set('tacrGeoinvaze_CaseSelectContent', 'showIntro', true));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.001));
	Store.dispatch(Action.app.loadConfiguration());

	// TODO just for testing
	Store.dispatch(Action.layerTemplates.setActiveKey('5ff15c35-e6dc-4204-9720-80ad5f7b67a0'));
	Store.dispatch(Action.periods.setActiveKey('5f853535-13c5-488c-af75-b167ce2262bb'));
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
				<AppContainer appKey="tacrGeoinvaze">
					<ConnectedRouter history={history}>
						<>
							<Route path={path + "/:caseKey?/:layerTemplateKey?/:periodKey?"} component={App} />
						</>
					</ConnectedRouter>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
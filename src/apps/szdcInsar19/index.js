import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";

import Action from '../../state/Action';
import Select from '../../state/Select';
import Store, {history} from './state/Store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

// import cz from "./locales/cz/common";

import AppContainer from "../../components/common/AppContainer";
import App from './components/App';

// import App from './components/App';

// override and extend locales in namespaces
// utils.addI18nResources('common', {cz});

export default (path, baseUrl) => {
	
	Store.dispatch(Action.app.setKey('szdcInsar19'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));
	Store.dispatch(Action.app.setLocalConfiguration('geometriesAccuracy', 0.001));
	Store.dispatch(Action.app.loadConfiguration());
	
	// Set language
	// i18n.changeLanguage("cz");
	
	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

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
			},
			layers: [{
				key: 'cuzk-ortofoto',
				layerTemplateKey: '8caba0b4-9d8e-4b11-a19b-f135edb9f02d'
			},{
				key: 'dem',
				layerTemplateKey: '4d2a48de-d573-4ff1-aea1-39c89fe33818',
				opacity: 0.5
			},{
				key: 'staniceni',
				layerTemplateKey: '17d29801-b5fc-4787-ba3a-8cfe54ec5d45'
			}]
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
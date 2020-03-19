import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connects} from '@gisatcz/ptr-state';
import Helmet from "react-helmet";

import Action from './state/Action';
import Store, {history} from './state/Store';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/lib/styles/reset.css';
import '@gisatcz/ptr-core/lib/styles/base.scss';
import './styles/index.scss';

import SzifCaseTable from "./components/SzifCaseTable";
import config from "../../config";

import {AppContainer} from "@gisatcz/ptr-components";
const ConnectedAppContainer = connects.AppContainer(AppContainer);

export default (path, baseUrl) => {

	// Load Current User
	Store.dispatch(Action.app.updateLocalConfiguration(config));
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | LPIS - Změnová řízení"
					defaultTitle="LPIS - Změnová řízení"
				/>
				<ConnectedAppContainer appKey="szifLpisZmenovaRizeni">
					<SzifCaseTable/>
				</ConnectedAppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
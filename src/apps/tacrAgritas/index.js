import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@gisatcz/ptr-state';
import { ConnectedRouter } from '@gisatcz/ptr-state';
import {Redirect, Route, Switch} from '@gisatcz/ptr-state';
import Favicon from 'react-favicon';
import createStore, {createHistory} from "../tacrAgritas/state/Store";

import Action from './state/Action';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

import config from '../../config';
import utils from "./utils";
import AppContainer from "../../components/common/AppContainer/presentation";
import App from "./components/App";
import favicon from './assets/favicon.ico';
import {PageIndex} from "./components/PageIndex";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	const appConfigUrl = config.tacrAgritasDataRepositoryUrl + 'config.json';

	utils.request(appConfigUrl, "GET", null, null).then((config) => {
		if (config && config.data) {
			const d = config.data;

			if (d.configurations) {
				const data = d.configurations[0].data.data;
				Store.dispatch(Action.app.add(data));
			}
			if (d.cases) {
				Store.dispatch(Action.cases.add(d.cases));
			}
			if (d.scopes) {
				Store.dispatch(Action.scopes.add(d.scopes));
			}
			if (d.periods) {
				Store.dispatch(Action.periods.add(d.periods));
			}
			if (d.places) {
				Store.dispatch(Action.places.add(d.places));
			}
			if (d.activeCaseKey) {
				Store.dispatch(Action.cases.setActiveKey(d.activeCaseKey));
			}
			if (d.activePeriodKey) {
				Store.dispatch(Action.periods.setActiveKey(d.activePeriodKey));
			}
			if (d.activeScopeKey) {
				Store.dispatch(Action.scopes.setActiveKey(d.activeScopeKey));
			}

			const pages = d.places.map(place => place.key);
			ReactDOM.render(
				<>
					<Favicon url={favicon}/>
					<Provider store={Store}>
						<AppContainer appKey="tacrAgritas">
							<ConnectedRouter history={history}>
								<Switch>
									{pages.map(key =>
										<Route
											key={key}
											path={"/" + key}
											render={(props) => (<App placeKey={key}/>)}
										/>
									)}

									{/* default path */}
									<Route path="/" render={() => (
										<PageIndex places={d.places}/>
									)}/>
								</Switch>
							</ConnectedRouter>
						</AppContainer>
					</Provider>
				</>, document.getElementById('ptr')
			);

		} else {
			throw new Error("No data in config!");
		}
	});
}
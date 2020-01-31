import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {Redirect, Route, Switch} from 'react-router';
import Favicon from 'react-favicon';
import createStore, {createHistory} from "../tacrAgritas/state/Store";

import Action from './state/Action';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import config from '../../config';
import mockConfig from './mockConfig.json';
import utils from "./utils";
import AppContainer from "../../components/common/AppContainer/presentation";
import App from "./components/App";
import favicon from './assets/favicon.ico';
import {PageIndex} from "./components/PageIndex";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	const appConfigUrl = config.tacrAgritasDataRepositoryUrl + 'config.json';

	utils.request(appConfigUrl, "GET", null, null).then((config) => {
		if (config && config.data) {
			const d = config.data;
			// TODO replace mock with real data
			// const d = mockConfig.data;

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
				// TODO move to config
				// Store.dispatch(Action.places.add(d.places));
				d.places = [
					{
						"key": "Agrossyn",
						"data": {
							"nameDisplay": "Agrossyn",
							"description": "Klíčany (Praha - Východ)",
							"bbox": [14.39,50.17,14.46,50.25]
						}
					},
					{
						"key": "PodebradskaBlata",
						"data": {
							"nameDisplay": "Poděbradská blata",
							"description": "Pátek (Nymburk)"
						}
					},{
						"key": "Lupofyt",
						"data": {
							"nameDisplay": "Lupofyt",
							"description": "Chrášťany (Praha - Západ)"
						}
					},{
						"key": "Stratov",
						"data": {
							"nameDisplay": "Stratov",
							"description": "Stratov (Nymburk)"
						}
					}
				];
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
									<Route exact path="/" render={() => (
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
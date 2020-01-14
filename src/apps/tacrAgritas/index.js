import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {Redirect, Route, Switch} from 'react-router';
import Helmet from "react-helmet";
import createStore, {createHistory} from "../tacrAgritas/state/Store";

import Action from '../../state/Action';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import config from '../../config';
import utils from "./utils";
import AppContainer from "../../components/common/AppContainer/presentation";
import App from "./components/App";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	const appConfigUrl = config.tacrAgritasDataRepositoryUrl + 'config.json';

	utils.request(appConfigUrl, "GET", null, null).then((config) => {
		if (config && config.data) {
			const d = config.data;

			if (d.configurations) {

				// TODO replace mock with rel data
				// const data = d.configurations[0].data.data;
				const data = {
					"resources": {
						"Agrossyn": {
							"biofyzika": {
								"2016": "AGROSSYN_LPIS2016_BIOFYZIKA_epsg4326.geojson",
								"2017": "AGROSSYN_LPIS2017_BIOFYZIKA_epsg4326.geojson",
								"2018": "AGROSSYN_LPIS2018_BIOFYZIKA_epsg4326.geojson",
								"2019": "AGROSSYN_LPIS2019_BIOFYZIKA_epsg4326.geojson"
							},
							"produktivita": {
								"2017": "AGROSSYN_LPIS2016_BIOFYZIKA_epsg4326.geojson",
								"2018": "AGROSSYN_LPIS2019_BIOFYZIKA_epsg4326.geojson"
							}
						}
					}
				};

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
					<Provider store={Store}>
						<Helmet
							titleTemplate="%s | AGRITAS"
							defaultTitle="AGRITAS"
						/>
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
										<Redirect to={"/" + pages[0]}/>
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
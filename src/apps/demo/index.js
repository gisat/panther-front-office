import React from 'react';
import ReactDOM from 'react-dom';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

import config from "../../../src/config";
import Demo from './Demo';
import {Provider} from "@gisatcz/ptr-state";
import {ConnectedRouter} from '@gisatcz/ptr-state';
import {Redirect, Route, Switch} from '@gisatcz/ptr-state';
import AppContainer from "../../components/common/AppContainer/presentation";
import createStore, {createHistory} from './state/Store';
import MapConnectedToState from "./components/MapConnectedToStore";
import Action from "../backOffice/state/Action";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.updateLocalConfiguration(config));

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<AppContainer appKey="demo">
					<ConnectedRouter history={history}>
						<Switch>
							<Route exact path="/mapState" render={() => <MapConnectedToState store={Store}/>}/>
							<Route path="/" component={Demo}/>
						</Switch>
					</ConnectedRouter>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);
}
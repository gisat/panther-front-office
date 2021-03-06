import React from 'react';
import ReactDOM from 'react-dom';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Demo from './Demo';
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {Redirect, Route, Switch} from "react-router";
import AppContainer from "../../components/common/AppContainer/presentation";
import createStore, {createHistory} from './state/Store';
import MapConnectedToState from "./components/MapConnectedToStore";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

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
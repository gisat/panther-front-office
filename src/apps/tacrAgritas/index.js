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


// metadata
import app from './data/app.json';
import cases from './data/cases.json';
import periods from './data/periods.json';
import places from './data/places.json';
import scopes from './data/scopes.json';

import AppContainer from "../../components/common/AppContainer/presentation";
import App from "./components/App";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.add(app.data.configurations[0].data.data));
	Store.dispatch(Action.cases.add(cases.data));
	Store.dispatch(Action.periods.add(periods.data));
	Store.dispatch(Action.places.add(places.data));
	Store.dispatch(Action.scopes.add(scopes.data));

	Store.dispatch(Action.cases.setActiveKey('OZIM'));
	Store.dispatch(Action.periods.setActiveKey('2019'));
	Store.dispatch(Action.scopes.setActiveKey('biofyzika'));

	const pages = places.data.map(place => place.key);

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

}
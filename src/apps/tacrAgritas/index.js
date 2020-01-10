import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {Redirect, Route, Switch} from 'react-router';
import Helmet from "react-helmet";
import createStore, {createHistory} from "../tacrAgritas/state/Store";

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import AppContainer from "../../components/common/AppContainer/presentation";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

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
							<Route
								path={"/Agrossyn"}
								render={(props) => (<div>Agrossyn</div>)}
							/>
							<Route
								path={"/Lupofyt"}
								render={(props) => (<div>Lupofyt</div>)}
							/>
							<Route
								path={"/PodebradskaBlata"}
								render={(props) => (<div>Poděbradská Blata</div>)}
							/>
							<Route
								path={"/Stratov"}
								render={(props) => (<div>Stratov</div>)}
							/>
							{/* default path */}
							<Route exact path="/" render={() => (
								<Redirect to="/Agrossyn"/>
							)}/>
						</Switch>
					</ConnectedRouter>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
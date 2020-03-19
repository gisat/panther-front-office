import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from "react-helmet";
import {Provider} from '@gisatcz/ptr-state';
import { ConnectedRouter } from '@gisatcz/ptr-state';
import { Route, Switch, Redirect, connects } from '@gisatcz/ptr-state';

import createStore, {createHistory} from './state/Store';
import {Action} from '@gisatcz/ptr-state';

import Page from './components/Page';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/lib/styles/reset.css';
import '@gisatcz/ptr-core/lib/styles/base.scss';
import './styles/index.scss';

import GlobalWSF from "./components/GlobalWSF";
import GreenAreas from "./components/GreenAreas";
import LandAssetsStructure from "./components/LandAssetsStructure";
import config from "../../config";

import {AppContainer} from "@gisatcz/ptr-components";
const ConnectedAppContainer = connects.AppContainer(AppContainer);

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	Store.dispatch(Action.app.setKey('scudeoCities19'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	const pages = [{
		key: "globalWsf",
		component: GlobalWSF,
		navigationName: "Global urban growth"
	}, {
		key: "greenAreas",
		component: GreenAreas,
		navigationName: "Green areas"
	}, {
		key: "landAssetsStructure",
		component: LandAssetsStructure,
		navigationName: "Land assets structure"
	}, 
	// {
	// 	key: "slumsMonitoring",
	// 	component: SlumsMonitoring,
	// 	navigationName: "Slums monitoring"
	// }
];

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | SCUDEO Stories"
					defaultTitle="SCUDEO Stories"
				/>
				<ConnectedAppContainer appKey="scudeoStories19">
					<ConnectedRouter history={history}>
						<Switch>
							{pages.map(page =>
								<Route
									key={page.key}
									path={"/" + page.key}
									render={(props) => (
										<Page
											component={page.component}
											pageTitle={page.navigationName}
											pageKey={page.key}
											allPages={pages}
											{...props}
										/>
									)}
								/>
							)}
							{/* default path */}
							<Route exact path="/" render={() => (
								<Redirect to="/globalWsf"/>
							)}/>
						</Switch>
					</ConnectedRouter>
				</ConnectedAppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
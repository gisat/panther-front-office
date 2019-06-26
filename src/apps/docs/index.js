import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Store, {history} from './store';

import i18n from '../../i18n';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Action from "../../state/Action";

import Docs, {Directory, Page, Anchor} from "./components/Docs";

import Index from "./components/pages/index";
import Design from "./components/pages/design";
import Typography from "./components/pages/design/Typography";


export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('docs'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));


	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<ConnectedRouter history={history}>
					<Docs path={path} component={Index}>
						<Directory label="Data" path="data" colour="#91aee4">
							<Page label="Common types" path="common"/>
						</Directory>
						<Directory label="Design" path="design" component={Design} colour="#fbff00">
							<Page label="Typography" path="typography" component={Typography} />
							<Page label="Colours" path="colours"/>
						</Directory>
						<Directory label="Components" path="components" colour="#e49191">
							<Directory label="Maps" path="maps">
								<Page label="WebWorldWind" path="webWorldWind"/>
							</Directory>
							<Directory label="Visualizations" path="visualizations">
								<Page label="Line chart" path="lineChart"/>
								<Page label="Column chart" path="columnChart"/>
							</Directory>
							<Directory label="Atoms" path="atoms">
								<Page label="Buttons" path="buttons"/>
								<Page label="Forms" path="forms"/>
							</Directory>
							<Directory label="Interface elements" path="interfaceElements">
								<Page label="Panther select" path="pantherSelect">
									<Anchor label="Usage" path="usage"/>
									<Anchor label="Extending" path="extending"/>
								</Page>
							</Directory>
						</Directory>
					</Docs>
			</ConnectedRouter>
		</Provider>,document.getElementById('ptr')
	);
}
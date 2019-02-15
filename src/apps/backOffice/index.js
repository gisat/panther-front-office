import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';
import utils from '../../utils/utils';

import Store, {history} from './store';
import Select from '../../state/Select';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import Page from './components/Page';
import TestSelectPage from './components/TestSelect';

import '../../index.css';
import '../../styles/_variables.scss';
import './styles/_variables.scss';

import Test from './components/Test';
import LayerTemplateMetadataScreen from "../../components/common/backOffice/metadataScreens/LayerTemplateMetadataScreen";
import AppContainer from "../../components/common/AppContainer";
import User from "../../components/common/controls/User";

import cz from "./locales/cz/common";
import en from "./locales/en/common";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

const page = component => props => (
	<Page {...props}>
		{component}
	</Page>
);

export default (path) => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	// TODO move User somwhere else
	ReactDOM.render(
		<Provider store={Store}>
			<AppContainer loginRequired>
				<User/>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path={path + "/"} render={page(<div>Dashboard</div>)} />
						<Route exact path={path + "/test"} render={page(<Test />)} />
						<Route exact path={path + "/testselect"} render={page(<TestSelectPage />)} />
						<Route path={path + "/metadata"} render={({ match }) => (
							<Switch>
								<Route exact path={match.url} render={() => (<div>Metadata</div>)} />
								<Route exact path={`${match.url}/layerTemplate`} render={page(<LayerTemplateMetadataScreen layerTemplateKey="fcbd3f6b-d376-4e83-a0e2-03bdf36c3b46"/>)} />
								<Route path={`${match.url}/:dataType`} render={({match}) => (<div>{match.params.dataType}</div>)} />
							</Switch>
						)} />
						<Route path={path + "/test"} render={page(<Test/>)} />
					</Switch>
				</ConnectedRouter>
			</AppContainer>
		</Provider>,document.getElementById('ptr')
	);
}
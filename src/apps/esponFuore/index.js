import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import Action from '../../state/Action';
import Store, {history} from './store';
import i18n from '../../i18n';
import utils from '../../utils/utils';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import en from "./locales/en/common";

import AppContainer from "../../components/common/AppContainer";
import ReactRouterViewController from "./components/ReactRouterViewController";
import App from "./components/App";

// override and extend locales in namespaces
utils.addI18nResources('common', {en});


export default path => {

	// Set language
	i18n.changeLanguage("en");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<AppContainer>
				<ConnectedRouter history={history}>
					<>
						<Route path={path + "/:viewKey"} component={ReactRouterViewController} />
						<Route component={App} />
					</>
				</ConnectedRouter>
			</AppContainer>
		</Provider>, document.getElementById('ptr')
	);
}
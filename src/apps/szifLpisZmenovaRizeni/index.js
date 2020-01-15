import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import Helmet from "react-helmet";

import Action from './state/Action';
import Store, {history} from './state/Store';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import AppContainer from "../../components/common/AppContainer";
import SzifCaseTable from "./components/SzifCaseTable";
import SzifCaseForm from "./components/SzifCaseForm";
import User from '../../components/common/controls/User';
import ScreenAnimator from '../../components/presentation/ScreenAnimator/ScreenAnimator';
import i18n from '../../i18n';


export default (path, baseUrl) => {

	i18n.changeLanguage('cz');

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					titleTemplate="%s | LPIS - Změnová řízení"
					defaultTitle="LPIS - Změnová řízení"
				/>
				<AppContainer appKey="szifLpisZmenovaRizeni" loginRequired>
					<User/>
						<ScreenAnimator
							activeScreenKey={'szifCaseForm'}
							// activeScreenKey={'szifCaseTable'}
						>
							<SzifCaseTable screenKey="szifCaseTable" />
							<SzifCaseForm screenKey="szifCaseForm"/>
						</ScreenAnimator>
					{/* <div>
						<SzifCaseView />
					</div> */}
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
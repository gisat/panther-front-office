import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@gisatcz/ptr-state';
import { ConnectedRouter } from '@gisatcz/ptr-state';
import { Route, Switch } from '@gisatcz/ptr-state';
import Helmet from "react-helmet";
import Favicon from 'react-favicon';

import Action from './state/Action';
import Store, {history} from './state/Store';
import {i18n, localesUtils} from '@gisatcz/ptr-locales';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

import en from "./locales/en/common";

import SubAppContextProvider from './components/App/context/SubAppContextProvider';
import AppContainer from "../../components/common/AppContainer";

import DistrictsSecond from './components/pages/DistrictsSecond/subAppWrapper';
import Districts from './components/pages/Districts/subAppWrapper';
import Trees from './components/pages/Trees/subAppWrapper';
import LandingPage from './components/pages/LandingPage/presentation';
import config from "../../config";

// override and extend locales in namespaces
localesUtils.addI18nResources('common', {en});


export default (path, baseUrl) => {
	Store.dispatch(Action.app.updateLocalConfiguration(config));

	// Set language
	i18n.changeLanguage("en");

	ReactDOM.render(
		<>
			<Favicon url={["data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QNxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDcyRDQzMDQyNjIwNjgxMTgyMkFDN0E4MDg1NDI1NDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODk0OEY3QzFFRDhCMTFFNEEyOUM5RDgwMjRGQTg5RjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODk0OEY3QzBFRDhCMTFFNEEyOUM5RDgwMjRGQTg5RjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3MkQ0MzA0MjYyMDY4MTE4MjJBQzdBODA4NTQyNTQxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ3MkQ0MzA0MjYyMDY4MTE4MjJBQzdBODA4NTQyNTQxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwv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"]}/>
			<Provider store={Store}>
				<SubAppContextProvider>
					<Helmet
						titleTemplate="%s | UN SEEA"
						defaultTitle="UN SEEA"
					/>
					<AppContainer>
						<ConnectedRouter history={history}>
							<Switch>
								{/* <Route exact path={path + "/"} render={page(Dashboard, "base")} /> */}
								<Route path={path + "/districtsSecond"} component={DistrictsSecond} />
								<Route path={path + "/districts"} component={Districts} />
								<Route path={path + "/trees"} component={Trees} />
								<Route path={path} component={LandingPage} />
							</Switch>
						</ConnectedRouter>
					</AppContainer>
				</SubAppContextProvider>
			</Provider>
		</>, document.getElementById('ptr')
	);
}
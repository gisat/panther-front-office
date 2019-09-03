import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from "react-helmet";
import { Provider } from 'react-redux';

import createStore, {createHistory} from './state/Store';

import Action from '../../state/Action';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import AppContainer from "../../components/common/AppContainer/presentation";
import App from "./components/App";

import vuhu from './data/vuhu_krivky.json';
import vuhu0 from './data/vuhu_krivky_0.json';
import conversion from './data/conversions';

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.setKey('insarBmwStory'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	let vuhu_final = conversion.vuhu(vuhu);
	let vuhu_0_final = conversion.vuhu0(vuhu0);

	// debugger;

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					defaultTitle="Insar4BMW"
				/>
				<AppContainer appKey="insarBmwStory">
					<App/>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
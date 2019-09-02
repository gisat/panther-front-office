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
import Story from "./components/Story";

export default (path, baseUrl) => {
	const history = createHistory({ basename: path });
	const Store = createStore(history);

	Store.dispatch(Action.app.setKey('insarBmwStory'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));

	ReactDOM.render(
		<>
			<Provider store={Store}>
				<Helmet
					defaultTitle="Insar4BMW"
				/>
				<AppContainer appKey="insarBmwStory">
					<Story/>
				</AppContainer>
			</Provider>
		</>, document.getElementById('ptr')
	);

}
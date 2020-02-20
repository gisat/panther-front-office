import React from 'react';
import ReactDOM from 'react-dom';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';
import './styles/index.scss';

import Microsite from './components/Microsite/Microsite';

export default (path) => {

	ReactDOM.render(
		<Microsite/>,
		document.getElementById('ptr')
	);

}
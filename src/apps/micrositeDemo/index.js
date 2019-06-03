import React from 'react';
import ReactDOM from 'react-dom';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Microsite from './components/Microsite/Microsite';

export default (path) => {

	ReactDOM.render(
		<Microsite/>,
		document.getElementById('ptr')
	);

}
import React from 'react';
import ReactDOM from 'react-dom';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';

import Demo from './Demo';

export default (path, baseUrl) => {
	ReactDOM.render(<Demo/>,document.getElementById('ptr'));

}
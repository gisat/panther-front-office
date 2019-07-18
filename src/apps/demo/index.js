import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './Demo';

export default (path, baseUrl) => {
	ReactDOM.render(<Demo/>,document.getElementById('ptr'));

}
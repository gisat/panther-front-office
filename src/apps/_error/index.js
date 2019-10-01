import React from 'react';
import ReactDOM from 'react-dom';

export default (url, error) => {

	ReactDOM.render(
		<div>Error {error}</div>,
		document.getElementById('ptr')
	);

}
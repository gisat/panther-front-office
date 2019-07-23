import React from "react";

import './style.scss';
import Dhaka from "./cities/Dhaka";
import Dodoma from "./cities/Dodoma";

const content = placeKey => {
	switch (placeKey) {
		case 'aaa5cb85-30e6-44b4-930e-bdc411f4fef9':
			return (<Dhaka/>);
		case '67571cf4-733d-44ac-9867-7126d87ab973':
			return (<Dodoma/>);
		default:
			return null;
	}
};

const Highlights = props => (
	<div className="scudeoCities-highlights">
		{content(props.match.params.placeKey)}
	</div>
);

export default Highlights;
import React from "react";

import './style.scss';
import Dhaka from "./cities/Dhaka";

const content = placeKey => {
	switch (placeKey) {
		case 'aaa5cb85-30e6-44b4-930e-bdc411f4fef9':
			return (<Dhaka/>);
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
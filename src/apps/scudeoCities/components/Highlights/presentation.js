import React from "react";

import './style.scss';
import Dhaka from "./cities/Dhaka";


const Highlights = props => {

		switch (props.match.params.placeKey) {
			case 'aaa5cb85-30e6-44b4-930e-bdc411f4fef9':
				return (<Dhaka/>);
			default:
				return null;
		}

};

export default Highlights;
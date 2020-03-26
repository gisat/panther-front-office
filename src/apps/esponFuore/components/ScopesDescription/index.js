import React from 'react';

import './style.scss';
import {NavLink} from "react-router-dom";

class ScopesDescription extends React.PureComponent {

	render() {
		return (
			<div className="esponFuore-scopes-description">
				<NavLink to={"/"}>Back</NavLink>
			</div>
		);
	}

}

export default ScopesDescription;


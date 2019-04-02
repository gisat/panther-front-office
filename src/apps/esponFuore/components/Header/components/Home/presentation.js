import React from "react";

import esponLogo from '../../../../assets/img/espon-logo.png';

export default props => (
	<a onClick={props.onClick}>
		<img src={esponLogo} />
	</a>
);
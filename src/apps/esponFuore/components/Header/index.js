import React from "react";

import esponLogo from '../../assets/img/espon-logo.png';
import User from '../../../../components/common/controls/User';

export default props => (
	<div className="esponFuore-header">
		<div className="esponFuore-header-home"><img src={esponLogo} /></div>
		<div className="esponFuore-header-region-select">region</div>
		<div className="esponFuore-header-indicator-select">indicator</div>
		<div className="esponFuore-header-toolbar">
			<div>tools</div>
			<div className="esponFuore-header-toolbar-right"><User /></div>
		</div>
	</div>
);
import React from "react";

import Home from './components/Home';
import User from '../../../../components/common/controls/User';
import IndicatorSelect from './components/IndicatorSelect';
import ScopeSelect from "./components/ScopeSelect";

export default props => (
	<div className="esponFuore-header">
		<div className="esponFuore-header-home"><Home /></div>
		<div className="esponFuore-header-region-select">
			<ScopeSelect/>
		</div>
		<div className="esponFuore-header-indicator-select">
			<IndicatorSelect />
		</div>
		<div className="esponFuore-header-toolbar">
			<div>tools</div>
			<div className="esponFuore-header-toolbar-right"><User inverted/></div>
		</div>
	</div>
);
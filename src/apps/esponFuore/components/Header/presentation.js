import React from "react";

import Home from './components/Home';
import User from '../../../../components/common/controls/User';
import PantherSelect from "../../../../components/common/atoms/PantherSelect";

export default props => (
	<div className="esponFuore-header">
		<div className="esponFuore-header-home"><Home /></div>
		<div className="esponFuore-header-region-select">region</div>
		<div className="esponFuore-header-indicator-select">
			<PantherSelect
				open={props.indicatorSelectOpen}
				onSelectClick={() => {props.indicatorSelectOpen ? props.closeIndicatorSelect() : props.openIndicatorSelect()}}
				renderCurrent={p => null}
				renderList={p => null}
			/>
		</div>
		<div className="esponFuore-header-toolbar">
			<div>tools</div>
			<div className="esponFuore-header-toolbar-right"><User /></div>
		</div>
	</div>
);
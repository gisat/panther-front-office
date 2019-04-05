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
				className="esponFuore-indicator-select"
				open={props.indicatorSelectOpen}
				onSelectClick={() => {props.indicatorSelectOpen ? props.closeIndicatorSelect() : props.openIndicatorSelect()}}
				currentClasses="esponFuore-indicator-select-current"
				renderCurrent={p => (<div>current</div>)}
				listClasses="esponFuore-indicator-select-list"
				renderList={p => (<div className="esponFuore-indicator-select-content">content</div>)}
			/>
		</div>
		<div className="esponFuore-header-toolbar">
			<div>tools</div>
			<div className="esponFuore-header-toolbar-right"><User /></div>
		</div>
	</div>
);
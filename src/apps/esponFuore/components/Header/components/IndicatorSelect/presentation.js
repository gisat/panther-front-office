import React from "react";

import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";

export default props => (

	<PantherSelect
		className="esponFuore-indicator-select"
		open={props.indicatorSelectOpen}
		onSelectClick={() => {props.indicatorSelectOpen ? props.closeIndicatorSelect() : props.openIndicatorSelect()}}
		currentClasses="esponFuore-indicator-select-current"
		renderCurrent={p => (<div>current</div>)}
		listClasses="esponFuore-indicator-select-list"
	>
		<div className="esponFuore-indicator-select-content">
			<div>content</div>
			<div>more <i>interesting</i> content</div>
			<PantherSelectItem itemKey="one">an item</PantherSelectItem>
		</div>
	</PantherSelect>

);
import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import Input from "../../../../../../components/common/atoms/Input/Input";
import Icon from "../../../../../../components/common/atoms/Icon";

const renderCurrent = props => {
	if (props.indicator) {
		return (
			<>
				<div className="esponFuore-indicator-select-current-category">Employment</div>
				<div className="esponFuore-indicator-select-current-indicator" title={props.indicator.data.nameDisplay}>{props.indicator.data.nameDisplay}</div>
			</>
		);
	} else {
		//no indicator
		return (
			<span className="esponFuore-indicator-select-current-empty">Select indicator</span>
		);
	}
};

export default props => (

	<PantherSelect
		className="esponFuore-indicator-select"
		open={props.indicatorSelectOpen}
		onSelectClick={() => {props.indicatorSelectOpen ? props.closeIndicatorSelect() : props.openIndicatorSelect()}}
		currentClasses="esponFuore-indicator-select-current"
		renderCurrent={renderCurrent.bind(null, props)}
		listClasses="esponFuore-indicator-select-list"
	>
		<div className="esponFuore-indicator-select-content">
			<div className="esponFuore-indicator-select-sidebar">
				<div className="esponFuore-indicator-select-search">
					<Input value={props.searchValue} onChange={props.onChangeSearch} ><Icon icon="search" /></Input>
				</div>
				<div className="esponFuore-indicator-select-categories">
					<a>Category</a>
					<a className="selected">Another</a>
					<a>A rather embarrassingly badly named category</a>
				</div>
			</div>
			<div className="esponFuore-indicator-select-indicators">
				<PantherSelectItem itemKey="one">an item</PantherSelectItem>
				<PantherSelectItem itemKey="two">an item</PantherSelectItem>
				<PantherSelectItem itemKey="three">an item</PantherSelectItem>
			</div>
		</div>
	</PantherSelect>

);
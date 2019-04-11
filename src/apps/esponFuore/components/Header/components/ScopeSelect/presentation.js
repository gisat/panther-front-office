import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";

class ScopeSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		this.renderCurrent = this.renderCurrent.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	renderCurrent() {
		const activeScope = this.props.activeScope;
		if (activeScope) {
			return (
				<div className="esponFuore-scope-value" title={activeScope.data && activeScope.data.nameDisplay}>
					{activeScope.data && activeScope.data.nameDisplay}
				</div>
			);
		} else {
			//no indicator
			return (
				<span className="">Select scope</span>
			);
		}
	};

	render() {
		const props = this.props;
		console.log(this.props.scopes, this.props.activeKey);

		return (

			<PantherSelect
				className="esponFuore-scope-select"
				open={props.scopeSelectOpen}
				onSelectClick={() => {
					props.scopeSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onSelect={this.props.selectScope}
				currentClasses="esponFuore-scope-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="esponFuore-scope-select-list"
			>
				<>
					{props.scopes && props.scopes.map((scope) => {
						return (<PantherSelectItem itemKey={scope.key}>
							{scope.data.nameDisplay}
						</PantherSelectItem>)
					})}
				</>
			</PantherSelect>

		);
	}
}

export default ScopeSelect;

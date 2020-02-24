import React from "react";

import './style.scss';
import {PantherSelect, PantherSelectItem} from '@gisatcz/ptr-atoms';

class ScopeSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		this.renderCurrent = this.renderCurrent.bind(this);
		this.selectScope = this.selectScope.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	selectScope(key) {
		if (key !== this.props.activeScope.key) {
			this.props.selectScope(key);
		}
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

		return (

			<PantherSelect
				className="esponFuore-scope-select"
				open={props.scopeSelectOpen}
				onSelectClick={() => {
					props.scopeSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onBlur={props.closeSelect}
				onSelect={this.selectScope}
				currentClasses="esponFuore-scope-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="esponFuore-scope-select-list"
			>
				<div>
					{props.scopes && props.scopes.map((scope) => {
						return (
							<PantherSelectItem
								itemKey={scope.key}
								key={scope.key}
								disabled={scope && scope.data && scope.data.configuration && scope.data.configuration.fuoreMockScope}
							>
								{scope.data && scope.data.nameDisplay}
							</PantherSelectItem>
						);
					})}
				</div>
			</PantherSelect>

		);
	}
}

export default ScopeSelect;

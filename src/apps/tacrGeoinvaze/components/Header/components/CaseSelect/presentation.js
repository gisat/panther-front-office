import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";
import CaseSelectContent from "../CaseSelectContent";

class CaseSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		this.renderCurrent = this.renderCurrent.bind(this);
		this.selectCase = this.selectCase.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	selectCase(key) {
		if (!this.props.activeCase || (key !== this.props.activeCase.key)) {
			this.props.selectCase(key);
		}
	}

	renderCurrent() {
		const activeCase = this.props.activeCase;
		if (activeCase) {
			return (
				<div className="tacrGeoinvaze-case-value" title={activeCase.data && activeCase.data.nameDisplay}>
					{activeCase.data && activeCase.data.nameDisplay}
				</div>
			);
		} else {
			//no case
			return null;
		}
	};

	render() {
		const props = this.props;

		return (

			<PantherSelect
				className="tacrGeoinvaze-case-select"
				open={props.caseSelectOpen || !props.activeCase}
				currentDisabled={!props.activeCase}
				onSelectClick={() => {
					props.caseSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onSelect={this.selectCase}
				currentClasses="tacrGeoinvaze-case-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="tacrGeoinvaze-case-select-list"
			>
				<div className="tacrGeoinvaze-case-select-overlay">
					<div className="tacrGeoinvaze-case-select-overlay-header">
						<div className="tacrGeoinvaze-header-space">
							<div>Geoinformation portal for invasive species</div>
							Development preview
						</div>
					</div>
					<CaseSelectContent />
				</div>
			</PantherSelect>

		);
	}
}

export default CaseSelect;

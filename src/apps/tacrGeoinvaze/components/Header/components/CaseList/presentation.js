import React from "react";

import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";

class CaseSelect extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		const props = this.props;

		return (
			
			<div className="tacrGeoinvaze-case-list">
				{props.cases && props.cases.map((oneCase) => {
					return (
						<PantherSelectItem
							itemKey={oneCase.key}
							key={oneCase.key}
						>
							{oneCase.data && oneCase.data.nameDisplay}
						</PantherSelectItem>
					);
				})}
			</div>

		);
	}
}

export default CaseSelect;

import React from "react";

import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";
import CaseImage from "../../../CaseImage";

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

					let style = {};
					if (CaseImage[oneCase.key]) {
						style.backgroundImage =  `url(${CaseImage[oneCase.key]})` || null;
					}

					return (
						<PantherSelectItem
							itemKey={oneCase.key}
							key={oneCase.key}
						>
							<div className="tacrGeoinvaze-case-select-case" style={style}><span>{oneCase.data && oneCase.data.nameDisplay}</span></div>
						</PantherSelectItem>
					);
				})}
			</div>

		);
	}
}

export default CaseSelect;

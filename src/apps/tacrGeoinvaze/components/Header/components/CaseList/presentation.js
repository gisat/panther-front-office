import React from "react";

import {PantherSelect, PantherSelectItem} from '@gisatcz/ptr-atoms';
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
					if (oneCase) {
						let style = {};
						if (CaseImage[oneCase.key]) {
							style.backgroundImage =  `url(${CaseImage[oneCase.key]})` || null;
						}

						return (
							<PantherSelectItem
								itemKey={oneCase.key}
								key={oneCase.key}
							>
								<div className="tacrGeoinvaze-case-select-case" style={style}>
									<div>
										<span>{oneCase.data && oneCase.data.nameDisplay}</span>
										<i>{oneCase.data && oneCase.data.nameInternal}</i>
									</div>
								</div>
							</PantherSelectItem>
						);
					} else {
						return null;
					}
				})}
			</div>

		);
	}
}

export default CaseSelect;

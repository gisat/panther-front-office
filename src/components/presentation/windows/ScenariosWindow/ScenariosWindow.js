import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Window from "../../../containers/Window";
import ScreenAnimator from "../../ScreenAnimator/ScreenAnimator";
import CaseDetails from "../../../containers/controls/scenarios/CaseDetail/CaseDetail";
import CaseList from "../../../containers/controls/scenarios/CaseList/CaseList";

class ScenariosWindow extends React.PureComponent {
	constructor(props){
		super(props);
		this.state = {
			caseDetailType: null
		};

		this.setCaseDetailType = this.setCaseDetailType.bind(this);
	}

	setCaseDetailType(type){
		this.setState({
			caseDetailType: type
		});
	}

	render() {
		return (
			<Window
				window="scenarios"
				name="Scenarios"
				elementId="scenarios-window"
			>
				<ScreenAnimator>
					<CaseList
						screenId="caseList"
						setCaseDetailType={this.setCaseDetailType}
					/>
					<CaseDetails
						screenId="caseDetail"
						contentType={this.state.caseDetailType}
					/>
				</ScreenAnimator>
			</Window>
		);
	}

}

export default ScenariosWindow;

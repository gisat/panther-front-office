import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Window from "../../../containers/Window";
import ScreenAnimator from "../../ScreenAnimator/ScreenAnimator";
import CaseDetail from "../../../containers/controls/scenarios/CaseDetail/CaseDetail";
import CaseList from "../../../containers/controls/scenarios/CaseList/CaseList";

const DEFAULT_SITUATION_NAME = "Default state";

class ScenariosWindow extends React.PureComponent {
	render() {
		return (
			<Window
				window="scenarios"
				name="Scenarios"
				elementId="scenarios-window"
				expandable={false}
			>
				<ScreenAnimator
					activeScreenKey={this.props.activeScreenKey}
				>
					<CaseList
						changeActiveScreen={this.props.changeActiveScreen.bind(this)}
						defaultSituationName={DEFAULT_SITUATION_NAME}
						disableEditing={false}
						screenKey="caseList"
					/>
					<CaseDetail
						changeActiveScreen={this.props.changeActiveScreen.bind(this)}
						defaultSituationName={DEFAULT_SITUATION_NAME}
						disableEditing={false}
						screenKey="caseDetail"
					/>
				</ScreenAnimator>
			</Window>
		);
	}

}

export default ScenariosWindow;

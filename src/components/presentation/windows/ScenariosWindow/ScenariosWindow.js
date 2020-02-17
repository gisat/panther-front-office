import React from 'react';
import PropTypes from 'prop-types';
import {utils} from "panther-utils"
import _ from 'lodash';
import Window from "../../../containers/Window";
import ScreenAnimator from "../../ScreenAnimator/ScreenAnimator";
import CaseDetail from "../../../containers/controls/scenarios/CaseDetail/CaseDetail";
import CaseList from "../../../containers/controls/scenarios/CaseList/CaseList";

let polyglot = window.polyglot;

class ScenariosWindow extends React.PureComponent {
	render() {
		return (
			<Window
				window="scenarios"
				name={polyglot.t('scenarios')}
				elementId="scenarios-window"
				expandable={true}
				dockable={true}
			>
				<ScreenAnimator
					activeScreenKey={this.props.activeScreenKey}
				>
					<CaseList
						changeActiveScreen={this.props.changeActiveScreen.bind(this)}
						screenKey="caseList"
					/>
					<CaseDetail
						changeActiveScreen={this.props.changeActiveScreen.bind(this)}
						screenKey="caseDetail"
					/>
				</ScreenAnimator>
			</Window>
		);
	}

}

export default ScenariosWindow;

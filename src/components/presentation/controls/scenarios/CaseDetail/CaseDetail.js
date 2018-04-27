import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import './CaseDetail.css';

class CaseDetail extends React.PureComponent {

	static propTypes = {
		activeScenarioKeys: PropTypes.array,
		case: PropTypes.object,
		contentType: PropTypes.string,
		scenarios: PropTypes.array,
		screenId: PropTypes.string,
		switchScreen: PropTypes.func
	};

	render() {
		let caseData = this.props.case;
		let scenariosData = this.props.scenarios;
		let name = "";
		let description = "";
		let scenarios = null;

		// todo for non-admin
		let disableEditing = false;

		if (caseData){
			name = caseData.name;
			description = caseData.description;
		}

		if (scenariosData){
			scenarios = scenariosData.map(scenario => {
				return this.renderScenario(scenario);
			});
		} else {
			scenarios = this.renderScenario();
		}

		return (
			<div className="case-detail-wrap">
				<div className="case-detail-header">
					<div className="case-detail-header-buttons">
						<div onClick={this.props.switchScreen.bind(null, 'caseList')}>Back</div>
					</div>
					<InputText
						extraLarge
						placeholder="What is your case?"
						simpleDecoration
						uneditable={disableEditing}
						value={name}/>
					<InputText
						multiline
						placeholder="Add description..."
						simpleDecoration
						uneditable={disableEditing}
						value={description}/>
				</div>
				<div className="case-detail-body">
					{scenarios}
				</div>
			</div>
		);
	}

	renderScenario(data){
		let name = "new scenario";
		let description = "description";
		let addFile = <input type="file"/>;

		if (data){
			name = data.name;
			description = data.description;
			addFile = null;
		}

		return (
			<div className="scenario-container">
				<div>{name}</div>
				<div>{description}</div>
				{addFile}
			</div>
		);
	}

}

export default CaseDetail;

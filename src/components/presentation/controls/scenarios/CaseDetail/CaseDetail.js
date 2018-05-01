import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import ScenarioCard from '../SceanrioCard/ScenarioCard';

import './CaseDetail.css';

class CaseDetail extends React.PureComponent {

	static propTypes = {
		activeScenarioKeys: PropTypes.array,
		case: PropTypes.object,
		contentType: PropTypes.string,
		disableEditing: PropTypes.bool,
		isDefaultSituationActive: PropTypes.bool,
		scenarios: PropTypes.array,
		screenId: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props){
		super(props);

		this.state = {
			disableUncheck: false,
			scenarios: this.props.scenarios
		};

		this.addScenario = this.addScenario.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			disableUncheck: this.disableUncheck(nextProps),
			scenarios: nextProps.scenarios
		});
	}

	addScenario(){
		let nextScenarios = [...this.state.scenarios, {}];
		this.setState({
			scenarios: nextScenarios
		});
	}

	disableUncheck(props){
		if (props.activeScenarioKeys){
			let activeScenarios = props.activeScenarioKeys;
			return (activeScenarios.length === 1 && !props.isDefaultSituationActive) || (activeScenarios.length === 0 && props.isDefaultSituationActive);
		} else {
			return true;
		}
	}

	render() {
		let caseData = this.props.case;
		let scenariosData = this.state.scenarios;
		let name = "";
		let description = "";
		let scenarios = null;
		let defaultState = null;

		if (caseData){
			name = caseData.name;
			description = caseData.description;
		}

		if (scenariosData){
			defaultState = this.renderDefaultState();
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
						<button onClick={this.props.switchScreen.bind(null, 'caseList')}>Back</button>
					</div>
					<InputText
						extraLarge
						placeholder="What is your case?"
						simpleDecoration
						disableEditing={this.props.disableEditing}
						value={name}/>
					<InputText
						multiline
						placeholder="Add description"
						simpleDecoration
						disableEditing={this.props.disableEditing}
						value={description}/>
				</div>
				<div className="case-detail-body">
					{defaultState}
					{scenarios}
					<button onClick={this.addScenario}>Add next scenario</button>
				</div>
			</div>
		);
	}

	renderScenario(data){
		let name = "";
		let description = "";
		let key = null;
		let checked = false;

		if (data){
			key = data.key;
			name = data.name;
			description = data.description;
		}

		let activeScenarioKey = _.find(this.props.activeScenarioKeys, (key) => {
			return (key === data.key);
		});
		if (activeScenarioKey){
			checked = true;
		}

		return (
			<ScenarioCard
				key={utils.guid()}
				scenarioKey={key}
				checked={checked}
				disableEditing={this.props.disableEditing}
				disableUncheck={this.state.disableUncheck}
				description={description}
				handleScenarioClick={this.props.handleScenarioClick}
				name={name}
			/>
		);
	}

	renderDefaultState(){
		return (
			<ScenarioCard
				key={utils.guid()}
				defaultSituation
				checked={this.props.isDefaultSituationActive}
				disableEditing
				disableUncheck={this.state.disableUncheck}
				handleScenarioClick={this.props.handleScenarioClick}
				name="Default state"
			/>
		);
	}

}

export default CaseDetail;

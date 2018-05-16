import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import Button from '../../../atoms/Button';
import Center from '../../../atoms/Center';
import Icon from '../../../atoms/Icon';
import Menu, {MenuItem} from '../../../atoms/Menu';
import EditableText from '../../../atoms/EditableText';
import ScenarioCard from '../../../../containers/controls/scenarios/ScenarioCard';
import WorldWindow from '../../../../containers/windows/ScenariosWindow/WorldWindow/WorldWindow';

import './CaseDetail.css';

class CaseDetail extends React.PureComponent {

	static propTypes = {
		activeScenarioKeys: PropTypes.array,
		case: PropTypes.object,
		changeActiveScreen: PropTypes.func,
		contentType: PropTypes.string,
		defaultSituationName: PropTypes.string,
		disableEditing: PropTypes.bool,
		isDefaultSituationActive: PropTypes.bool,
		scenarios: PropTypes.array,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props){
		super(props);

		this.state = {
			caseEditingActive: false,
			disableUncheck: false,
			scenarios: this.props.scenarios
		};

		this.addScenario = this.addScenario.bind(this);
		this.activateCaseEditing = this.activateCaseEditing.bind(this);
		this.revertEditing = this.revertEditing.bind(this);
		this.save = this.save.bind(this);
		this.activateCaseEditing = this.activateCaseEditing.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeGeometry = this.onChangeGeometry.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
	}

	componentWillReceiveProps(nextProps){
		let caseEditing = false;
		let sameCase = (
			(nextProps.case && (this.props.case && this.props.case.key === nextProps.case.key))
			|| (nextProps.caseEdited && (this.props.caseEdited && this.props.caseEdited.key === nextProps.caseEdited.key))
		);

		if (sameCase) {
			caseEditing = this.state.caseEditingActive;
		} else if (!nextProps.case){
			caseEditing = true;
		}

		/**
		 * Turn on Default state, if there is no scenario in the Case
		 */
		if (!nextProps.scenarios && !nextProps.isDefaultSituationActive){
			nextProps.handleScenarioClick(null, true, true);
			return;
		}

		this.setState({
			disableUncheck: this.disableUncheck(nextProps),
			scenarios: nextProps.scenarios,
			caseEditingActive: caseEditing
		});
	}

	activateCaseEditing() {
		this.setState({
			caseEditingActive: true
		});
	}

	save() {
		this.props.save();
	}

	revertEditing() {
		this.setState({
			caseEditingActive: false
		});
		this.props.revertCase();
	}

	addScenario(){
		let nextScenarios = [{},{}];
		if (this.state.scenarios){
			nextScenarios = [...this.state.scenarios, {}];
		}
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

	onChangeName(value) {
		this.props.updateEditedCase('name', value);
	}

	onChangeDescription(value) {
		this.props.updateEditedCase('description', value);
	}

	onChangeGeometry(value){
		this.props.updateEditedCase('geometry', value);
	}

	render() {
		let scenariosData = this.state.scenarios;
		let scenarios = null;
		let defaultState = null;

		let name = this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty('name') ? this.props.caseEdited.data.name : this.props.case && this.props.case.name;
		let description = this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty('description') ? this.props.caseEdited.data.description : this.props.case && this.props.case.description;

		if (scenariosData){
			defaultState = this.renderDefaultState();
			scenarios = scenariosData.map(scenario => {
				return this.renderScenario(scenario);
			});
		} else {
			defaultState = this.renderDefaultState();
			scenarios = this.renderScenario();
		}

		return (
			<div className="case-detail-wrap">
				<div className="case-detail-header">
					<div className="case-detail-header-buttons">
						<div>
							<Button icon="arrow-left" invisible circular onClick={this.props.changeActiveScreen.bind(null, 'caseList')} />
						</div>
						<div>
							<Button icon="dots" invisible>
								<Menu bottom left>
									<MenuItem onClick={this.activateCaseEditing}><Icon icon="edit"/> Edit</MenuItem>
									<MenuItem><Icon icon="remove" /> Delete</MenuItem>
								</Menu>
							</Button>
						</div>
					</div>
					<EditableText
						disabled={!this.state.caseEditingActive}
						large
						value={name}
						placeholder="Case title"
						onChange={this.onChangeName}
						editing={this.state.caseEditingActive}
					/>
					<EditableText
						disabled={!this.state.caseEditingActive}
						value={description}
						placeholder="Description"
						onChange={this.onChangeDescription}
						editing={this.state.caseEditingActive}
					/>
					{this.state.caseEditingActive ? this.renderMap() : null}
					{this.state.caseEditingActive ? this.renderButtons() : null}
				</div>
				<div className="case-detail-body">
					{defaultState}
					{scenarios}
					<Center horizontally><Button circular icon="plus" onClick={this.addScenario} /></Center>
				</div>
			</div>
		);
	}

	renderMap(){
		let caseData = this.props.case;
		let caseGeometry = null;
		let caseBbox = null;

		if (caseData && caseData.geometry){
			caseGeometry = caseData.geometry;
		}

		if (!caseGeometry){
			let place = this.props.place;
			if (place && place.geometry){
				caseGeometry = place.geometry;
			}
			if (place && place.bbox){
				caseBbox = place.bbox;
			}
		}

		return (
			<div className="ptr-case-detail-map">
				<div>Extent:</div>
				<WorldWindow
					bbox={caseBbox}
					caseGeometry={caseGeometry}
					onGeometryChange={this.onChangeGeometry}
					zoomToGeometry
				/>
			</div>
		);
	}

	renderButtons() {
		return (
			<div className="ptr-case-detail-buttons">
				<Button onClick={this.save} primary>Save</Button>
				<Button onClick={this.revertEditing}>Revert</Button>
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
				name={this.props.defaultSituationName}
			/>
		);
	}

}

export default CaseDetail;

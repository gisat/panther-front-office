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
		caseEdited: PropTypes.object,
		changeActiveScreen: PropTypes.func,
		contentType: PropTypes.string,
		disableEditing: PropTypes.bool,
		isDefaultSituationActive: PropTypes.bool,
		scenarioKeys: PropTypes.array,
		scenarioKeysEdited: PropTypes.array,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props){
		super(props);

		this.state = {
			caseEditingActive: false,
			disableUncheck: false,
			disableCaseEditing: props.disableEditing
		};

		this.addScenario = this.addScenario.bind(this);
		this.activateCaseEditing = this.activateCaseEditing.bind(this);
		this.revertEditing = this.revertEditing.bind(this);
		this.save = this.save.bind(this);
		this.cancel = this.cancel.bind(this);
		this.discard = this.discard.bind(this);
		this.activateCaseEditing = this.activateCaseEditing.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeGeometry = this.onChangeGeometry.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
	}

	componentWillReceiveProps(nextProps){
		let caseEditing = false;
		let disableButtons = false;

		let sameCase = (
			(nextProps.case && (this.props.case && this.props.case.key === nextProps.case.key))
			|| (nextProps.caseEdited && (this.props.caseEdited && this.props.caseEdited.key === nextProps.caseEdited.key))
		);

		if ((sameCase && nextProps.caseEdited) || !nextProps.case) {
			caseEditing = true;
			disableButtons = !!(nextProps.caseEdited && nextProps.caseEdited.data && nextProps.caseEdited.data.scenarios && nextProps.caseEdited.data.scenarios.length);
		}

		/**
		 * Turn on Default state, if there is no scenario in the Case
		 */
		if ((!nextProps.activeScenarioKeys || nextProps.activeScenarioKeys.length === 0) && !nextProps.isDefaultSituationActive){
			nextProps.handleScenarioClick(null, true, true);
			return;
		}

		this.setState({
			disableUncheck: this.disableUncheck(nextProps),
			disableButtons: disableButtons,
			disableCaseEditing: disableButtons,
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

	cancel(){
		this.setState({
			caseEditingActive: false
		});
	}

	discard(){
		this.props.revert();
		this.props.discard();
	}

	revertEditing() {
		this.props.revert();
		this.setState({
			caseEditingActive: false
		});
	}

	addScenario(){
		let scenarioKey = utils.guid();
		this.props.addScenario(scenarioKey);
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
		let scenarioKeys = this.props.scenarioKeysEdited ? this.props.scenarioKeysEdited : this.props.scenarioKeys;
		let scenarios = null;
		let defaultState = null;

		let name = this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty('name') ? this.props.caseEdited.data.name : this.props.case && this.props.case.data && this.props.case.data.name;
		let description = this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty('description') ? this.props.caseEdited.data.description : this.props.case && this.props.case.data && this.props.case.data.description;

		if (scenarioKeys){
			defaultState = this.renderDefaultState();
			scenarios = scenarioKeys.map(scenario => {
				return this.renderScenario(scenario);
			});
		} else {
			defaultState = this.renderDefaultState();
		}

		let header = (
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
				{(this.state.caseEditingActive || name) ? (
					<EditableText
						disabled={!this.state.caseEditingActive || this.state.disableCaseEditing}
						large
						value={name}
						placeholder="Case title"
						onChange={this.onChangeName}
						editing={this.state.caseEditingActive}
					/>
				) : null}
				{(this.state.caseEditingActive || description) ? (
					<EditableText
						disabled={!this.state.caseEditingActive  || this.state.disableCaseEditing}
						value={description}
						placeholder="Description"
						onChange={this.onChangeDescription}
						editing={this.state.caseEditingActive}
					/>
				) : null}
				{this.state.caseEditingActive && !this.state.disableCaseEditing ? this.renderMap() : null}
				{this.state.caseEditingActive ? this.renderButtons() : null}
			</div>
		);

		let body = (
			<div className="case-detail-body">
				{defaultState}
				{scenarios}
				<Center horizontally><Button circular icon="plus" onClick={this.addScenario} /></Center>
			</div>
		);

		return (
			<div className="case-detail-wrap">
				{header}
				{body}
			</div>
		);
	}

	renderMap(){
		let caseData = this.props.case ? this.props.case.data : null;
		let caseGeometry = null;
		let caseBbox = null;

		if (this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty('geometry')){
			caseGeometry = this.props.caseEdited.data.geometry;
		} else if (caseData && caseData.geometry){
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
		let buttons = [];
		if (this.props.caseEdited){
			buttons.push(<Button key="save" onClick={this.save} disabled={this.state.disableButtons} primary>Save</Button>);
			if (this.props.case){
				buttons.push(<Button key="revert" onClick={this.revertEditing} disabled={this.state.disableButtons}>Revert</Button>);
			}
		} else {
			if (this.props.case){
				buttons.push(<Button key="cancel" onClick={this.cancel} disabled={this.state.disableButtons}>Cancel</Button>);
			}
		}

		if (!this.props.case){
			buttons.push(<Button key="discard" onClick={this.discard} disabled={this.state.disableButtons}>Discard</Button>);
		}

		return (
			<div className="ptr-case-detail-buttons">
				{buttons}
			</div>
		);
	}

	renderScenario(scenarioKey){
		let checked = false;
		let activeScenarioKey = _.find(this.props.activeScenarioKeys, (key) => {
			return scenarioKey ? (key === scenarioKey) : false;
		});
		if (activeScenarioKey){
			checked = true;
		}

		return (
			<ScenarioCard
				key={"scenario-" + scenarioKey}
				scenarioKey={scenarioKey}
				checked={checked}
				disableEditing={this.props.disableEditing}
				disableUncheck={this.state.disableUncheck}
				handleScenarioClick={this.props.handleScenarioClick}
			/>
		);
	}

	renderDefaultState(){
		return (
			<ScenarioCard
				key="default-state"
				defaultSituation
				checked={this.props.isDefaultSituationActive}
				disableEditing
				disableUncheck={this.state.disableUncheck}
				handleScenarioClick={this.props.handleScenarioClick}
			/>
		);
	}

}

export default CaseDetail;

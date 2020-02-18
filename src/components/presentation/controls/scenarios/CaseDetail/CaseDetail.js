import React from 'react';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';
import classNames from 'classnames';

import Button from '../../../../common/atoms/Button';
import Center from '../../../../common/atoms/Center';
import Icon from '../../../../common/atoms/Icon';
import Menu, {MenuItem} from '../../../../common/atoms/Menu';
import EditableText from '../../../../common/atoms/EditableText';
import ScenarioCard from '../../../../containers/controls/scenarios/ScenarioCard';
import CaseDetailWorldWindMap from '../../../../presentation/maps/CaseDetailWorldWindMap/CaseDetailWorldWindMap';

import './CaseDetail.css';
import Names from "../../../../../constants/Names";

let polyglot = window.polyglot;

class CaseDetail extends React.PureComponent {

	static propTypes = {
		activeScenarioKeys: PropTypes.array,
		case: PropTypes.object,
		caseEdited: PropTypes.object,
		changeActiveScreen: PropTypes.func,
		contentType: PropTypes.string,
		disableEditing: PropTypes.bool,
		isDefaultSituationActive: PropTypes.bool,
		activeCaseScenarioKeys: PropTypes.array,
		activeCaseEditedScenarioKeys: PropTypes.array,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func,
		editingActive: PropTypes.bool,
		editedScenarios: PropTypes.array,

		enableCreate: PropTypes.bool,
		enableDelete: PropTypes.bool,
		enableEdit: PropTypes.bool
	};

	constructor(props){
		super(props);

		this.state = {
			caseEditingActive: props.editingActive,
			disableUncheck: false,
			disableCaseEditing: props.disableEditing,
			editingScenarios: [],
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
		this.onClickBack = this.onClickBack.bind(this);
		this.editScenario = this.editScenario.bind(this);
	}

	componentWillReceiveProps(nextProps){

		let sameCase = (
			(nextProps.case && (this.props.case && this.props.case.key === nextProps.case.key))
			|| (nextProps.caseEdited && (this.props.caseEdited && this.props.caseEdited.key === nextProps.caseEdited.key))
		);

		let caseEditing = sameCase ? nextProps.editingActive : false;
		let editedData = (nextProps.caseEdited || (nextProps.editedScenariosKeys && nextProps.editedScenariosKeys.length));

		if ((sameCase && editedData) || !nextProps.case) {
			caseEditing = true;
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
			scenarios: nextProps.scenarios,
			caseEditingActive: caseEditing
		});
	}

	activateCaseEditing() {
		this.props.activateEditing();
	}

	save() {
		let scenarioWithoutMetadata = this.checkScenariosMetadata();
		if (scenarioWithoutMetadata){
			window.alert(Names.SCENARIO_CASES_SAVE_MISSING_METADATA_ALERT_MESAGE);
		} else {
			if (window.confirm(Names.SCENARIO_CASES_SAVE_CONFIRM_MESSAGE)) {
				this.props.save();
				this.props.deactivateEditing();
			}
		}
	}

	cancel(){
		this.props.deactivateEditing();
	}

	deleteCase(name){
		if (window.confirm(Names.SCENARIO_CASES_DELETE_CONFIRM_MESSAGE + ' ' + (name ? name : ""))) {
			this.props.deleteCase();
			this.discard();
		}
	}

	discard(){
		this.props.discard();
		this.props.deactivateEditing();
	}

	revertEditing() {
		this.props.revert();
		this.props.deactivateEditing();
	}

	editScenario(scenarioKey, edit) {
		if (edit) {
			// start editing
			this.setState({
				editingScenarios: _.union(this.state.editingScenarios, [scenarioKey])
			});
		} else {
			// stop editing
			this.setState({
				editingScenarios: _.without(this.state.editingScenarios, scenarioKey)
			});
		}
	}

	addScenario(){
		let scenarioKey = utils.uuid();
		this.props.addScenario(scenarioKey);

		setTimeout(() => {
			this.scrollToBottom();
		}, 200);
	}

	scrollToBottom(){
		let buttonId = this.AddScenario.props.id;
		let containerId = this.CaseDetailContent.id;
		utils.scrollTo(buttonId, containerId);
	}

	checkScenariosMetadata(){
		if (this.props.editedScenarios && this.props.editedScenarios.length){
			let missingName = false;
			this.props.editedScenarios.map(scenario => {
				if (typeof scenario.key === "string"){
					if (!scenario.data || (scenario.data && !scenario.data.name)){
						missingName = true;
					}
				} else {
					if (!scenario.data || (scenario.data && scenario.data.hasOwnProperty('name') && !scenario.data.name)){
						missingName = true;
					}
				}
			});
			return missingName;
		} else {
			return false;
		}
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

	onClickBack(){
		this.props.deactivateEditing();
		this.props.changeActiveScreen('caseList');

	}

	render() {
		console.log('### CaseDetail render', this.props);

		let scenarioKeys = this.props.activeCaseEditedScenarioKeys ? this.props.activeCaseEditedScenarioKeys : this.props.activeCaseScenarioKeys;
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
						<Button icon="arrow-left" invisible circular onClick={this.onClickBack} />
					</div>
					<div>
						<Button icon="dots" invisible>
							<Menu bottom left>
								<MenuItem disabled={!this.props.enableEdit} onClick={this.activateCaseEditing}><Icon icon="edit"/> {polyglot.t('edit')}</MenuItem>
								{this.props.enableDelete ? <MenuItem onClick={this.deleteCase.bind(this,name)}><Icon icon="delete" /> {polyglot.t('delete')}</MenuItem> : null}
							</Menu>
						</Button>
					</div>
				</div>
				{(this.state.caseEditingActive || name) ? (
					<EditableText
						disabled={!this.state.caseEditingActive || this.state.disableCaseEditing}
						large
						value={name}
						placeholder={polyglot.t('caseTitle')}
						onChange={this.onChangeName}
						editing={this.state.caseEditingActive}
					/>
				) : null}
				{(this.state.caseEditingActive || description) ? (
					<EditableText
						disabled={!this.state.caseEditingActive  || this.state.disableCaseEditing}
						value={description}
						placeholder={polyglot.t('description')}
						onChange={this.onChangeDescription}
						editing={this.state.caseEditingActive}
					/>
				) : null}
				{this.state.caseEditingActive && !this.state.disableCaseEditing ? this.renderMap() : null}
			</div>
		);

		let body = (
			<div className="case-detail-body">
				{defaultState}
				{scenarios}
				{this.props.enableCreate ? (<Center horizontally><Button id="add-scenario-button" ref={(btn) => {this.AddScenario = btn }} icon="plus" onClick={this.addScenario}>{polyglot.t('addScenario')}</Button></Center>) : null}
			</div>
		);

		return (
			<div className="case-detail-container">
				<div className="case-detail-content" id="case-detail-content" ref={(content) => {this.CaseDetailContent = content }}>
					{header}
					{body}
				</div>
				<div className={classNames("case-detail-controls", {
					'expanded': this.state.caseEditingActive || this.state.editingScenarios.length
				})}>
					<div>{this.renderButtons()}</div>
				</div>
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
			if (place && place.data && place.data.geometry){
				caseGeometry = place.data.geometry;
			}
			if (place && place.data && place.data.bbox){
				caseBbox = place.data.bbox;
			}
		}

		return (
			<div className="ptr-case-detail-map">
				<div>{polyglot.t('extent')}</div>
				<CaseDetailWorldWindMap
					bbox={caseBbox}
					caseGeometry={caseGeometry}
					onGeometryChange={this.onChangeGeometry}
					zoomToGeometry
					activeBackgroundLayerKey={this.props.activeBackgroundLayerKey}
				/>
				<div className="ptr-case-detail-map-help">
					{polyglot.t('caseMapExtentInfo')}
				</div>
			</div>
		);
	}

	renderButtons() {
		let saveButton, revertButton, discardButton, cancelButton;
		if (this.props.caseEdited || this.props.editedScenariosKeys && this.props.editedScenariosKeys.length){
			saveButton = true;
			if (this.props.case){
				revertButton = true;
			}
		} else {
			if (this.props.case){
				cancelButton = true;
			}
		}

		if (!this.props.case){
			discardButton = true;
		}

		return (
			<div className="ptr-case-detail-buttons">
				{saveButton ? (
					<Button key="save" onClick={this.save} primary>{polyglot.t('save')}</Button>
				) : null}
				{revertButton ? (
					<Button key="revert" onClick={this.revertEditing}>{polyglot.t('revert')}</Button>
				) : null}
				{discardButton ? (
					<Button key="discard" onClick={this.discard}>{polyglot.t('discard')}</Button>
				) : null}
				{cancelButton ? (
					<Button key="cancel" onClick={this.cancel}>{polyglot.t('cancel')}</Button>
				) : null}
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
				//editing={_.includes(this.state.editingScenarios, scenarioKey)}
				editing={this.state.caseEditingActive}
				editScenario={this.editScenario.bind(this, scenarioKey)}
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

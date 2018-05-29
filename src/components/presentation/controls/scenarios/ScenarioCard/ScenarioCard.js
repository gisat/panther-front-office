import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import InputFile from '../../../atoms/InputFile';
import Button from '../../../atoms/Button';
import EditableText from '../../../atoms/EditableText';
import Names from '../../../../../constants/Names';

import Icon from '../../../atoms/Icon';
import Menu, {MenuItem} from '../../../atoms/Menu';

import './ScenarioCard.css';

class ScenarioCard extends React.PureComponent {

	static propTypes = {
		checked: PropTypes.bool,
		defaultSituation: PropTypes.bool,
		disableEditing: PropTypes.bool,
		disableUncheck: PropTypes.bool,
		
		scenarioEditedData: PropTypes.object,
		scenarioData: PropTypes.object,
		scenarioKey: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	};

	constructor(props){
		super(props);

		this.state = {
			checked: props.checked,
			showDetails: !props.scenarioKey || false
		};

		this.handleDetailsButtonClick = this.handleDetailsButtonClick.bind(this);
		this.handleScenarioClick = this.handleScenarioClick.bind(this);
		this.activateScenarioEditing = this.activateScenarioEditing.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.cancel = this.cancel.bind(this);
		this.discard = this.discard.bind(this);
		this.save = this.save.bind(this);
		this.revertEditing = this.revertEditing.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			checked: nextProps.checked,
			showDetails:!this.props.scenarioKey || false
		});
	}


	activateScenarioEditing() {
		this.props.editScenario(true);
	}

	handleDetailsButtonClick(){
		this.setState({
			showDetails: !this.state.showDetails
		});
	};

	handleScenarioClick(e){
		this.props.handleScenarioClick(this.props.scenarioKey, e.target.checked, this.props.defaultSituation);
	};

	onChangeName(value) {
		this.props.updateEditedScenario(this.props.scenarioKey, 'name', value);
	}

	onChangeDescription(value) {
		this.props.updateEditedScenario(this.props.scenarioKey, 'description', value);
	}

	onChangeFile(x) {
		console.log('######', x);
	}

	cancel(){
		this.props.editScenario(false);
	}

	discard(){
		this.revertEditing();
	}

	save() {
		this.props.save(this.props.scenarioKey);
	}

	revertEditing() {
		this.props.editScenario(false);
		this.props.revertScenario(this.props.scenarioKey);
	}


	render() {
		console.log('### ScenarioCard render', this.props, this.state);

		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey && !this.props.defaultSituation
		});
		let headerClasses = classNames("scenario-card-header", {
			'editing-inactive': !this.props.editing
		});

		let scenario = this.props.scenarioData;
		let scenarioEdited = this.props.scenarioEditedData;

		let name = (scenarioEdited && scenarioEdited.data && scenarioEdited.data.hasOwnProperty('name')) ?
			(scenarioEdited.data.name) : ((scenario && scenario.data && scenario.data.hasOwnProperty('name')) ?
				scenario.data.name : null);
		let description = (scenarioEdited && scenarioEdited.data && scenarioEdited.data.hasOwnProperty('description')) ?
			(scenarioEdited.data.description) : ((scenario && scenario.data && scenario.data.hasOwnProperty('description')) ?
				scenario.data.description : null);


		if (this.props.defaultSituation){
			name = Names.SCENARIOS_DEFAULT_SITUATION_NAME;
		}

		let disableCheckbox = (this.props.disableUncheck && this.state.checked) ||
			((!this.props.scenarioData || !this.props.scenarioData.data) &&
				(!this.props.scenarioEditedData || !this.props.scenarioEditedData.data) && !this.props.defaultSituation);

		let header = (
			<div className={headerClasses}>
				<label>
					<div className="scenario-card-header-checkbox">
						<input
							type="checkbox"
							checked={this.state.checked}
							disabled={disableCheckbox}
							onChange={this.handleScenarioClick}
						/>
					</div>
					<div className="scenario-card-header-title">
						<EditableText
							large
							disabled={!this.props.editing || this.props.disableEditing}
							value={name}
							placeholder="Scenario name"
							onChange={this.onChangeName}
							editing={this.props.editing}
						/>
					</div>
				</label>
				<div className="scenario-card-header-buttons">
					{this.props.scenarioKey || this.props.defaultSituation ? (
						<Button icon="dots" invisible>
							<Menu bottom left>
								<MenuItem><Icon icon="download" /> Download</MenuItem>
							</Menu>
						</Button>
					): null}
				</div>
			</div>
		);

		let body = (!this.props.defaultSituation && (this.props.editing || (description && description.length > 0))) ? (
			<div className="scenario-card-body">
				<EditableText
					disabled={!this.props.editing || this.props.disableEditing}
					value={description}
					placeholder="Description"
					onChange={this.onChangeDescription}
					editing={this.props.editing}
				/>
				{this.props.editing ? (
				<InputFile
					disabled={!this.props.editing || this.props.disableEditing}
					value={this.state.file}
					placeholder="File"
					onChange={this.onChangeFile}
				/>
				) : null}
			</div>
		) : null;

		return (
			<div className={classes}>
				{header}
				{body}
			</div>
		);
	}

	renderButtons() {
		let buttons = [];
		if (this.props.scenarioEditedData && this.props.scenarioEditedData.data){
			buttons.push(<Button key="save" onClick={this.save} primary>Save</Button>);
			if (this.props.scenarioData){
				buttons.push(<Button key="revert" onClick={this.revertEditing}>Revert</Button>);
			}
		} else {
			if (this.props.scenarioData){
				buttons.push(<Button key="cancel" onClick={this.cancel}>Cancel</Button>);
			}
		}

		if (!this.props.scenarioData){
			buttons.push(<Button key="discard" onClick={this.discard}>Discard</Button>);
		}

		return (
			<div className="scenario-card-footer-buttons">
				{buttons}
			</div>
		);
	}
}

export default ScenarioCard;

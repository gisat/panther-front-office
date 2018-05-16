import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import InputFile from '../../../atoms/InputFile';
import Button from '../../../atoms/Button';
import EditableText from '../../../atoms/EditableText';

import Icon from '../../../atoms/Icon';
import Menu, {MenuItem} from '../../../atoms/Menu';

import './ScenarioCard.css';

class ScenarioCard extends React.PureComponent {

	static propTypes = {
		checked: PropTypes.bool,
		defaultSituation: PropTypes.bool,
		description: PropTypes.string,
		disableEditing: PropTypes.bool,
		disableUncheck: PropTypes.bool,
		name: PropTypes.string,
		scenarioKey: PropTypes.number
	};

	constructor(props){
		super(props);

		this.state = {
			checked: props.checked,
			editing: !props.scenarioKey && !props.defaultSituation,
			showDetails: !props.scenarioKey || false
		};

		this.handleDetailsButtonClick = this.handleDetailsButtonClick.bind(this);
		this.handleScenarioClick = this.handleScenarioClick.bind(this);
		this.activateScenarioEditing = this.activateScenarioEditing.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.cancel = this.cancel.bind(this);
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
		this.setState({
			editing: true
		});
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
		let updateValue = null;
		if (value !== this.props.name){
			updateValue = value;
		}
		this.props.updateEditedScenario(this.props.scenarioKey, 'name', updateValue);
	}

	onChangeDescription(value) {
		let updateValue = null;
		if (value !== this.props.description){
			updateValue = value;
		}
		this.props.updateEditedScenario(this.props.scenarioKey, 'description', updateValue);
	}

	onChangeFile(x) {
		console.log('######', x);
	}

	cancel(){
		this.setState({
			editing: false
		});
	}

	save() {
		//this.props.save();
	}

	revertEditing() {
		this.setState({
			editing: false
		});
		this.props.revertScenario(this.props.scenarioKey);
	}


	render() {

		console.log('### ScenarioCard render', this.props, this.state);

		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey && !this.props.defaultSituation
		});

		let headerClasses = classNames("scenario-card-header", {
			'editing-inactive': !this.state.editing
		});

		let name = this.props.scenarioEdited && this.props.scenarioEdited.data && this.props.scenarioEdited.data.hasOwnProperty('name') ? this.props.scenarioEdited.data.name : this.props.name;
		let description = this.props.scenarioEdited && this.props.scenarioEdited.data && this.props.scenarioEdited.data.hasOwnProperty('description') ? this.props.scenarioEdited.data.description : this.props.description;

		let header = (
			<div className={headerClasses}>
				<label>
					<div className="scenario-card-header-checkbox">
						<input
							type="checkbox"
							checked={this.state.checked}
							disabled={(this.props.disableUncheck && this.state.checked) || (!this.props.scenarioKey && !this.props.defaultSituation)}
							onChange={this.handleScenarioClick}
						/>
					</div>
					<div className="scenario-card-header-title">
						<EditableText
							large
							disabled={!this.state.editing || this.props.disableEditing}
							value={name}
							placeholder="Scenario name"
							onChange={this.onChangeName}
							editing={this.state.editing}
						/>
					</div>
				</label>
				<div className="scenario-card-header-buttons">
					{this.props.scenarioKey || this.props.defaultSituation ? (
						<Button icon="dots" invisible>
							<Menu bottom left>
								<MenuItem><Icon icon="download" /> Download</MenuItem>
								{this.props.defaultSituation ? null : (
									<MenuItem onClick={this.activateScenarioEditing}><Icon icon="edit"/> Edit</MenuItem>
								)}
							</Menu>
						</Button>
					): null}
				</div>
			</div>
		);

		let body = (!this.props.defaultSituation && (this.state.editing || (description && description.length > 0))) ? (
			<div className="scenario-card-body">
				<EditableText
					disabled={!this.state.editing || this.props.disableEditing}
					value={description}
					placeholder="Description"
					onChange={this.onChangeDescription}
					editing={this.state.editing}
				/>
				{this.state.editing ? (
				<InputFile
					disabled={!this.state.editing || this.props.disableEditing}
					value={this.state.file}
					placeholder="File"
					onChange={this.onChangeFile}
				/>
				) : null}
				{this.state.editing && false ? ( // don't save with button for now
					<div className="scenario-card-body-buttons">
						<Button disabled={true}>
							Save
						</Button>
					</div>
				) : null}
			</div>
		) : null;

		return (
			<div className={classes}>
				{header}
				{body}
				{this.state.editing ? this.renderButtons() : null}
			</div>
		);
	}

	renderButtons() {
		return (
			this.props.scenarioEdited ?
				(<div className="scenario-card-footer-buttons">
					<Button key="save" onClick={this.save} primary>Save</Button>
					<Button key="revert" onClick={this.revertEditing}>Revert</Button>
				</div>) :
				(<div className="scenario-card-footer-buttons">
					<Button key="cancel" onClick={this.cancel}>Cancel</Button>
				</div>)
		);
	}
}

export default ScenarioCard;

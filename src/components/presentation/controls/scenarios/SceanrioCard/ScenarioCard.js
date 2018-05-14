import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import InputFile from '../../../atoms/InputFile';
import Button from '../../../atoms/Button';
import EditableText from '../../../atoms/EditableText';
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
		this.toggleEditing = this.toggleEditing.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			checked: nextProps.checked,
			showDetails:!this.props.scenarioKey || false
		});
	}


	toggleEditing() {
		this.setState({editing: !this.state.editing});
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
		this.setState({
			name: value
		});
	}

	onChangeDescription(value) {
		this.setState({
			description: value
		});
	}

	onChangeFile(x) {
		console.log('######', x);
	}


	render() {

		console.log('### ScenarioCard render', this.props, this.state);

		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey && !this.props.defaultSituation
		});

		let headerClasses = classNames("scenario-card-header", {
			'editing-inactive': !this.state.editing
		});

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
							value={this.state.hasOwnProperty('name') ? this.state.name : this.props.name}
							placeholder="Scenario name"
							onChange={this.onChangeName}
						/>
					</div>
				</label>
				<div className="scenario-card-header-buttons">
					{!this.props.defaultSituation ? (
						<Button
							invisible
							icon="edit"
							onClick={this.toggleEditing}
						/>
					) : null}
				</div>
			</div>
		);

		let body = !this.props.defaultSituation ? (
			<div className="scenario-card-body">
				<EditableText
					disabled={!this.state.editing || this.props.disableEditing}
					value={this.state.hasOwnProperty('description') ? this.state.description : this.props.description}
					placeholder="Description"
					onChange={this.onChangeDescription}
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
			</div>
		);
	}
}

export default ScenarioCard;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputFile from '../../../atoms/InputFile';
import Button from '../../../../common/atoms/Button';
import EditableText from '../../../../common/atoms/EditableText';
import Names from '../../../../../constants/Names';

import Icon from '../../../../common/atoms/Icon';
import Menu, {MenuItem} from '../../../../common/atoms/Menu';

import './ScenarioCard.css';
import Action from "../../../../../state/Action";
import {utils} from "panther-utils"

let polyglot = window.polyglot;

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
		]),

		scenarioSpatialDataSource: PropTypes.object,

		enableDelete: PropTypes.bool,
		enableEdit: PropTypes.bool,
		enableModify: PropTypes.bool
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
		this.onDownloadClick = this.onDownloadClick.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.onStartMapEditing = this.onStartMapEditing.bind(this);

		this.onEdit = this.onEdit.bind(this);
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

	onChangeFile(file) {
		this.props.updateEditedScenario(this.props.scenarioKey, 'file', file);
	}

	onDelete(name){
		if (window.confirm(Names.SCENARIOS_DELETE_CONFIRM_MESSAGE + ' ' + (name ? name : ""))) {
			this.props.deleteScenario(this.props.scenarioKey);
		}
	}

	onEdit(){
		this.props.edit();
	}

	onDownloadClick(){
		this.props.downloadDataSource(this.props.scenarioSpatialDataSource.dataSource);
	}

	onStartMapEditing(){
		let scenarioKey = utils.uuid();
		this.props.onStartMapEditing(scenarioKey, this.props.scenarioSpatialDataSource);
	}

	render() {
		console.log('### ScenarioCard render', this.props, this.state);

		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey && !this.props.defaultSituation,
			'edited': !!this.props.scenarioEditedData
		});
		let headerClasses = classNames("scenario-card-header", {
			'editing-inactive': !this.props.editing
		});

		let scenario = this.props.scenarioData;
		let scenarioEdited = this.props.scenarioEditedData;

		let data = null;
		if (scenario && scenarioEdited){
			data = {...scenario.data, ...scenarioEdited.data}
		} else if (scenario && !scenarioEdited){
			data = scenario.data;
		} else if (!scenario && scenarioEdited){
			data = scenarioEdited.data;
		}

		let name = (data && data.hasOwnProperty('name')) ? data.name : null;
		let description = (data && data.hasOwnProperty('description')) ? data.description : null;
		let file = (data && data.file && data.file.hasOwnProperty('name')) ? data.file.name : null;

		let fileProcessingStarted = (scenario && scenario.fileProcessing && scenario.fileProcessing.started) ? scenario.fileProcessing.started : false;
		let fileProcessingFinished = (scenario && scenario.fileProcessing && scenario.fileProcessing.finished) ? scenario.fileProcessing.finished : false;
		let fileProcessingError = (scenario && scenario.fileProcessing && scenario.fileProcessing.error) ? scenario.fileProcessing.error : false;

		let disableCheckbox = (this.props.disableUncheck && this.state.checked) ||
			((!this.props.scenarioData || !this.props.scenarioData.data) &&
				(!this.props.scenarioEditedData || !this.props.scenarioEditedData.data) && !this.props.defaultSituation);

		let disableDownload = !this.props.scenarioSpatialDataSource;
		let disableModify = !this.props.enableModify;
		let showFileInput = this.props.editing && !this.props.scenarioSpatialDataSource;

		if (this.props.defaultSituation){
			name = polyglot.t('defaultState');
		}

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
							placeholder={polyglot.t('scenarioName')}
							onChange={this.onChangeName}
							editing={this.props.editing}
						/>
					</div>
				</label>
				<div className="scenario-card-header-buttons">
					{this.props.scenarioKey || this.props.defaultSituation ? (
						<Button icon="dots" invisible>
							<Menu bottom left>
								<MenuItem onClick={this.onDownloadClick} disabled={disableDownload}><Icon icon="download" />{polyglot.t('download')}</MenuItem>
								{this.props.enableEdit ? <MenuItem onClick={this.onStartMapEditing} disabled={disableModify}><Icon icon="edit" />{polyglot.t('copyAndModify')}</MenuItem> : null}
								{!this.props.defaultSituation && this.props.enableDelete ? <MenuItem onClick={this.onDelete.bind(this, name)}><Icon icon="delete" />{polyglot.t('delete')}</MenuItem> : null}
							</Menu>
						</Button>
					): null}
				</div>
			</div>
		);

		let body = (!this.props.defaultSituation && (this.props.editing || (description && description.length > 0) || fileProcessingFinished || fileProcessingFinished)) ? (
			<div className="scenario-card-body">
				<EditableText
					disabled={!this.props.editing || this.props.disableEditing}
					value={description}
					placeholder={polyglot.t('description')}
					onChange={this.onChangeDescription}
					editing={this.props.editing}
				/>
				{showFileInput ? (
				<InputFile
					disabled={!this.props.editing || this.props.disableEditing}
					value={file}
					placeholder={polyglot.t('file')}
					accept=".zip"
					onChange={this.onChangeFile}
				/>
				) : null}
				{this.renderMessage(fileProcessingStarted, fileProcessingFinished, fileProcessingError)}
			</div>
		) : null;

		return (
			<div className={classes}>
				{header}
				{body}
				{(fileProcessingStarted && !fileProcessingFinished) ? this.renderLoader() : null}
			</div>
		);
	}

	// todo create component
	renderMessage(started, finished, error){
		let classes = classNames('process-result-message', {
			'success': (finished && !error),
			'error': (finished && error)
		});

		let successMsg = (<div><b>{Names.SCENARIOS_PROCESSING_FILE_SUCCESS}: </b> {Names.SCENARIOS_PROCESSING_FILE_SUCCESS_MESSAGE}</div>);
		let errorMsg = (<div><b>{Names.SCENARIOS_PROCESSING_FILE_ERROR}: </b> {Names.SCENARIOS_PROCESSING_FILE_ERROR_MESSAGE}</div>);

		let text = finished ? (error ? errorMsg : successMsg) : null;

		return (finished ? (<div className={classes}>
				{text}
			</div>) : null
		);
	}


	// todo create component
	renderLoader(){
		return (
			<div className="scenario-card-overlay">
				<div className="loading-screen-content-wrap">
					<div className="loading-screen-content">
						<div className="b-loader-container extra-small grayscale">
							<i className="i1"></i>
							<i className="i2"></i>
							<i className="i3"></i>
							<i className="i4"></i>
						</div>
						<div className="b-loader-text">{Names.SCENARIOS_PROCESSING_FILE_LOADER_TEXT}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ScenarioCard;

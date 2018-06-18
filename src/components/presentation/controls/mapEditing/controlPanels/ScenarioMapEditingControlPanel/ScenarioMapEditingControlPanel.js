import { connect } from 'react-redux';
import React from "react";
import PropTypes from "prop-types";

import Button from '../../../../atoms/Button'
import EditableText from '../../../../atoms/EditableText';
import MapEditingControlPanel from '../MapEditingControlPanel/MapEditingControlPanel';

class ScenarioMapEditingControlPanel extends React.PureComponent {

	static propTypes = {
		discard: PropTypes.func,
		scenarioData: PropTypes.object
	};

	constructor(props){
		super(props);

		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onDiscard = this.onDiscard.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onChangeName(value) {
		this.props.updateEditedScenario(this.props.scenarioData.key, 'name', value);
	}

	onChangeDescription(value) {
		this.props.updateEditedScenario(this.props.scenarioData.key, 'description', value);
	}

	onDiscard(){
		this.props.discard();
	}

	onSave(){
		debugger;
	}

	render() {
		let name = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.hasOwnProperty('name') ? this.props.scenarioData.data.name : null;
		let description = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.hasOwnProperty('description') ? this.props.scenarioData.data.description : null;

		return (
			<MapEditingControlPanel
				title="Scenario editing"
			>
				<div className="ptr-editing-control-panel-content">
					<div className="ptr-editing-control-panel-content-header">
						<EditableText
							large
							value={name}
							placeholder="Scenario name"
							editing={true}
							onChange={this.onChangeName}
						/>
						<EditableText
							value={description}
							placeholder="Description"
							editing={true}
							onChange={this.onChangeDescription}
						/>
					</div>
					<div className="ptr-editing-control-panel-content-body">
					</div>
				</div>
				<div className="ptr-editing-control-panel-controls">
					<div>{this.renderButtons()}</div>
				</div>
			</MapEditingControlPanel>
		);
	}

	renderButtons(){
		let saveButton = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.name;
		let discardButton = true;

		return (
			<div className="ptr-editing-control-panel-buttons">
				{saveButton ? (
					<Button key="save" onClick={this.onSave} primary>Save</Button>
				) : null}
				{discardButton ? (
					<Button key="discard" onClick={this.onDiscard}>Discard</Button>
				) : null}
			</div>
		);
	}
}

export default ScenarioMapEditingControlPanel;
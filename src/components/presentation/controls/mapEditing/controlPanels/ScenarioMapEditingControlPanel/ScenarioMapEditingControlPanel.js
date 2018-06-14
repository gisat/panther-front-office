import { connect } from 'react-redux';
import React from "react";

import Button from '../../../../atoms/Button'
import EditableText from '../../../../atoms/EditableText';
import MapEditingControlPanel from '../MapEditingControlPanel/MapEditingControlPanel';

class ScenarioMapEditingControlPanel extends React.PureComponent {
	constructor(props){
		super(props);

		this.onDiscard = this.onDiscard.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onDiscard(){
		debugger;
	}

	onSave(){
		debugger;
	}

	render() {
		return (
			<MapEditingControlPanel
				title="Scenario editing"
			>
				<div className="ptr-editing-control-panel-content">
					<div className="ptr-editing-control-panel-content-header">
						<EditableText
							large
							value={null}
							placeholder="Scenario name"
							editing={true}
						/>
						<EditableText
							value={null}
							placeholder="Description"
							editing={true}
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
		let saveButton = true, discardButton = true;
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
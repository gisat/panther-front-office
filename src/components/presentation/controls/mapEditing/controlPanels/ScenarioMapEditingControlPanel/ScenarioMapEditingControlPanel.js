import { connect } from 'react-redux';
import React from "react";

import EditableText from '../../../../atoms/EditableText';
import MapEditingControlPanel from '../MapEditingControlPanel/MapEditingControlPanel';

class ScenarioMapEditingControlPanel extends React.PureComponent {
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
				</div>
			</MapEditingControlPanel>
		);
	}
}

export default ScenarioMapEditingControlPanel;
import { connect } from 'react-redux';

import MapEditingOverlay from "../../../containers/overlays/MapEditingOverlay";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import ScenarioMapEditingControlPanel from '../../../containers/controls/mapEditing/controlPanels/ScenarioMapEditingControlPanel';
import MapEditingMapContainer from '../../../containers/controls/mapEditing/MapEditingMapContainer';
import Names from "../../../../constants/Names";

class ScenarioMapEditingOverlay extends React.PureComponent {

	static propTypes = {
	};

	onClose(){
		this.props.onClose();
	}

	render() {
		let overlayKey = "scenarioMapEditing";

		return (
			<MapEditingOverlay
				overlayKey={overlayKey}
			>
				<ScenarioMapEditingControlPanel
					overlayKey={overlayKey}
				/>
				<MapEditingMapContainer
					overlayKey={overlayKey}
					closeConfirmMessage={Names.SCENARIO_MAP_EDITING_CLOSE_MESSAGE}
					dataSourceKey={214}
					mapData={this.props.mapData}
					onCloseEditing={this.onClose.bind(this)}
				/>
			</MapEditingOverlay>
		);
	}
}

export default ScenarioMapEditingOverlay;
import { connect } from 'react-redux';

import MapEditingOverlay from "../../../containers/overlays/MapEditingOverlay";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import ScenarioMapEditingControlPanel from '../../../containers/controls/mapEditing/controlPanels/ScenarioMapEditingControlPanel';
import MapEditingMapContainer from '../../../containers/controls/mapEditing/MapEditingMapContainer';

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
				onClose={this.onClose.bind(this)}>
				<ScenarioMapEditingControlPanel
					overlayKey={overlayKey}
				/>
				<MapEditingMapContainer/>
			</MapEditingOverlay>
		);
	}
}

export default ScenarioMapEditingOverlay;
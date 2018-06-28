import { connect } from 'react-redux';

import MapEditingOverlay from "../../../containers/overlays/MapEditingOverlay";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import config from "../../../../config";

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
		let sourceLayer = {
			url: config.apiGeoserverWMSProtocol + "://" + config.apiGeoserverWMSHost + "/" + config.apiGeoserverWMSPath,
			name: this.props.mapData.layerSource,
			opacity: this.props.mapData.layerOpacity,
			style: null
		};

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
					sourceLayer={sourceLayer}
					onCloseEditing={this.onClose.bind(this)}
				/>
				{this.props.mapData && this.props.mapData.layerLoading ? (
					<div className="ptr-overlay-editing-loader">
						<div>Loading: {this.props.mapData.layerLoadingProgress} %</div>
					</div>
				): null}
			</MapEditingOverlay>
		);
	}
}

export default ScenarioMapEditingOverlay;
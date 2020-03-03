import React from "react";
import ReactResizeDetector from "react-resize-detector";

import {WorldWindMap, MapControls, MapSet, PresentationMap} from "@gisatcz/ptr-maps";
import {connects} from '@gisatcz/ptr-state';
import './style.scss';

const ConnectedMap = connects.Map(PresentationMap);
const ConnectedMapSet = connects.MapSet(MapSet);

const Visualization = props => {
	if (props.isCrayfish) {
		return (
			<iframe id="tacrGeoinvaze-visualization-iframe" src={props.iframeUrl} />
		);
	} else {
		return (
			<ReactResizeDetector
				handleWidth
				handleHeight
				render={({width, height}) => {
					return (
						<>
							{props.activeCase && props.activePeriodKey && props.activeLayerTemplateKey ? (
								<ConnectedMapSet
									stateMapSetKey="tacrGeoinvaze"
									mapComponent={WorldWindMap}
									connectedMapComponent={ConnectedMap}
								>
									<MapControls zoomOnly/>
								</ConnectedMapSet>
							) : null}
						</>
					);
				}}
			/>
		);
	}
};

export default Visualization;
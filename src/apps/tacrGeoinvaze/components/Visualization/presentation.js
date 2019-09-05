import React from "react";
import ReactResizeDetector from "react-resize-detector";

import MapSet from "../../../../components/common/maps/MapSet";
import MapControls from "../../../../components/common/maps/MapControls";

import './style.scss';
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";

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
								<MapSet
									mapSetKey="tacrGeoinvaze"
									mapComponent={WorldWindMap}
								>
									<MapControls zoomOnly/>
								</MapSet>
							) : null}
						</>
					);
				}}
			/>
		);
	}
};

export default Visualization;
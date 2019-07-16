import React from "react";
import ReactResizeDetector from "react-resize-detector";

import MapSet from "../../../../components/common/maps/MapSet";
import MapTools from "../../../../components/common/maps/MapTools";
import MapControls from "../../../../components/common/maps/Deprecated_MapControls";

import './style.scss';

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
							<MapSet
								mapSetKey="tacrGeoinvaze"
								width={width}
								height={height}
							>
							</MapSet>
							<MapTools>
								<MapControls zoomOnly/>
							</MapTools>
						</>
					)
				}}
			/>
		);
	}
};

export default Visualization;
import React from "react";
import moment from "moment";

import {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName} from "../constants/MapResources";

export const MapLegend = props => {
	const classes = props.style && props.style.data.definition.rules[0].styles[0].attributeClasses;

	return (
		<div className="tacrAgritas-map-legend">
			<div className="tacrAgritas-map-legend-title">
				<span className="tacrAgritas-map-legend-attribute">{props.name}</span>
				<span>({props.unit}):</span>
			</div>
			{classes ? (
				<div className="tacrAgritas-map-legend-content">
					{classes.map(legendClass =>
						<div className="tacrAgritas-map-legend-item">
							<div className="tacrAgritas-map-legend-symbol" style={{background: legendClass.fill}}></div>
							<div className="tacrAgritas-map-legend-text">
								{`${legendClass.interval[0]} - ${legendClass.interval[1]}`}
							</div>
						</div>
					)}
					{props.noData ? (
						<div className="tacrAgritas-map-legend-item">
							<div className="tacrAgritas-map-legend-symbol" style={{background: "#ffffff"}}></div>
							<div className="tacrAgritas-map-legend-text">
								No data
							</div>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
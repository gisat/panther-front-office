import React from "react";
import moment from "moment";

import {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName} from "../constants/MapResources";

export const MapLegend = props => {
	const classes = props.style && props.style.data.definition.rules[0].styles[0].attributeClasses;
	const values = props.style && props.style.data.definition.rules[0].styles[0].attributeValues;

	if (classes) {
		return (
			<div className="tacrAgritas-map-legend">
				<div className="tacrAgritas-map-legend-title">
					<span className="tacrAgritas-map-legend-attribute">{props.name}</span>
					{props.unit && props.unit.length ? (<span>({props.unit}):</span>) : ":"}
				</div>
				<div className="tacrAgritas-map-legend-content">
					{classes.map((legendClass, index) =>
						<div className="tacrAgritas-map-legend-item" key={index}>
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
			</div>
		);
	} else if (values) {
		return (
			<div className="tacrAgritas-map-legend">
				<div className="tacrAgritas-map-legend-title">
					<span className="tacrAgritas-map-legend-attribute">{props.name}</span>
					{props.unit && props.unit.length ? (<span>({props.unit}):</span>) : ":"}
				</div>
				<div className="tacrAgritas-map-legend-content">
					{values.map((item, index) =>
						<div className="tacrAgritas-map-legend-item" key={index}>
							<div className="tacrAgritas-map-legend-symbol" style={{background: item.fill}}></div>
							<div className="tacrAgritas-map-legend-text">
								{`${item.value}`}
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
			</div>
		);
	} else {
		return null;
	}
};
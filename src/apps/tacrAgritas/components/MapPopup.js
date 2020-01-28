import React from "react";
import moment from "moment";

import {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName} from "../constants/MapResources";

export const MapPopup = props => {
	const data = props.data && props.data[0] && props.data[0].data;

	const dpb = data && data[nameColumnName];
	const value = data && data[props.valueColumnName];

	return (
		<div className="tacrAgritas-map-popup-content">
			<div>{dpb}</div>
			<div>{value}</div>
		</div>
	);
};
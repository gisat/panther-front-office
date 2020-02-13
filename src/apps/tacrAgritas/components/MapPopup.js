import React from "react";
import moment from "moment";

import {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName} from "../constants/MapResources";

export const MapPopup = props => {
	const data = props.data && props.data[0] && props.data[0].data;

	const dpb = data && data[nameColumnName];
	const value = data && data[props.valueColumnName];

	return (
		<>
			<div className="ptr-popup-header">
				{"DPB: " + dpb}
			</div>
			{value ? (
				<div className="ptr-popup-record-group">
					<div className="ptr-popup-record">
						<div className="ptr-popup-record-value-group">
							{<span className="value">{value}</span>}
							{<span className="unit">{props.unit}</span>}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};
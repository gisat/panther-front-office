import React from "react";
import moment from "moment";

import {selectedStyleDefinition} from "../utils";

export const MapInfo = props => {
	const selectedAreaStyle = {
		borderColor: selectedStyleDefinition.rules[0].styles[0].outlineColor,
	};

	return (
		<div className="tacrAgritas-map-info">
			<div className="tacrAgritas-map-info-selected">
				<div className="tacrAgritas-map-info-selected-icon" style={selectedAreaStyle}></div>
				<div className="tacrAgritas-map-info-selected-text">Vybraný půdní blok: <b>{props.selectedAreaName}/4</b> (klimatický region {props.selectedAreaClimRegion})</div>
			</div>
		</div>
	);
};
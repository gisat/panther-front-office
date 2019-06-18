import React from "react";

import './style.scss';

const CaseDetail = props => (
	<div className="tacrGeoinvaze-case-detail">
		<span>{props.activeCase ? props.activeCase.data.nameDisplay : null}</span>
		{props.activeCase ? props.activeCase.data.description : null}
	</div>
);

export default CaseDetail;
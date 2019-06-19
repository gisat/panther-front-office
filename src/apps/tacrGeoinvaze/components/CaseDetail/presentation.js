import React from "react";

import './style.scss';

const CaseDetail = props => (
	<div className="tacrGeoinvaze-case-detail">
		{props.activeCase ? props.activeCase.data.description : null}
	</div>
);

export default CaseDetail;
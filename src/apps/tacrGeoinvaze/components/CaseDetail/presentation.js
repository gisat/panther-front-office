import React from "react";

import './style.scss';
import Nutrie from "./cases/Nutrie";
import Zlatobyl from "./cases/Zlatobyl";
import Rak from "./cases/Rak";

const CaseDetail = props => {
	const caseKey = props.activeCase && props.activeCase.key;
	let component;

	switch (caseKey) {
		case 'fa8f6402-2f4d-4286-9b4b-7f48cf6e60bf':
			component = <Nutrie/>;
			break;
		case '82acfc6b-5ebc-49a2-813a-76f1a85ef66c':
			component = <Zlatobyl/>;
			break;
		case 'edb75be0-8f1d-46a2-b07a-af1874d88569':
			component = <Rak/>;
			break;
		default:
			component = null;
	}

	return (
		<div className="tacrGeoinvaze-case-detail">
			{component}
		</div>
	)
};

export default CaseDetail;
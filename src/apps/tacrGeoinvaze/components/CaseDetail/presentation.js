import React from "react";

import './style.scss';

import Blesivec from "./cases/Blesivec";
import Jelen from "./cases/Jelen";
import Krab from "./cases/Krab";
import Muflon from "./cases/Muflon";
import Myval from "./cases/Myval";
import Norek from "./cases/Norek";
import Nutrie from "./cases/Nutrie";
import Ondatra from "./cases/Ondatra";
import Psik from "./cases/Psik";
import Rak from "./cases/Rak";
import VodniMorAmericky from "./cases/VodniMorAmericky";
import VodniMorKanadsky from "./cases/VodniMorKanadsky";
import Zlatobyl from "./cases/Zlatobyl";

const CaseDetail = props => {
	const caseKey = props.activeCase && props.activeCase.key;
	let component;

	switch (caseKey) {
		case '64dace45-50b4-4349-9ee1-e28bd747c78d':
			component = <Blesivec/>;
			break;
		case '933cace6-cc31-49fc-9f0d-3f52ad4bb328':
			component = <Jelen/>;
			break;
		case 'da8924f1-3c73-485b-8e0f-acc0d6650e8d':
			component = <Krab/>;
			break;
		case '6e0c18ad-c8fd-4f32-bcd5-f04c33167a9a':
			component = <Muflon/>;
			break;
		case '06f0aacf-09e8-499e-bba6-d472e8d54d7e':
			component = <Myval/>;
			break;
		case "dc301b57-6a6d-4f37-90a0-f98f71600b81":
			component = <Norek/>;
			break;
		case 'fa8f6402-2f4d-4286-9b4b-7f48cf6e60bf':
			component = <Nutrie/>;
			break;
		case "edfdd933-86fe-4b08-ae20-cb77eeb6afbc":
			component = <Ondatra/>;
			break;
		case '2316b10f-b733-4e9b-958c-cc5bfd568735':
			component = <Psik/>;
			break;
		case 'edb75be0-8f1d-46a2-b07a-af1874d88569':
			component = <Rak/>;
			break;
		case 'ed135671-9da6-495e-91ad-ff305f849b94':
			component = <VodniMorAmericky/>;
			break;
		case 'ae694a84-4fda-400b-bf26-b78b4484b516':
			component = <VodniMorKanadsky/>;
			break;
		case '82acfc6b-5ebc-49a2-813a-76f1a85ef66c':
			component = <Zlatobyl/>;
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
import React from "react";

import './style.scss';

import AmbroziePerenolista from "./cases/Ambrosie";
import Astra from "./cases/Astra";
import Bolsevnik from "./cases/Bolsevnik";
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
import RakMramorovany from "./cases/RakMramorovany";
import RakSignalni from "./cases/RakSignalni";
import KorbikulaAsijska from "./cases/KorbikulaAsijska";
import SlavickaMnohotvarna from "./cases/SlavickaMnohotvarna";
import SkebliceAsijska from "./cases/SkebliceAsijska";
import ZelvaNadherna from "./cases/ZelvaNadherna";
import KlejichaHedvabna from "./cases/KlejichaHedvabna";
import KustovniceCizi from "./cases/KustovniceCizi";
import KolotocnikOzdobny from "./cases/KolotocnikOzdobny";
import KomuleDavidova from "./cases/KomuleDavidova";
import KridlatkaJaponska from "./cases/KridlatkaJaponska";
import KridlatkaCeska from "./cases/KridlatkaCeska";
import KridlatkaSachalinska from "./cases/KridlatkaSachalinska";
import LoubinecPetilisty from "./cases/LoubinecPetilisty";
import LoubinecPopinavy from "./cases/LoubinecPopinavy";
import LupinaMnoholista from "./cases/LupinaMnoholista";
import NetykavkaZlaznata from "./cases/NetykavkaZlaznata";
import SlunecniceTopinambur from "./cases/SlunecniceTopinambur";
import SvidaVybezkata from "./cases/SvidaVybezkata";
import SruchaZelna from "./cases/SruchaZelna";
import ZlatobylObrovsky from "./cases/ZatobylObrovsky";
import ZimolezKoziList from "./cases/ZimolezKoziList";
import ZanovecMechyrnik from "./cases/ZanovecMechyrnik";

const CaseDetail = props => {
	const caseKey = props.activeCase && props.activeCase.key;
	let component;

	switch (caseKey) {
		case 'aeb77ca2-ac1d-4cdd-b885-f1c4f922eb3f':
			component = <AmbroziePerenolista/>;
			break;
		case '102e76d3-6307-4a26-ab8a-4ef5588570c7':
			component = <Astra/>;
			break;
		case '64dace45-50b4-4349-9ee1-e28bd747c78d':
			component = <Blesivec/>;
			break;
		case  '58778990-b620-4765-bbfb-b4a727f6574d':
			component = <Bolsevnik/>;
			break;
		case '933cace6-cc31-49fc-9f0d-3f52ad4bb328':
			component = <Jelen/>;
			break;
		case 'c445b9a9-a6a3-47a6-baf7-ca48a063cbcb':
			component = <KlejichaHedvabna/>;
			break;
		case 'c91a552d-59a1-4531-886e-1de5cac3992c':
			component = <KomuleDavidova/>;
			break;
		case '385e6a88-4dda-474f-81d0-700f8785d092':
			component = <KolotocnikOzdobny/>;
			break;
		case 'b58af36a-473a-4ee5-8333-195cb791cc9a':
			component = <KorbikulaAsijska/>;
			break;
		case 'da8924f1-3c73-485b-8e0f-acc0d6650e8d':
			component = <Krab/>;
			break;
		case "71d1a171-4ff6-43ed-bb47-fc9a40767fad":
			component = <KridlatkaCeska/>;
			break;
		case 'da731426-75dd-4a00-9082-2debaa78aa75':
			component = <KridlatkaJaponska/>;
			break;
		case '7e7d1899-dff3-4d75-af52-e913f744fdc5':
			component = <KridlatkaSachalinska/>;
			break;
		case '87ce0a75-6769-405b-be0d-805eb116ac71':
			component = <KustovniceCizi/>;
			break;
		case '4df5dd73-e05d-442d-88b9-909cbc752484':
			component = <LoubinecPetilisty/>;
			break;
		case '0c2a25e7-9feb-4b54-bfcb-a5db7de4d700':
			component = <LoubinecPopinavy/>;
			break;
		case '5d6b862d-2c3e-4ec0-8b9c-0b21dec0d52a':
			component = <LupinaMnoholista/>;
			break;
		case '6e0c18ad-c8fd-4f32-bcd5-f04c33167a9a':
			component = <Muflon/>;
			break;
		case '06f0aacf-09e8-499e-bba6-d472e8d54d7e':
			component = <Myval/>;
			break;
		case '843ddf31-2030-445d-ad6c-9d4bf99e384f':
			component = <NetykavkaZlaznata/>;
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
		case '07d06cdd-8d38-4a43-87f2-c7e819ff3670':
			component = <RakMramorovany/>;
			break;
		case '572b2ddf-d8d7-4a5b-9a30-92cf2c1d42bc':
			component = <RakSignalni/>;
			break;
		case '73c6ee99-3a51-419a-b2f5-12ac2366dcd1':
			component = <SkebliceAsijska/>;
			break;
		case '102385c0-5a76-4b98-b429-a1aa42abb8d3':
			component = <SlavickaMnohotvarna/>;
			break;
		case '239c8fd9-ee79-449d-87c1-e2f474ce6934':
			component = <SlunecniceTopinambur/>;
			break;
		case '9bc07567-997c-4c47-8c51-dc225b96ae37':
			component = <SruchaZelna/>;
			break;
		case '8fb79c32-ddad-4e83-9035-7dd81ed9fb82':
			component = <SvidaVybezkata/>;
			break;
		case 'ed135671-9da6-495e-91ad-ff305f849b94':
			component = <VodniMorAmericky/>;
			break;
		case 'ae694a84-4fda-400b-bf26-b78b4484b516':
			component = <VodniMorKanadsky/>;
			break;
		case 'eee60ad0-b8d5-4074-a2b5-c532f7ec5065':
			component = <ZanovecMechyrnik/>;
			break;
		case 'd435f0a6-0b8f-454e-905e-85c4dbc22288':
			component = <ZelvaNadherna/>;
			break;
		case 'b16e8b7c-7607-470f-9469-107990a3c973':
			component = <ZimolezKoziList/>;
			break;
		case '82acfc6b-5ebc-49a2-813a-76f1a85ef66c':
			component = <Zlatobyl/>;
			break;
		case 'ec4b6689-718a-420a-8378-6ac5d348f25e':
			component = <ZlatobylObrovsky/>;
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
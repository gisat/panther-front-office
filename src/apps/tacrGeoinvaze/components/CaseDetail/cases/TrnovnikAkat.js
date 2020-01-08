import React from "react";
import {
	Title,
	TextBlock,
	InvasivePotential,
	Resources,
	Resource,
	Summary,
	SexualReproduction,
	AsexualReproduction,
	EcologicalNiche,
	PopulationDensity,
	EnvironmentImpact,
	ManagementMethod,
	ManagementApplication, OriginalArea, SecondaryArea, Introduction, Breeding, CaseImage
} from "../components";

import image from "../../../assets/caseDetails/trnovnik-akat.jpg";

const TrnovnikAkat = props => (
	<div>
		<Title name="Trnovník akát" nameSynonyms="čimišník obecný/trnovník obecný/čimišník obecný/akácia/luštník/akát/agastr/trnovník bílý" latinName="Robinia pseudoacacia" latinNameSynonyms="Robinia acacia/Robinia pseudoacacia/Pseudoacacia communis/Pseudoacacia pseudoacacia"/>
		<Summary>
			<OriginalArea text="Mexiko a východní Severní Amerika (od břehů Atlantiku po Arkansas na západě)"/>
			<SecondaryArea text="Celá jižní část Severní Ameriky, teplé oblasti  Evropy (dovezen v 17. století - Čechy 1710) a Asie"/>
			<Introduction text="Pěstování jako okrasná a medonosná dřevina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Trnovník akát (Black locust), opadavý keř či strom, dorůstá do výšky 20 metrů.  Jeho koruna je nepravidelná a široce rozložená. Má hluboce brázditou šedou až hnědošedou borku, mladé větvičky jsou lysé či olysalé, se dvěma trny vzniklými přeměnou z palistů (někdy chybí). Listy jsou dlouze řapíkaté se 4 až 10 páry lístků, lístky mají vejčitý až podlouhlý tvar a jsou dlouhé až 3,5 cm. Vonné bílé smetanové až narůžovělé květy jsou uspořádány v hrozen, dosahující délky až 20 cm. Koruna dosahuje až 2 cm, na pavé je zelená skvrnka, na bázi žlutá. Květy jsou výrazně sladké. Dřevina kvete od května do června. Plodem jsou ploché hnědé lusky, dlouhé až 10 cm a zpravidla s 8 semeny. Na stromě setrvávají až do dalšího roku. Dřevo akátu je žlutohnědé, těžké, tvrdé, pevné, velmi odolné ve styku s půdou.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Trnovníku vyhovují výživné, hlinité půdy na převážně sušším a světlém stanovišti. Pěstuje se v mírném pásu celého světa, zplaňuje. Jedná se o rychle rostoucí dřevinu, dosahující věku až 200 let. Tuto dřevinu lze nalézt na okrajích lesů, podél cest, alejí, na náspech okolo silnic a železnic, v blízkosti zahrad, parků a lidských sídel. Šíří se do společenstev křovitých strání, světlých lesů, kde potlačuje přirozenou vegetaci. Trnovník je také pěstován pro odolné dřevo a jako významná medonosná dřevina. Šíří se rychle díky množství podzemních výběžků, zpevňuje půdu a obohacuje ji o dusík (kořeny váže vzdušný dusík). Opadané listy se rozkládají a uvolňují do půdy fenylkarboxylové kyseliny inhibující klíčení jiných rostlin. V jeho okolí tak najdeme většinou jen nitrofilní druhy rostlin.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="mechanické (pastva, kroužkování) a chemické"/>
			<ManagementApplication text="lokálně ve zvláště chráněných územích a jejich ochranných pásmech"/>
		</InvasivePotential>
		<Resources>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze</Resource>
			<Resource>SLAVÍK, B. (ed.). 1995.  Květena České republiky 4. Praha: Academia</Resource>
			<Resource><a href="http://www.pladias.cz" target="_blank">www.pladias.cz</a>; 2014-2019</Resource>
		</Resources>
	</div>
);

export default TrnovnikAkat;
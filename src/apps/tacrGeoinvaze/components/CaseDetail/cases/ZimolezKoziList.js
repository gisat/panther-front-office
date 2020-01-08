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

import image from "../../../assets/caseDetails/zimolez-kozi-list.jpg";

const ZimolezKoziList = props => (
	<div>
		<Title name="Zimolez kozí list" nameSynonyms="růže z Jericha/zimolejz kozílist/kozílist obecný/kozilist prorostlý/zimoléz kozí list/kozí list obecný/zimoléz" latinName="Lonicera caprifolium" latinNameSynonyms="Periclymenum italicum/Caprifolium hortense/Caprifolium rotundifolium/Lonicera pallida"/>
		<Summary>
			<OriginalArea text="Jihovýchodní Evropa, Krym, Kavkaz"/>
			<SecondaryArea text="Evropa, části Severní Ameriky a Austrálie"/>
			<Introduction text="Pěstování jako okrasná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Zimolez kozí list (Italian honeysucle/woodbine) je ovíjivý pravotočivý opadavý keř s délkou výhonů 5–7 m. Listy mají eliptický tvar, jsou široce vejčité až obvejčité, dosahují délky 3–7 cm, šířky 3–5 cm. Mají tmavozelenou barvu, vespod jsou sivozelené. V horní části lodyh protistojné listy svými bázemi srůstají a vytvářejí až okrouhlý list. Silně vonné květy (večer a v noci) jsou většinou v 6květých lichopřeslenech. Koruna je dvoupyská, 4–5 cm dlouhá. Barva květu je zprvu krémově bílá, postupně tmavne od růžové až po červenou a fialovou. Plodem jsou elipsoidní bobule oranžovočervené barvy. Kvete od května do června.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Zimolez kozí list dobře roste na výhřevných a zásaditých stanovištích především v teplejších oblastech. Je považován za cennou sadovnickou dřevinu, v minulosti se pěstoval častěji.</p>
			<p>Velice snadno se z výsadby rozrůstá do svého okolí, často tvoří velké porosty.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="řez a aplikace herbicidu"/>
			<ManagementApplication text="lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>SLAVÍK, B. (ed). 1997. Květena České republiky, Vyd. 1.,Praha: Academia</Resource>
			<Resource>MLÍKOVSKÝ, J.A STÝBLO, P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default ZimolezKoziList;
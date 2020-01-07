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

import image from "../../../assets/caseDetails/slunecnice-topinambur.jpg";

const SlunecniceTopinambur = props => (
	<div>
		<Title name="Slunečnice topinambur" nameSynonyms="slunečnice brambor/slunečnice hliznatá/slunečnice bambulitá/zemská jablka /slunečnice bambulinatá/topinambur hlíznatý" latinName="Helianthus tuberosus" latinNameSynonyms="Helianthus tomentosus /Helianthus esculentus/Helianthus subcanescens/Helianthus esculentus"/>
		<Summary>
			<OriginalArea text="střední a východní část USA (od Maine po Floridu a Texas) a jižní Kanada"/>
			<SecondaryArea text="Evropa, další regiony Severní Ameriky, Jižní Amerika, Makronésie, Asie, Nový Zéland"/>
			<Introduction text="Pěstování jako okrasná, užitková a medonosná rostlina"/>
			<Breeding text="Ano (jedlé hlízy s obsahem inulinu)"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Slunečnice topinambur (Jerusalem artichoke) je vytrvalá rostlina s průměrem květu 8 až 10 cm. Zákrov je polokulovitý, tmavě zelený. Okrajové jazykovité květy jsou žluté barvy, květy terče trubkovité, terč je plochý až mírně vypouklý. Slunečnice topinambur kvete od srpna do října. Plodem jsou nažky. Vzrůstově se jedná o statnou 1,2 až 3 m vysokou bylinu, v horní čtvrtině je lodyha větvená, celá drsně chlupatá. Listy jsou vejčité až srdčité, 10-20 cm dlouhé a 5-10 cm široké na okraji zubaté či pilovité, na lodyze uspořádané střídavě i vstřícně. Vertikální hlavní kořen je doprovázen dlouhými postranními oddenky s kulovitými hlízami.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Ve své domovině roste na zamokřených stanovištích. V Evropě se šíří zejména podél řek a vodních toků, najdeme ji v příkopech podél silnic i železnic. Dále se často nachází na rumištích a skládkách, při okrajích polních cest, polí a zahrad a na místech nedávných zemních prací. Mnohdy vytváří rozsáhlé porosty. Vyhovují jí čerstvé, živinami bohaté půdy. Šíří se převážně vegetativně.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="aplikace herbicidu, kosení"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
	</div>
);

export default SlunecniceTopinambur;
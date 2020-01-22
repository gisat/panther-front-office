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

import image from "../../../assets/caseDetails/kridlatka-ceska.jpg";

const KridlatkaCeska = props => (
	<div>
		<Title name="Křídlatka česká" nameSynonyms="" latinName="Reynoutria bohemica" latinNameSynonyms="Fallopia bohemica"/>
		<Summary>
			<OriginalArea text="Severní Japonsko, hybrid pravděpodobně vzniká opakovaně křížením rodičovských druhů v jejich sekundárních areálech"/>
			<SecondaryArea text="Evropa (invazní), S. Amerika (invazní), pravděpodobně všude tam, kde se vyskytují rodičovské druhy"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina, ceněná pro svou vitalitu, křížení probíhalo za účelem zvýšení vitality a rychlosti růstu rostlin v experimentálních zahradnictvích"/>
			<Breeding text="Není zakázaný, ale rostlina je pro pěstování extrémně nevhodná"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Kateřina Berchová-Bímová"
		/>
		<TextBlock>
			<p>Křídlatka česká je vytrvalá oddenkatá, 2,5–3 m vysoká rostlina z čeledi rdesnovitých (<i>Polygonaceae</i>). Morfologickými znaky stojí mezi výše uvedenými rodičovskými druhy a ve střední Evropě je geneticky, a tudíž i morfologicky, poměrně variabilní. Rostliny kombinací znaků tvoří kontinuální přechod od forem morfologicky podobných oběma rodičovským druhům, ale většina klonů je intermediálních. Vytváří husté porosty lodyh, které v dolní části připomínají bambus a v horní části jsou větvené. Listy jsou 15–20 cm dlouhé, tmavě zelené, celokrajné, často s nasazenou špičkou, v dolní části poměrně široké. Báze listu může být jak srdčitá, tak uťatá. Na spodní straně listů jsou přítomné chlupy, což je jediný spolehlivý určovací znak od křídlatky japonské. Kvete v srpnu a září drobnými bílými květy. Suché lodyhy přetrvávají na lokalitách do jara dalšího roku, kdy z oddenků vyrůstají nové lodyhy. Křídlatka ×česká je ze všech tří taxonů nejvitálnější a vytváří nejhustší porosty lodyh. Taxon se na území ČR vyskytuje ve formě obou funkčních pohlaví, tedy jak samičí, tak oboupohlavné rostliny. Někdy tvoří semena. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se šíří zejména regenerací z oddenků a lodyh. Na území Evropy bylo též zaznamenáno občasné šíření semeny (Franci, Německo, S. Morava). Osidluje širokou škálu stanovišť od antropogenních po humózní břehy řek a okraje lesů. Nejvíce se šíří podél vodních toků, kde často vytváří husté až několik desítek metrů široké pásy (Nisa, Labe, Morávka). Křídlatka ×česká je nejagresivnějším a nejvitálnějším druhem rodu patří tak mezi velmi nebezpečné invazní druhy rostlin. Nejvhodnějším způsobem likvidace je mechanické odstraňování a narušování podzemní biomasy v kombinaci s opakovaným postřikem herbicidy. Vzhledem k velkému invaznímu potenciálu, rychlému růstu a vysoké schopnosti regenerace z úlomků oddenků je likvidace doporučená vždy. Vzhledem k vysoké genetické variabilitě se jednotlivé klony rostlin liší ve své vitalitě, a tudíž i v reakci na likvidační zásahy. Likvidace je nutná ve zvláště chráněných částech přírody a na přírodě blízkých stanovištích. Křídlatku je vhodné odstraňovat z mokřadních lokalit a pobřežních porostů. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="Mechanické narušování porostu v kombinaci s opakovanou aplikací herbicidu"/>
			<ManagementApplication text="Plošně, lokálně, místy intenzivní"/>
		</InvasivePotential>
		<Resources>
			<Resource>Bailey J. P., Bímová K. & Mandák B. (2006): Asexual spread versus sexual reproduction and evolution in Japanese Knotweed s.l. sets the stage for the “Battle of the Clones” – Biological invasions (DOI 10.1007/s10530-008-9381-4).</Resource>
			<Resource>Bailey J. P., Bímová K. & Mandák B. (2007): The potential role of polyploidy and hybridisation in the further evolution of the highly invasive <i>Fallopia</i> taxa in Europe. Ecological Research 22: 920–928.</Resource>
			<Resource>Berchová-Bímová K., Soltysiak J., Vach M. (2014): Role of different taxa and cytotypes in heavy metals absorption in knotweeds (Fallopia), Scientia agriculturae bohemica, 45, 2014 (1): 11–18.</Resource>
			<Resource>Berchová-Bímová, K. & Mandák, B. (2008): Všechno zlé je k něčemu dobré: evoluce křídlatek (<i>Fallopia</i>) v sekundárním areálu rozšíření. Zprávy České botanické společnosti.: 43(Mat. 23), 121-140. ISSN 1212-3323.</Resource>
			<Resource>Bímová K., Mandák B. & Kašparová I. (2004): How does <i>Reynoutria</i> invasion fit the various theories of invasibility? – Journal of Vegetation Science 15: 495–504.</Resource>
		</Resources>
	</div>
);

export default KridlatkaCeska;
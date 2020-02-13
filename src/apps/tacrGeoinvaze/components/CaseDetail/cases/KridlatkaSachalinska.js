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

import image from "../../../assets/caseDetails/kridlatka-sachalinska.jpg";

const KridlatkaSachalinska = props => (
	<div>
		<Title name="Křídlatka sachalinská" nameSynonyms="" latinName="Reynoutria sachalinensis" latinNameSynonyms="Polygonum sachalinense/Fallopia sachalinensis/Pleuropterus sachalinensis/Tiniaria sachalinensis"/>
		<Summary>
			<OriginalArea text="Japonsko a ostrov Sachalin"/>
			<SecondaryArea text="Evropa (invazní), S. Amerika (invazní)"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina, ceněná pro svou vitalitu"/>
			<Breeding text="Není zakázané, ale rostlina je pro pěstování nevhodná"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: John Bailey"
		/>
		<TextBlock>
			<p>Křídlatka sachalinská je vytrvalá oddenkatá, 2,5–4 m vysoká rostlina z čeledi rdesnovitých (<i>Polygonaceae</i>). Vytváří husté porosty lodyh, které v dolní části připomínají bambus a v horní části jsou větvené. Listy jsou 20–40 cm dlouhé, živě zelené, celokrajné, zašpičatělé, v dolní části se srdčitou bází. Na spodní straně listů jsou dlouhé chlupy. Kvete v srpnu a září drobnými bílými květy. Suché lodyhy přetrvávají na lokalitách do jara dalšího roku, kdy z oddenků vyrůstají nové lodyhy. Na území ČR se vyskytují další dva obecněji rozšířené taxony – křídlatka japonská (<i>Reynoutria japonica</i> var. <i>japonica</i>) a kříženec mezi oběma druhy křídlatka česká (<i>Reynoutria ×bohemica</i>). Od těchto dvou taxonů se křídlatka sachalinská odlišuje vysokým vzrůstem, velkými papírovitými listy a svazečkovitými květenstvími směřujícími vzhůru. Spolehlivým znakem pro určení taxonu je spodní strana listů, kde se nacházejí až několik milimetrů dlouhé světlé chlupy. Rostliny křídlatky sachalinské jsou většinou oboupohlavné a jsou donory pylu pro ostatní taxony křídlatek.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se šíří zejména regenerací z oddenků a lodyh. Osidluje širokou škálu stanovišť od antropogenních po humózní břehy řek a okraje lesů. Nejvíce se šíří ze zahrad a podél vodních toků. Křídlatka sachalinská je nejméně rozšířeným taxonem rodu, nicméně i tak patří mezi nebezpečné invazní druhy rostlin. Nejvhodnějším způsobem likvidace je mechanické odstraňování nadzemní biomasy v kombinaci s postřikem herbicidy. Negativně též reaguje na kosení a spásání, nicméně těmito způsoby likvidace křídlatky sachalinské trvá i několik let. Likvidace je nutná ve zvláště chráněných částech přírody a na přírodě blízkých stanovištích. Křídlatku je vhodné odstraňovat z mokřadních lokalit a pobřežních porostů. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={2}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="Mechanické narušování porostu v kombinaci s aplikací herbicidu"/>
			<ManagementApplication text="Lokálně, místy intenzivní"/>
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

export default KridlatkaSachalinska;
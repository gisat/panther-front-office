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

import image from "../../../assets/caseDetails/kridlatka-japonska.jpg";

const KridlatkaJaponska = props => (
	<div>
		<Title name="Křídlatka japonská" nameSynonyms="" latinName="Reynoutria japonica" latinNameSynonyms="Polygonum cuspidatum/Pleuropterus cuspidatus/Tiniaria japonica/Fallopia japonica"/>
		<Summary>
			<OriginalArea text="Japonsko"/>
			<SecondaryArea text="Evropa (invazní), Afrika, Austrálie a Nový Zéland (invazní), Severní Amerika (invazní), Jižní Amerika"/>
			<Introduction text="Okrasná rostlina, ceněná pro svou vitalitu, medonosná"/>
			<Breeding text="Není zakázáno, nevhodné, přesto stále pěstována v zahradách a parcích"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Kateřina Berchová-Bímová"
		/>
		<TextBlock>
			<p>Křídlatka japonská var. japonská je vytrvalá oddenkatá, 2–2,5 m vysoká rostlina z čeledi rdesnovitých (<i>Polygonaceae</i>). Lodyhy rostliny jsou statné, duté a dužnaté, listy vstřícné, květenství lata. Morfologicky se od ostatních nepůvodních druhů křídlatek odlišuje kožovitými listy s uťatou bází a nasazenou špičkou, na jejichž spodní straně chybí chlupy a místo nich jsou na žilkách papilnaté výrůstky. Suché lodyhy přetrvávají na lokalitách přes zimu do jara dalšího roku, kdy z oddenků vyrůstají nové lodyhy. V nepůvodním areálu se vyskytuje pouze jeden samičí klon. Rostliny každoročně bohatě kvetou a plodí, nicméně potomstvem jsou vždy hybridní rostliny. V případě, že je donorem pylu křídlatka sachalinská, pak vzniká mezidruhový kříženec křídlatka ×česká. Tito hybridi s největší pravděpodobností v sekundárním areálu opakovaně vznikají a vykazují invazní chování (viz R. ×<i>bohemica</i>). V případě, že je donorem pylu opletka čínská (<i>Fallopia aubertii</i>), pak vzniká mezirodový kříženec ×<i>Reyllopia conollyana</i> J.P. Bailey, který se ovšem ve volné přírodě téměř nevyskytuje (2 lokality v Británii, 2 v Belgii). Ve ČR se vyskytuje vedle nominátní variety také <i>R. jaonica</i> var. <i>compacta</i>, lišící se od nominátní variety kulatými drobnými listy. Tento taxon není znám mimo kulturu.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se rozmnožuje výhradně vegetativně, regenerací z úlomků oddenků a lodyh. Dokáže obsazovat široké spektrum biotopů, od velmi suchých a kamenitých navážek přes břehy toků až po okraje lužních lesů. Je asi nejčastěji se vyskytujícím taxonem, přestože na lokalitách společného výskytu s F. ×<i>bohemica</i> je hybridem konkurenčně vytlačován. Křídlatka japonská je velmi vitální rostlina, která je schopná prorůstat téměř jakýmkoliv substrátem. V přírodních společenstvech je silným kompetitorem a pod porosty křídlatky se kromě jarních geofytů a několika málo nitrofilních druhů nevyskytují žádné rostliny. Z těchto důvodů je vysoce rizikovým invazním druhem, zařazeným mezi 100 nejhorších invazních nepůvodních druhů Evropy. Nejvhodnějším způsobem likvidace je mechanické odstraňování a narušování podzemní biomasy v kombinaci s opakovaným postřikem herbicidy. Vzhledem k velkému invaznímu potenciálu, rychlému růstu a vysoké schopnosti regenerace z úlomků oddenků je likvidace doporučená vždy.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="Aplikace herbicidu"/>
			<ManagementApplication text="Plošně, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Bailey J. P., Bímová K. & Mandák B. (2006): Asexual spread versus sexual reproduction and evolution in Japanese Knotweed s.l. sets the stage for the “Battle of the Clones” – Biological invasions (DOI 10.1007/s10530-008-9381-4).</Resource>
			<Resource>Bailey J. P., Bímová K. & Mandák B. (2007): The potential role of polyploidy and hybridisation in the further evolution of the highly invasive Fallopia taxa in Europe. Ecological Research 22: 920–928.</Resource>
			<Resource>Berchová-Bímová K., Soltysiak J., Vach M. (2014): Role of different taxa and cytotypes in heavy metals absorption in knotweeds (<i>Fallopia</i>), Scientia agriculturae bohemica, 45, 2014 (1): 11–18.</Resource>
			<Resource>Berchová-Bímová, K. & Mandák, B. (2008): Všechno zlé je k něčemu dobré: evoluce křídlatek (<i>Fallopia</i>) v sekundárním areálu rozšíření. Zprávy České botanické společnosti.: 43(Mat. 23), 121-140. ISSN 1212-3323.</Resource>
			<Resource>Bímová K., Mandák B. & Kašparová I. (2004): How does <i>Reynoutria</i> invasion fit the various theories of invasibility? – Journal of Vegetation Science 15: 495–504.</Resource>
		</Resources>
	</div>
);

export default KridlatkaJaponska;
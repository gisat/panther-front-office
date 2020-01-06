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

import image from "../../../assets/caseDetails/jelen-sika.jpg";

const Jelen = props => (
	<div>
		<Title name="Jelen sika" nameSynonyms="" latinName="Cervus nippon" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Východní a jihovýchodní Asie"/>
			<SecondaryArea text="Evropa, Zakavkazí, USA, Filipíny, Nový Zéland"/>
			<Introduction text="únik z chovů, záměrné vypouštění"/>
			<Breeding text="v oborách podle mysliveckého plánování, ve volné přírodě nekontrolovatelný"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto J. Červený"
		/>
		<TextBlock>
			<p>U nás rozšířený sika je považován za poddruh označovaný jako sika japonský (C. n. nippon). Tělo má až 145 cm dlouhé, ocas 25 cm, výška v kohoutku je 95 cm a hmotnost 55 kg. Stejně jako u jiných jelenovitých jsou i u tohoto druhu laně výrazně menší než jeleni. Kdysi se k nám dovážel i poněkud větší sika Dybowského (C. n. dybowskii, syn. C. n. hortulorum), takže je jisté, že se oba poddruhy mezi sebou křížily. Tvarem těla je sika dosti podobný jelenu evropskému. Letní srst má kaštanově hnědou s bílými skvrnami a tmavým pruhem na hřbetě. V zimním šedohnědém až téměř černém zbarvení je skvrnění nevýrazné. Tmavý ocas kontrastuje s bílým obřitkem. Samcům vyrůstá poměrně jednoduché paroží a v době říje mají krátkou hřívu. Sika sice není v Evropském seznamu nepůvodních invazních druhů, je ale uveden na Seznamu prioritních invazních druhů ČR (tzv. černý seznam, Pergl et a. 2016). Myslivecká legislativa tento druh řadí mezi zvěř se stanovenou dobou lovu. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Sika je nenáročný druh, který se dobře přizpůsobuje různým podmínkám. Nejlépe mu vyhovují listnaté a smíšené lesy rozvolněné krajiny nižších a středních poloh, běžně však obývá i podhorské jehličnaté lesy. Původně obýval pouze obory, dnes se vyskytuje i ve volné přírodě. Jako ostatní druhy jelenů je sika býložravec, není však schopen využívat vlákninu tak efektivně jako např. jelen evropský, a proto je poněkud náročnější při výběru potravy. Obdobně jako jelen evropský poškozuje dřeviny okusem, ohryzem a loupáním kůry. V zimě využívá mysliveckého přikrmování. Způsob života je obdobný jako u jelena evropského. Říje však začíná až v druhé polovině října. Samci v říji netroubí, ale pískají. Vůči ostatní spárkaté zvěři je sika agresivní a vyhání ji ze svých stanovišť. V oblastech společného výskytu obou druhů dochází k postupnému prolínání doby říje a k nežádoucí hybridizaci. Kříženci jsou i nadále plodní a vykazují znaky obou druhů. Dnes jsou na našem území dvě hlavní oblasti výskytu tohoto jelena, a to v západních Čechách a na severní Moravě; odtud se sika dále intenzivně šíří. Rychle stoupá i početnost druhu čímž v invadovaných oblastech vzniká silný negativní vliv na prostředí.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J.: Červený seznam savců České republiky. Příroda, 22: 139-149.</Resource>
			<Resource>Anděra M., Červený J. 2009: Velcí savci v České republice. Rozšíření, historie a ochrana. 1. Sudokopytníci (Artiodactyla). Národní muzeum, Praha, 87 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource>Červený J., Anděra M., Koubek P., Homolka M., Toman A., 2001: Recently expanding mammal species in the Czech Republic: distribution, abundace and legal status. Beiträge zur Jagd- und Wildforschung, 26: 111-125.</Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
		</Resources>
	</div>
);

export default Jelen;
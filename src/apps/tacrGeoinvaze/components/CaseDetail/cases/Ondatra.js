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

import image from "../../../assets/caseDetails/ondatra-pizmova.jpg";

const Ondatra = props => (
	<div>
		<Title name="Ondatra pižmová" nameSynonyms="Bobřík pižmový" latinName="Ondatra zibethicus" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="Evropa, Asie"/>
			<Introduction text="Na začátku 20. století na rybníku ve Staré Huti u Dobříše"/>
			<Breeding text="bezpředmětný"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: J. Vogeltanz"
		/>
		<TextBlock>
			<p>Ondatra je náš největší hraboš, délka jejího těla dosahuje až 40 cm, hmotnost až 1,6 kg. Má ze stran nápadně zploštělý, až 29 cm dlouhý a drobnými šupinkami pokrytý ocas, který používá při plavání jako kormidlo. K morfologickým adaptacím k životu ve vodním prostředí patří i tuhé brvy na zadních chodidlech, ale plovací blány jako bobři ondatry nemají. Základní barva srsti je hnědá až šedohnědá, spodek těla je většinou světleji žlutohnědý. U samců jsou u řitního otvoru velké pachové žlázy. Ondatra pižmová je v Evropském seznamu nepůvodních invazních druhů a její záměrné šíření je protizákonné. Je uvedena i na Seznamu prioritních invazních druhů ČR (tzv. černý seznam). Myslivecká legislativa tento druh řadí mezi lovné druhy, roční odlov posledních deseti letech má sestupnou tendenci od cca 800 kusů na současných 150. Vzhledem ke kvalitě kožky ondatry (tzv. bizam) ji lze lovit pouze odchytem.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Ondatra pižmová obývá především břehy stojatých a pomalu tekoucích vod v nižších a středních polohách (do 700 m n. m.). Kamenité břehy rychle tekoucích horských toků ondatrám příliš nevyhovují. Je to býložravec, který se živí převážně rostlinnou potravou, zvláště orobincem, rákosem a jinými vodními rostlinami. V zimě ondatry nepohrdnou ani kořeny a oddenky, které musí často vyhryzávat i zpod ledu. Občas si zpestřují jídelníček také vodními živočichy, zejména škeblemi. Mezi vodním rostlinstvem si ondatry dělají, obdobně jako jiné druhy hrabošů, krmné stolečky. Ondatry žijí obvykle v párech. Hrabou si až 10 metrů dlouhé nory s hnízdní dutinou, nebo si v mělké vodě stavějí z rákosu, ostřic a jiných rostlin vysoké kupy. Stejně jako bobři mají i ondatry vchod do svých sídel takřka výhradně pod vodní hladinou. Na rybnících si v rákosí vyhryzávají jakési vodní chodníky. Početnost druhu v naší přírodě výrazně klesá, jeho výskyt nepřináší žádné problémy.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J., 2003: Červený seznam savců České republiky. Příroda,22: 139-149.</Resource>
			<Resource>Anděra M., Beneš B., 2001: Atlas rozšíření savců v České republice. Předběžná verze IV. Hlodavci (<i>Rodentia</i>) - část křečkovití (<i>Cricetidae</i>), hrabošovití (<i>Arvicolidae</i>), plchovití (<i>Glyriidae</i>). Národní muzeum, Praha, 156 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource>Foit J., Křižanová I., 2010: Neobvyklé potravní chování ondatry pižmové. Živa 58(2): 91</Resource>
			<Resource>Hanák P.,1980: Rozšíření, rozmnožování, věková struktura a kvalita kožek jihočeské populace ondatry pižmové (<i>Ondatra zibethicus</i> L. 1766). Kandidátská disertační práce, Ústav pro výzkum obratlovců, AV ČR Brno, 154 pp.</Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
		</Resources>
	</div>
);

export default Ondatra;
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

import image from "../../../assets/caseDetails/korbikula-asijska.jpg";

const KorbikulaAsijska = props => (
	<div>
		<Title name="Korbikula asijská" nameSynonyms="" latinName="Corbicula fluminea" latinNameSynonyms="Tellina fluminea"/>
		<Summary>
			<OriginalArea text="Jihovychodni čast Asie (jihovychodní Čina, Korea a jihovychodni čast Ruska)"/>
			<SecondaryArea text="Postupně osídlila téměř celou Evropu. Introdukována (balastní vodou) i do Severní Ameriky.  Vyskytuje se také v Africe, Austrálii a Jižní Americe. Na naše území pronikla Labem z Německa a postupně expandovala proti proudu do středních Čech. Detekována také v dolním toku Vltavy (po Prahu, včetně plavebního kanálu Vraňany—Hořín) a Ohře (po Terezín). Pozorována v některých menších přítocích Labe, jakým je např. potok Vlkava u Kostomlat nad Labem. Od r. 2009 je sledována neobvyklá lokalita na rozhraní středních a severních Čech, kde korbikula dosahuje zatím největší známé koncentrace na našem území. Jde o betonový kanál vedoucí mírně oteplenou vodu z odkališť Elektrárny Mělník do Labe jižně od obce Horní Počaply. Lze předpokládat další šíření, a to jak ve vlastním Labi, tak i do jeho větších přítoků. Zároveň nelze vyloučit invazi Dunajem ze Slovenska na naše území. Očekává se její postupné objevení na řece Moravě a Dyji. "/>
			<Introduction text="Zejména lodní dopravou (balastní voda) a stavbou kanálů"/>
			<Breeding text="Vzácně"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Ondřej Simon (lokalita Praha – Suchdol, 2017)"
		/>
		<TextBlock>
			<p>Sladkovodní mlž o velikosti 25 - 40 mm; od našich mlžů stejné velikosti (okružanky) se liší silnostěnnou lasturou s výraznými růstovými žebry.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Korbikula asijská obývá okysličené bahnité až písčité sedimenty vodních biotopů (např. oligotrofní až eutrofní toky, řeky a jezera). Druh můžeme nalézt i mezi štěrkem či dlažebními kostkami, a to díky schopnosti přežít určitý čas mimo vodní prostředí. Vyžaduje vyšší obsah vápníku a kyslíku ve vodě. Díky rychlému růstu a rychlosti rozmnožovaní se může vyskytovat v obrovských početnostech, čímž ovlivňuje trofii a koloběh živin ve vodních ekosystémech a tím původní druhy mlžů. Poškozuje i vodárenská zařízení (např. ucpáním potrubí). Druhy z rodu <i>Corbicula</i> zahrnují různé reprodukční režimy. Převážně se jedná o hermafrodity, kde se vedle vajíček produkují současně také spermie. Pokud nenajde partnera k oplodnění, tak dochází k samooplození. K rozmnožování dochází při teplotách 15 °C od tří měsíců věku. K oplodnění dochází uvnitř plášťové dutiny a larvy jsou po nějaký čas inkubovány přímo v rodičovském organismu. Po tomto ochranném období jsou larvy vypouštěny do vody a zahrabány do substrátu. Po uvolnění opět do vodního sloupce se mladí jedinci ukotví k sedimentům, vegetaci nebo tvrdým povrchům v důsledku schopnosti produkovat lepkavé řetězce hlenu, které jim umožňují i šíření na značné vzdálenosti. Životnost tohoto druhu je velmi variabilní, pohybuje se od 1 do 5 let. Vzhledem k taxonomickému nesouladu uvnitř této skupiny je třeba v budoucnu studovat všechny morfometrické typy.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="v řekách nereálný, jen v umělém prostředí sběrem jedinců"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>BERAN L., 2018: Korbikula asijská – další přistěhovalec dobývá Prahu. [The Asian Clam – Another Immigrant Invades Prague]. Živa, 66(5): 257–258</Resource>
			<Resource>BERAN L. 2013: Současný stav invaze a neobvyklá lokalita korbikuly asijské / Unusual Site of the Asian Clam, Živa 1: 25</Resource>
			<Resource>GOTTFRIED P. K. et OSBORNE J. A., 1982: Distribution, abundance and size of <i>Corbicula
				manilensis</i> (Philippi) in a spring-fed central Florida stream. Florida Scientist
				45 (3): 178–188.
			</Resource>
			<Resource>HAKENKAMP C. C., RIBBLETT S. G., PALMER M. A., SWAN C. M. REID J. W. et GOODISON
				M. R., 2001: The impact of an introduced bivalve (<i>Corbicula fluminea</i>) on the
				benthos of a sandy stream. Freshwater Biology 46: 491–501.
			</Resource>
			<Resource>LACHNER E. A., ROBINS C. R. & COURTNEAY W. R., 1970: Exotic fishes and other aquatic organisms introduced into North America. Smithsonian Contributions to Zoology 59: 1–29.</Resource>
			<Resource>MLÍKOVSKÝ J., STÝBLO P., eds., 2006: Nepůvodní druhy fauny a flóry ČR, ČSOP Praha, 496 pp</Resource>
			<Resource>RENARD, E., BACHMANN, V., CARIOU, M. L. et MORETEAU, J. C., 2000: Morphological and molecular differentiation of invasive freshwater species of the genus <i>Corbicula</i> (<i>Bivalvia, Corbiculidea</i>) suggest the presence of three taxa in French rivers. Molecular Ecology, 9: 2009-2016.</Resource>
			<Resource>SOUSA, R., ANTUNES C. et GUILHERMINO L., 2008: Ecology of the invasive Asian clam Corbicula fluminea (Müller, 1774) in aquatic ecosystems: An overview. Annales de Limnologie - International Journal of Limnology. 44. 85 - 94.</Resource>
			<Resource>ŽADIN V. I., 1952: Moljuski presnych i solonovatych vod SSSR. Moskva: Izd. ANSSSR, 376 pp.</Resource>
		</Resources>
	</div>
);

export default KorbikulaAsijska;
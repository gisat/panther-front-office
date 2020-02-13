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

import image from "../../../assets/caseDetails/skeblice-asijska.jpg";

const SkebliceAsijska = props => (
	<div>
		<Title name="Škeblice asijská" nameSynonyms="" latinName="Sinanodonta woodiana" latinNameSynonyms="Anodonta (Sinanodonta) woodiana/ Anodonta calypigos/Sinanodonta woodiana calypigos"/>
		<Summary>
			<OriginalArea text="Východní a jihovýchdní Asie"/>
			<SecondaryArea text="V současné době byla introdukována do mnoha oblastí po celém světě.  Rumunsko, Maďarsko, Slovensko, Německo, Rakousko, Holandsko. Známa i z Ukrajiny a střední Asie pravděpodobně v Rumunsku okolo roku 1970. Genetické studie prokázaly, že se v Polsku se rozšířila přes sádkové ryby z Maďarska a stejné genetické skupiny jsou pak také v Itálii a na Ukrajině. U nás byla poprvé pozorována na jižní Moravě a postupně dochází k nálezům na dalších lokalitách (např. Třeboňsko, Vltava). Očekává se další šíření. "/>
			<Introduction text="rekreační rybářství a rybniční akvakultura, zejména převozem ryb"/>
			<Breeding text="vzácně"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Alexander Mrkvicka"
		/>
		<TextBlock>
			<p>Škeble s téměř kruhovitou lasturou o velikosti zhruba našich druhů, v dobrých podmínkách i větší, tzn. kolem 10–20 cm. Vnější strana lastur má výrazný kupovitý vrchol s hrubými valy, barva může být variabilní (černošedá, s odstíny zelené a hnědé barvy, s příměsí tmavě fialové). Vnitřní stranu pokrývá růžově zbarvená perleť.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o filtrátora žijícího na dně vodních biotopů s měkkým substrátem a dostatkem živin (např. pomalu tekoucí řeky, potoky, rybníky, přehradní nádrže). Zde může vytvářet početné populace a způsobovat nadměrnou filtraci a tím narušit ekosystému vod, kdy dochází k podstatným změnám původních rostlinných a živočišných společenstev. Škeblice asijská je odděleného pohlaví (vzácně lze nalézt i hermafrodity). Rozmnožuje se již v druhém roce života a dožívá se 10—15 let. Oproti původním druhům škeblí (<i>Anodonta sp.</i>) má mnoho konkurenčních výhod. Snáší teplotní stres a znečištění zinkem, rozmnožuje se po výrazně delší období (od března do října), využívá více hostitelských druhů ryb pro larvální stadium (glochidie) a není tak limitována rybí obsádkou. Hlavní období vypouštění glochidií je v letních měsících (červen-září). Glochidium se pasivně vznáší ve vodě a samostatně může žít jen několik málo dní. Pro dokončení vývoje potřebují hostitelskou rybu. Zásadním mechanismem šíření je tedy přenos vázaný na rybí hostitele, díky němuž může škeblice překonávat i značné vzdálenosti. Parazitické stádium může mít negativní vliv na fitness hostitelské ryby a rovněž konkurovat nativním druhům s podobným životním cyklem.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="krátkodobé vysušení nádrže, manuální sběr jedinců (v řekách nelze)"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>BERAN L., 2002: Vodní měkkýši České republiky – rozšíření a jeho změny, stanoviště,
				šířeni, ohroženi a ochrana, červeny seznam. Sborník přírodovědného klubu
				v Uherském Hradišti, Supplementum 10, 258 pp.
			</Resource>
			<Resource>BIELEN A., BOSNJAK I., SEPCIC K., JAKLIČ M., CVITANIĆ M., LUŠIĆ J., LAJTNER J., SIMČIČ T., HUDINA S., 2016: Differences in tolerance to anthropogenic stress between invasive and native bivalves. Science of The Total Environment, 543: 449-459.</Resource>
			<Resource>DOUDA K., VRTÍLEK M., SLAVÍK O. et REICHARD, M., 2012: The role of host specificity in explaining the invasion success of the freshwater mussel <i>Anodonta woodiana</i> in Europe. Biological Invasions, 14.1: 127-137.</Resource>
			<Resource>DOUDA K., KALOUS L., HORKÝ P., SLAVÍK O., VELÍŠEK J. et KOLÁŘOVÁ J., 2016: Metodika eliminace a prevence šíření invazního druhu škeblice asijská (Sinanodonta woodiana) ve vodních ekosystémech a akvakulturních zařízeních ČR. Katedra zoologie a rybářství, Česká zemědělská univerzita v Praze, Kamýcká 129, 165 00 Praha 6 – Suchdol, 49 pp. ISBN: 978-80-213-2717-7</Resource>
			<Resource>GLOER P. et MEIER-BROOK C., 2003: Susswassermollusken (Ein Bestimmungsschlussel
				fur die Bundesrepublik Deutschland). 13. Aufl age. Hamburg: Deutscher Jugenbund
				fur Naturbeobachtung, 136 pp.
			</Resource>
			<Resource>HLIWA P., et al., 2015: Temporal changes in gametogenesis of the invasive Chinese pond mussel <i>Sinanodonta woodiana</i> (Lea, 1834) (Bivalvia: Unionidae) from the Konin lakes system (Central Poland). Folia biologica, 63.3: 175-185.</Resource>
			<Resource>KERNEY M., 1999: Atlas of the Land and Freshwater Molluscs of Britain and Ireland.
				London: Harley Books, 261 pp.
			</Resource>
			<Resource>KOŠEL V., 1995: The First Record of <i>Anodonta woodiana</i> (Mollusca, Bivalvia) in
				Slovakia. Acta zool. Univ. Comenianae 39: 3–7.
			</Resource>
			<Resource>LORENCOVÁ, E., L. BERAN, V. HORSÁKOVÁ et M. HORSÁK, 2015. Invasion of freshwater molluscs in the Czech Republic: Time course and environmental predictors Malacologia. vol 59, 105-120.</Resource>
			<Resource>MEIER-BROOK C., 2002: What makes an aquatic ecosystem susceptible to mollusc
				invasions? In: Collectanea Malacologica: 405–417. Hackenheim: ConchBooks.
			</Resource>
			<Resource>NOVÁK J., 2004: Třetí potvrzený nález škeble asijské v ČR. Živa 2004 (1): 41–42.</Resource>
			<Resource>SOROKA M., URBAŃSKA M. et ANDRZEJEWSKI W., 2014: Chinese pond mussel Sinanodonta woodiana (Lea, 1834) (Bivalvia): origin of the Polish population and GenBank data. Journal of Limnology, 2014, 73.3.</Resource>
			<Resource>YURISHINETS V. I. et KORNIUSHIN A. V., 2001: <i>Sinanodonta woodiana</i> (<i>Bivalvia, Unionidae</i>),
				a new species in the fauna of Ukraine, its diagnostics and possible ways
				of introduction. Vestnik zoologii 35 (1): 79–84.
			</Resource>
			<Resource>ŽADIN V. I., 1952: Moljuski presnych i solonovatych vod SSSR. Moskva: Izd. AN
				SSSR, 376 pp.
			</Resource>
		</Resources>
	</div>
);

export default SkebliceAsijska;
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

import image from "../../../assets/caseDetails/slavicka-mnohotvarna.jpg";

const SlavickaMnohotvarna = props => (
	<div>
		<Title name="Slávička mnohotvárná" nameSynonyms="" latinName="Dreissena polymorpha" latinNameSynonyms="Mytilus polymorphus/ Dreissensia polymorpha/Dreissenia polymorpha/Mytilus chemnitzii/Tichogonia chemnitzii "/>
		<Summary>
			<OriginalArea text="Původně ponticko-kaspický druh vyskytující se především v deltách řek. "/>
			<SecondaryArea text="Postupně osídlila téměř celou Evropu. V roce 1986 byla lodní dopravou (s tzv. balastní vodou) introdukována do Severní Ameriky. Do Čech se tento druh rozšířil Labem z Německa. Nálezy koncentrovány podél řeky Labe do pískoven, odstavených ramen spojených s Labem, a především do vlastního toku Labe. Izolované nálezy pocházejí i z jiných míst (Kožlí, kv. 6357, údolní nádrž Švihov na Želivce; Příšovice, kv. 5456, pískovny u Příšovic u Jizery). Dále je známa podél Moravy. Nejvýše proti proudu položené lokality se nacházejí severně od Olomouce."/>
			<Introduction text="Zejména lodní dopravou (balastní voda) a stavbou kanálů"/>
			<Breeding text="Vzácně"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Charakteristická zebrovitá kresba na povrchu lastury. Foto převzato z www.nobanis.org."
		/>
		<TextBlock>
			<p>Mlž o velikosti do 30 mm s trojhranně člunkovitým tvarem silných lastur s tmavohnědou zebrovitou kresbou, žijící přisedle na různých předmětech.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Na rozdíl od našich jiných mlžů žije v dospělosti trvale přisedle na různých předmětech ve vodě a snáší i extrémnější podmínky.  Preferuje hloubky a střední rychlost proudění.  Živí se filtrací planktonu. Hustota populace se může v jednotlivých letech měnit, v příhodných stanovištích může dosáhnout desítek až stovek tisíc jedinců na 1 m<sup>2</sup>. Pokud se vyskytuje v početných populacích tak dochází k nadměrné filtraci a narušení ekosystému vod, kdy dochází k podstatným změnám původních rostlinných a živočišných společenstev. Slávička je odděleného pohlaví. Rozmnožování začíná při teplotě vody nad 13 °C, vajíčka i spermie se vypouští do volné vody, kde dochází k oplození. Larvální planktonické stadium je poté unášeno vodními proudy (případně pravděpodobně může být pasivně přichyceno na nohy vodních ptáků). Tímto způsobem se slávička snadno a rychle šíří. Dokáže se uchytit i na vrcholcích schránek jiných mlžů, zvláště pokud nejsou na dně jiné pevné předměty. Na schopnost přichycování má vliv salinita. Primárně sladkovodní organismus, ale schopna tolerovat salinitu do 14 ‰, optimální limit je však nižší. Optimální rozsah teploty je 17—23°C. Je zde však značná variabilita, co se do maximálního limitu tolerance slávičky týče. Dá se předpokládat, že bude časem častěji kolonizovat i lokality s vyšší teplotou než 30 °C. Aby došlo k rozmnožování, musí být teplota vody vyšší než 12 °C. Vyžaduje vyšší koncentraci vápníku ve vodě a vyšší hodnotu pH. Nejrychleji slávička roste při koncentracích vápníku okolo 70 mg/l. Minimální požadované koncentrace jsou odlišné v závislosti na prostředí, ve kterém se slávička mnohotvárná vyskytuje. Podle evropských údajů se hodnota pohybuje okolo 28 mg/l, nicméně v Severní Americe přežívá i koncentrace 15 mg/l. Na základě zjištění množství rozpuštěného vápníku ve vodě se dá předpovědět potencionální distribuce slávičky. Na našem území se vyskytuje od roku 1891 a dlouho se příliš nešířila. Postupně však došlo k rozvoji populací. Najdeme ji v úživnějších a větších vodních tocích, oligotrofních až mezotrofních nádržích a vodních plochách vzniklých v souvislosti s těžbou (např. pískovny). Nyní se nachází zejména v povodí Moravy a Labe. V povodí Moravy působí škody zejména na novomlýnských nádržích. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="v řekách nereálný, v menších nádržích sběr jedinců, specifické moluskocidy"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>BERAN L., 2018: Slávička mnohotvárná – náš nejstarší přistěhovalec mezi mlži. [Zebra Mussel - Our Oldest Immigrant Gastropod]. Živa, 66(5): 255–256</Resource>
			<Resource>GRUTTERS BART, VERHOFSTAD MICHIEL, VAN DER VELDE GERARD, RAJAGOPAL, SANJEEV et LEUVEN, ROB S.E.W., 2012: A comparative study of byssogenesis on zebra and quagga mussels: the effects of water temperature, salinity and light–dark cycle. Biofouling,  28.2: 121-129.</Resource>
			<Resource>KARATAYEV A. Y., BURLAKOVA L. E. et PADILLA D. K., 1998: Physical factors that limit the distribution and abundance of Dreissena polymorpha (Pallas). Journal of Shellfish Research 17 (4): 1219-1235. </Resource>
			<Resource>LORENCOVÁ, E., L. BERAN, V. HORSÁKOVÁ et M. HORSÁK, 2015. Invasion of freshwater molluscs in the Czech Republic: Time course and environmental predictors Malacologia. vol 59, 105-120.</Resource>
			<Resource>LUDYANSKIY M. L., MCDONALD D. et MACNEILL D., 1993: Impact of the zebra mussel, a bivalve invader. BioScience 43 (8): 533-544.</Resource>
			<Resource>MCMAHON R. F., 1996: The physiological ecology of the zebra mussel, <i>Dreissena polymoprha</i> in the North America and Europe. American Zoologist. 36: 339-363.  </Resource>
			<Resource>MLÍKOVSKÝ J., STÝBLO P., eds., 2006: Nepůvodní druhy fauny a flóry ČR, ČSOP Praha, 496 pp</Resource>
			<Resource>SANZ-RONDA, FRANCISCO JAVIER, SANDRA LÓPEZ-SÁENZ, ROBERTO SAN-MARTÍN et ANTONI PALAU-IBARS. “Physical habitat of zebra mussel (<i>Dreissena polymorpha</i>) in the lower Ebro River (Northeastern Spain): influence of hydraulic parameters in their distribution.” <i>Hydrobiologia</i> 735 (2013): 137-147.</Resource>
			<Resource>STRAYER D. L., 1991: Projected distribution of the zebra mussel Dreissena polymorpha, in North America. Canadian Journal of Fisheries and Aquatic Sciences 48 (8): 1389-1395.</Resource>
		</Resources>
	</div>
);

export default SlavickaMnohotvarna;
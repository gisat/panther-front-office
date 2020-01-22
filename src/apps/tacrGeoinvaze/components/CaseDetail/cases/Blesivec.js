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

import image from "../../../assets/caseDetails/blesivec-velkohrby.jpg";

const Blesivec = props => (
	<div>
		<Title name="Blešivec velkohrbý" nameSynonyms="blešivec ježatý" latinName="Dikerogammarus villosus" latinNameSynonyms="Gammarus villosus"/>
		<Summary>
			<OriginalArea text="Evropa, ponto-kaspická oblast, spodní tok Dunaje od Dunajského ohbí (Dunakanyar) dále"/>
			<SecondaryArea text="V Evropě se šíří řekami včetně Labe, Vltavy, Ohře a Bíliny "/>
			<Introduction text="Lodní dopravou i samovolně"/>
			<Breeding text="Nechová se, někteří akvaristi jej loví jako příležitostné krmení pro ryby"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: S. Giesen"
		/>
		<TextBlock>
			<p>Dospělec dorůstá až 30 mm, samci o něco větší než samice. Bočně zploštělé a částečně průsvitné tělo (vzácněji tmavé) členěné na hlavu, hruď a zadeček. Na hlavě je pár relativně velkých kusadel. Na urosomech jsou výrazné kónické výrůstky. Druhý pár tykadel má řídce obrvenou stopku a bičík pokrytý trsy brv připomínajících kartáčky.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Obývá sladkovodní i brakické prostředí, jezera, řeky a kanály s malou rychlostí proudění. Je velice adaptabilní, dokáže se přizpůsobit různým typům substrátu kromě písku. Je tolerantní k různým teplotám vody (0—35 °C, optimum je 5—15 °C) a koncentracím kyslíku rozpuštěného ve vodě (minimum je 0,38 mg/l). Přichytává se k substrátu, kamenům a kořenům. Jedná se o predátora, který loví ostatní bezobratlé včetně ostatních blešivců. Je schopen konzumovat i detrit a řasy. Vůči slabším jedincům vlastního druhu se může projevovat kanibalsky. Zabitou kořist někdy zkonzumuje jen částečně nebo vůbec ne. Pohlavně dospívá v jednom měsíci věku. Samice klade v jedné snůšce 30—194 vajec. Na lokalitě, kde se etabluje, se vyskytuje ve vysokých hustotách (cca. několik set jedinců na m<sup>2</sup>).</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="cíleně se neprovádí"/>
		</InvasivePotential>
		<Resources>
			<Resource>Bij de Vaate, A. (2001). Oxygen consumption, temperature and salinity tolerance of the invasive amphipod <i>Dikerogammarus villosus</i>: indicators of further dispersal via ballast water transport. Arch. Hydrobiol, 152, 633-646.</Resource>
			<Resource>Dick, J. T., & Platvoet, D. (2000). Invading predatory crustacean <i>Dikerogammarus villosus</i> eliminates both native and exotic species. Proceedings of the Royal Society of London. Series B: Biological Sciences, 267(1447), 977-983.</Resource>
			<Resource>Dick, J. T., Platvoet, D., & Kelly, D. W. (2002). Predatory impact of the freshwater invader <i>Dikerogammarus villosus</i> (Crustacea: Amphipoda). Canadian Journal of Fisheries and Aquatic Sciences, 59(6), 1078-1084.</Resource>
			<Resource>Hellmann, C., Worischka, S., Mehler, E., Becker, J., Gergs, R., & Winkelmann, C. (2015). The trophic function of <i>Dikerogammarus villosus</i> (Sowinsky, 1894) in invaded rivers: a case study in the Elbe and Rhine. Aquatic Invasions, 10(4), 385-397.</Resource>
			<Resource>Rewicz, T., Grabowski, M., MacNeil, C., & Bacela-Spychalska, K. (2014). The profile of a'perfect'invader--the case of killer shrimp, <i>Dikerogammarus villosus</i>. Aquatic Invasions, 9(3).</Resource>
		</Resources>
	</div>
);

export default Blesivec;
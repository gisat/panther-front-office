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

import image from "../../../assets/caseDetails/rak-mramorovany.png";

const RakMramorovany = props => (
	<div>
		<Title name="Rak mramorovaný" nameSynonyms="" latinName="Procambarus virginalis" latinNameSynonyms="Procambarus fallax f. virginalis"/>
		<Summary>
			<OriginalArea text="neznámý, rak pravděpodobně pochází ze Severní Ameriky, ale k vzniku druhu jako takového mohlo dojít až v akváriích v Německu. Rodičovským druhem byl pravděpodobně rak klamavý."/>
			<SecondaryArea text="Ojediněle na různých místech v Evropě včetně ČR, místy tvoří početné populace (např. na Slovensku)."/>
			<Introduction text="Vypouštěn pravděpodobně záměrně akvaristy"/>
			<Breeding text="Velice populární akvarijní druh"/>
		</Summary>
		<CaseImage
			source={image}
		/>
		<TextBlock>
			<p>V akváriích dorůstá 80 až 100 mm v délce těla, jedinci v přírodě jsou větší (přibližně 120 mm). Krunýř je hladký, po stranách hlavy je jeden pár trnů. Typické je nepravidelné mramorování hlavohrudi i zadečku (béžové, hnědé až hnědočervené skvrny). Vzorec mramorování je pro každého jedince unikátní. Za očima se nachází jeden pár postorbitálních lišt. Po délce těla se přes hlavohruď a zadeček táhne na každém boku nepravidelný černý pruh doplněný na zadečku ještě jedním méně zřetelným. Klepeta jsou relativně krátká a úzká, dosahují přibližně poloviny délky hlavohrudi. Areola (prostor mezi žábrosrdečními švy) je poměrně široká, což raka mramorovaného odlišuje od příbuzného raka červeného (<i>P. clarkii</i>) a raka floridského (<i>P. alleni</i>).</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o adaptabilní druh, který je částečně tolerantní i k salinitě vody. Dožívá se 3 až 5 let věku. Osídluje střední a větší toky, případně i nádrže, rychlému proudění vody se ale vyhýbá. Pokud jsou samice z nějakého důvodu izolované od samců, mohou se začít množit partenogeneticky (ráčata se líhnou z neoplozených vajec). V jedné snůšce může být i více než 500 vajec. Jedná se o raka s neobvyklou denní aktivitou. Nejedná se o příliš hrabavý druh, hloubí si jen mělké nory. Stejně jako ostatní raci, je i rak pruhovaný všežravcem. Vzhledem k drobnějším klepetům není tak zdatným lovcem jako druhy s klepety většími. Je přenašečem infekčního račího moru a může se sympatricky vyskytovat na jedné lokalitě s dalšími invazními raky.</p>
			<p>Poprvé uváděný v 90. letech 20. století v Německu. Zdejší akvaristi jej popsali díky zřetelnému mramorování jako Marmorkrebs (angl. marbled crayfish). Je schopen osídlit ve stojaté i tekoucí vody, příliš velké proudění mu nevyhovuje. Dožívá se přibližně tří let věku. Má velice rychlou generační periodu a dospívá již ve věku čtyř až pěti měsíců a ve velikosti 3,5 až 4 cm délky těla. Jedná se o druh množící se výhradně partenogeneticky, kdy se z neoplozených vajec líhnou klony samice. To je u raků zcela unikátní strategie. Na založení nové populace tedy teoreticky stačí jedna samice. Samci u tohoto druhu nebyli nikdy nalezeni. V jedné snůšce může být více než 700 vajec. Na prudký pokles teploty reaguje svlečením krunýře. Ač je to rak s v poměru k tělu drobnými klepety, je vnitrodruhově značně agresivní. Je přenašečem infekčního račího moru.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={0}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Hossain, M. S., Patoka, J., Kouba, A., & Buřič, M. (2018). Clonal crayfish as biological model: a review on marbled crayfish. Biologia, 73(9), 841-855.</Resource>
			<Resource>Kouba, A., Petrusek, A., & Kozák, P. (2014). Continental-wide distribution of crayfish species in Europe: update and maps. Knowledge and Management of Aquatic Ecosystems, 413, 05.</Resource>
			<Resource>Patoka, J., Buřič, M., Kolář, V., Bláha, M., Petrtýl, M., Franta, P., ... & Kouba, A. (2016). Predictions of marbled crayfish establishment in conurbations fulfilled: evidences from the Czech Republic, 71, 1380-1385.</Resource>
			<Resource>Patoka, J., Kalous, L., & Kopecký, O. (2014). Risk assessment of the crayfish pet trade based on data from the Czech Republic. Biological Invasions, 16(12), 2489-2494.</Resource>
			<Resource>Scholtz, G., Braband, A., Tolley, L., Reimann, A., Mittmann, B., Lukhaup, C., ... & Vogt, G. (2003). Ecology: Parthenogenesis in an outsider crayfish. Nature, 421(6925), 806.</Resource>
		</Resources>
	</div>
);

export default RakMramorovany;
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

import image from "../../../assets/caseDetails/dub-cerveny.jpg";

const DubCerveny = props => (
	<div>
		<Title name="Dub červený" nameSynonyms="" latinName="Quercus rubra" latinNameSynonyms="Erythrobalanus rubra /Quercus borealis"/>
		<Summary>
			<OriginalArea text="Severní Amerika, po celém kontinentu"/>
			<SecondaryArea text="Evropa, Asie"/>
			<Introduction text="Hospodářská a okrasná dřevina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Zdroj – Enviweb"
		/>
		<TextBlock>
			<p>Opadavý strom, okolo 30 m vysoký, v zápoji úzkého habitu. Borka je šedavá, na rozdíl od našich původních druhů méně rozbrázděná. Listy jsou 10–25 cm dlouhé a asi 10 cm široké, při bázi klínovitě zúžené, vpředu úzce zašpičatělé, se 4-6 šikmo odstálými laloky. Laloky jsou zakončeny výraznými osinkatými špičkami, které jsou až 3 mm dlouhé. Na podzim se barví listí červeně, odtud také vzešlo jméno druhu. Tento jev je zřetelný pouze u mladších stromů, v pozdějším věku je podzimní zbarvení listů spíše nažloutlé až hnědavé. Žaludy jsou skoro stejně široké jako dlouhé, kulaté, dozrávají druhým rokem. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh je často pěstován jako hospodářská dřevina. Vyznačuje se vysokou plodností, snadnou klíčivostí semen a poměrně vysokou mírou přežívání semenáčů. Je tolerantní k exhalacím a snáší vyšší zastínění než naše původní duby. Díky své snadné šiřitelnosti je nebezpečný zejména v lesních porostech v nižších a středních polohách, kde vytlačuje původní druhy lesního porostu, a to i ve značných vzdálenostech od mateřského porostu. Druh by měl být eliminován v rámci lesních hospodářských plánů. Dub červený je schopen zmlazení z pařezů, proto by měly být vykácené plochy monitorovány, případně ošetřeny herbicidem.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="kácení"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Dyderski, M. K., & Jagodziński, A. M. (2019). Seedling survival of Prunus serotina Ehrh., Quercus rubra L. and Robinia pseudoacacia L. in temperate forests of Western Poland. Forest Ecology and Management, 450, 117498. <a href="https://doi.org/10.1016/j.foreco.2019.117498" target="_blank">https://doi.org/10.1016/j.foreco.2019.117498</a></Resource>
			<Resource>Hejný S., Slavík B. 1990. Květena České republiky. Svazek 2. Praha, Academia: 544 s.</Resource>
			<Resource>Miltner S., Kupka I. 2016. Silvicultural potential of northern red oak and its regeneration – Review. Journal of Forest Science, 62: 145–152.</Resource>
			<Resource><a href="http://www.botany.cz" target="_blank">www.botany.cz</a>; 2007-2019</Resource>
			<Resource><a href="http://www.pladias.cz" target="_blank">www.pladias.cz</a>; 2014-2019</Resource>
		</Resources>
	</div>
);

export default DubCerveny;
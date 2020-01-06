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

import image from "../../../assets/caseDetails/rak-signalni.jpg";

const RakSignalni = props => (
	<div>
		<Title name="Rak signální" nameSynonyms="" latinName="Pacifastacus leniusculus" latinNameSynonyms="Astacus klamathensis/Astacus leniusculus/Astacus oreganus/Astacus trowbridgii"/>
		<Summary>
			<OriginalArea text="Západní část Severní Ameriky"/>
			<SecondaryArea text="Západní a střední Evropa, Skandinávie, Británie"/>
			<Introduction text="Dříve záměrně vypouštěn, občas vypuštěn, když je zaměněn za raka říčního"/>
			<Breeding text="Ojediněle se chová v akváriích, jedná se o jedince odchycené v přírodě"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Andreas Eichler"
		/>
		<TextBlock>
			<p>Samci dorůstají až 160 mm v délce těla, samice jen 120 mm. Výjimečně se v populaci vyskytují až 200 mm velcí jedinci. Jedná se o druh velice podobný rakovi říčnímu (<i>Astacus astacus</i>). Hlavohruď je robustní, na hlavě jsou dva páry postorbitálních lišt, klepeta jsou mohutná a široká, na spodní straně sytě červená. U kloubu prstů klepeta je bílá až světle modrá skvrna. Tato skvrna může být ale nezřetelná, proto by neměla být jediným determinačním znakem. Od podobného raka říčního (<i>Astacus astacus</i>) tento druh odlišuje především hladký povrch klepet.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Osidluje malé i větší potoky, řeky, tůně, rybníky a jezera. Ve dně a březích si buduje nory. Je poměrně tolerantní ke kvalitě vody a snáší i vyšší teploty. Ve vlhkých norách vydrží i poměrně dlouho bez vody. Jedná se o všežravce konzumujícího mimo jiné i detrit. Pohlavně dospívá ve druhém až třetím roce života. Po páření na podzim klade samice v jedné snůšce až 400 vajec, z nichž se mláďata líhnou další rok na jaře. Dožívá se až 20 let. Je přenašečem infekčního račího moru. Jedná se o oblíbený konzumní druh.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Filipova, L., Petrusek, A., Matasova, K., Delaunay, C., & Grandjean, F. (2013). Prevalence of the crayfish plague pathogen <i>Aphanomyces astaci</i> in populations of the signal crayfish <i>Pacifastacus leniusculus</i> in France: evaluating the threat to native crayfish. PLoS One, 8(7), e70157.</Resource>
			<Resource>Harvey, G. L., Moorhouse, T. P., Clifford, N. J., Henshaw, A. J., Johnson, M. F., Macdonald, D. W., ... & Rice, S. P. (2011). Evaluating the role of invasive aquatic species as drivers of fine sediment-related river management problems: the case of the signal crayfish (<i>Pacifastacus leniusculus</i>). Progress in Physical Geography, 35(4), 517-533.</Resource>
			<Resource>Mathers, K. L., Chadd, R. P., Dunbar, M. J., Extence, C. A., Reeds, J., Rice, S. P., & Wood, P. J. (2016). The long-term effects of invasive signal crayfish (<i>Pacifastacus leniusculus</i>) on instream macroinvertebrate communities. Science of the Total Environment, 556, 207-218.</Resource>
			<Resource>Kouba, A., Petrusek, A., & Kozák, P. (2014). Continental-wide distribution of crayfish species in Europe: update and maps. Knowledge and Management of Aquatic Ecosystems, 413, 05.</Resource>
			<Resource>Patoka, J., Kalous, L., & Kopecký, O. (2014). Risk assessment of the crayfish pet trade based on data from the Czech Republic. Biological Invasions, 16(12), 2489-2494.</Resource>
		</Resources>
	</div>
);

export default RakSignalni;
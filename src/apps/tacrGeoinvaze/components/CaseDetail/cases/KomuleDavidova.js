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

import image from "../../../assets/caseDetails/komule-davidova.jpg";

const KomuleDavidova = props => (
	<div>
		<Title name="Komule Davidova" nameSynonyms="" latinName="Buddleja davidii" latinNameSynonyms="Buddleja shaanxiensis, Buddleja shimidzuana, Buddleja striata, Buddleja variabilis"/>
		<Summary>
			<OriginalArea text="Čína"/>
			<SecondaryArea text="Evropa (invazní), Severní Amerika (invazní), Austrálie a Nový Zéland"/>
			<Introduction text="Pěstování jako okrasná"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Kateřina Berchová-Bímová"
		/>
		<TextBlock>
			<p>Komule Davidova je 3 až 5 m vysoký keř. Listy jsou vstřícné, krátce řapíkaté, vejčitě kopinaté, pilovité a na rubu jemně plstnaté. Dosahují délky 15 až 25 cm. Hrozny vonných květů 10 až 25 cm dlouhé vyrůstají z letorostů. Botanické druhy mají lila fialovou barvu květů, kultivary od bílé po tmavě fialovou. Keř kvete od července do října. Plodem je tobolka. V našich podmínkách je citlivá na mráz.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>V původním areálu roste na horských křovinatých svazích, v pásmu od 800 do 3000 m n. m. Vyžaduje tedy přiměřeně vlhkou, propustnou půdu.  Ve střední Evropě ho najdeme na říčních štěrkopískových náplavech. Dřevina se používá zejména jako okrasná pro své květy, které lákají svou vůní hmyz, především motýly (v noci lišaje).</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={2}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="neprovádí se"/>
			<ManagementApplication text="neprovádí se"/>
		</InvasivePotential>
		<Resources>
			<Resource>Slavík B., Chrtek J. jun. & Štěpánková J. (eds), Květena České republiky 6, p. 289–290, Academia </Resource>
			<Resource>MLÍKOVSKÝ J, STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default KomuleDavidova;
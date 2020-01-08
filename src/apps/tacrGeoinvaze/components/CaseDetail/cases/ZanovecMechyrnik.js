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

import image from "../../../assets/caseDetails/zanovec-mechyrnik.jpg";
import image2 from "../../../assets/caseDetails/zanovec-mechyrnik-2.jpg";

const ZanovecMechyrnik = props => (
	<div>
		<Title name="Žanovec měchýřník" nameSynonyms="" latinName="Colutea arborescens" latinNameSynonyms="Colutea hirsuta/Colutea florida"/>
		<Summary>
			<OriginalArea text="Jižní Evropa, severní Afrika"/>
			<SecondaryArea text="Jižní Amerika"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
		/>
		<CaseImage
			source={image2}
		/>
		<TextBlock>
			<p>Žanovec měchýřník (Bladder-senna) je 1–5 metrů vysoký, hustě větvený opadavý keř, jeho listy jsou lichozpeřené, se 3–6 páry eliptických, okrouhlých nebo obvejčitých lístků, květy v chudokvětých hroznech, kalich zvonkovitý, krátce chlupatý, koruna žlutá, pavéza často s červenými žilkami. Plodem je nicí, nápadně nafouklý lusk. Rostlina je jedovatá. Kvete od května do srpna. Semena jsou pro člověka i lidi jedovatá.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Tento keř je u nás vysazován jako okrasná dřevina v zahradách a parcích, odkud zplaňuje, občas je vysazován i přímo do volné přírody. Najdeme ho na slunných stanovištích. Ponejvíce se s ním u nás setkáme v nejteplejších oblastech, především na jižní Moravě.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="nejsou"/>
			<ManagementApplication text="není"/>
		</InvasivePotential>
		<Resources>
			<Resource>SLAVÍK B., ŠTĚPÁNKOVÁ J. & ŠTĚPÁNEK J. (eds), Květena České republiky 7, p. 114–123, Academia, Praha</Resource>
			<Resource>MLÍKOVSKÝ J, STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóryČeské republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default ZanovecMechyrnik;
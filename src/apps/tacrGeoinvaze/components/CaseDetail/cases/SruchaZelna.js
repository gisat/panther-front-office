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

import image from "../../../assets/caseDetails/srucha-zelna.jpg";

const SruchaZelna = props => (
	<div>
		<Title name="Šrucha zelná" nameSynonyms="šrucha obecná" latinName="Portulaca oleracea" latinNameSynonyms="Portulaca neglecta/Portulaca retusa"/>
		<Summary>
			<OriginalArea text="Jižní Asie, či severní Afrika, Středomoří"/>
			<SecondaryArea text="Evropa, tropy a subtropy"/>
			<Introduction text="Plevel"/>
			<Breeding text="Ojediněle"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Šrucha zelná je jednoletá bylina, která má většinou poléhavé lodyhy dorůstající délky až 30 cm. Lodyhy jsou často červeně zbarvené. Dužnaté listy mají obvejčité až úzce obvejčitý tvar. Květe v červnu až říjnu nenápadně, okvětní lístky zbarveny do žluta a jsou dlouhé 6–8 mm. Plodem je elipsoidní tobolka.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Šrucha roste na slunných a sušších synantropních stanovištích, jako jsou návsi, okraje cest, pole, vinice, zahrádky, nádraží, paty domů atd. Hlavně tedy na sušších, lehkých půdách. V teplých oblastech se pěstuje šrucha zelná setá (<i>Portulaca oleracea ssp. sativa</i>) neboli tzv. portulák jako zelenina a polévkové koření. U nás roste roztroušeně především v nížinách a pahorkatinách.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="nejsou"/>
			<ManagementApplication text="není"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J., STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóryČeské republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK, B. (editor); ŠTĚPÁNKOVÁ, J. (editor). <i>Květena České republiky</i> 7. Praha: Academia, 2004. </Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default SruchaZelna;
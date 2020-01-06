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

import image from "../../../assets/caseDetails/kustovnice-cizi.png";

const KustovniceCizi = props => (
	<div>
		<Title name="Kustovnice cizí" nameSynonyms="kustovnice kosníkolistá" latinName="Lycium barbarum" latinNameSynonyms="Lycium halimifolium/Lycium lanceolatum/Lycium vulgare"/>
		<Summary>
			<OriginalArea text="Středomoří, teplejší oblasti Sibiře, Střední Asii, Mongolsko a severozápadní Čínu, zde pouze provincii Ningxia (Ning-sia, Chuejská autonomní oblast). Protože se jedná o dlouho pěstovanou kulturní rostlinu, je její původní areál nejistý."/>
			<SecondaryArea text="Ve střední Evropě zplanělý, Severní Amerika, severní Afrika, Patagonie"/>
			<Introduction text="Pěstování jako okrasná a údajně dobrá medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Kustovnice cizí (matrimony vine) je opadavý samosprašný keř až polokeř dorůstající výšky 1-3 m.  Má obloukovitě prohnuté větve. Listy jsou jednoduché střídavé, sivé, variabilního tvaru. Kvete od května do září růžově fialovými květy. Kalich má dva cípy, dosahuje minimálně do 2/3 délky korunní trubky. Tyčinky jsou na bázi chlupaté. Plodem jsou oranžové vejcovité bobule.  Celá rostlina je slabě až středně jedovatá.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Kustovnice cizí roste na slunných stanovištích, na suchých, alkalických půdách, tedy na neudržovaných svazích, náspech, na rumištích, hrázích, kolem silni a železnic. Vyskytuje se zejména v okolí měst a v teplejších oblastech. Na našem zemí byl poprvé doložen v roce 1785, kdy se pěstoval jako okrasný keř.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="neprobíhá"/>
			<ManagementApplication text="neprobíhá"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J, STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóryČeské republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK, Bohumil. Květena ČR, díl 6. Praha: Academia, 2000. 770 s.</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default KustovniceCizi;
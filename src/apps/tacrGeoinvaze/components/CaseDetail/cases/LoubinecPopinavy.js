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

import image from "../../../assets/caseDetails/loubinec-popinavy.jpg";
import image2 from "../../../assets/caseDetails/loubinec-popinavy-2.jpg";

const LoubinecPopinavy = props => (
	<div>
		<Title name="Loubinec popínavý" nameSynonyms="přísavník křovištní/psí víno" latinName="Parthenocissus inserta" latinNameSynonyms={<>Parthenocitis inserta/Ampelopsis inserta/Parthenocissus quinquefolia/Ampelopsis quinquefolia <em>var.</em> vitacea/Parthenocissus vitacea/Vitis inserta/Parthenocissus inserta/Parthenocissus quinquefolia/Vitis vitacea/Parthenocissus quinquefolia <em>var.</em> vitacea/Psedera vitacea</>}/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="střední Evropa, Asie (invazní), Austrálie"/>
			<Introduction text="pěstování jako okrasná rostlina"/>
			<Breeding text="ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<br/>
		<CaseImage
			source={image2}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Loubinec popínavý (Thicket creeper, False virginia creeper, Woodbine nebo Grape woodbine) je dřevitá liána, 4 až 15 metrů dlouhá. –20(–30) m dlouhá, listy řapíkaté, dlanitě složené, řapíkaté listy se zubatými okraji jsou zelené, na podzim se zbarvují dočervena. Úponky mají 3–5 ramen bez přísavných destiček. Liána kvete v červnu až červenci drobnými, žlutavě zeleně. Plodem je modročerná, obvykle ojíněná bobule. Možná je záměna s přísavníkem pětilistým (<i>Parthenocissus quinquefolia</i> (L.) Planch.), který je u nás méně častý. Druhy se odlišují úponky, mladými zelenými větvemi, pupeny a plody. Přísavník popínavý nemá přísavné destičky, mladé větve jsou zelené, plody jsou ojíněné. Přísavník popínavý nedokáže šplhat po zdech bez opory, je tedy potřeba ho v mládí vyvazovat. Naproti tomu přísavník pětilistý má úponky s 5–8 rameny s přísavnými destičkami, mladé větve a pupeny jsou načervenalé, plody neojíněné.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Ve své domovině roste v křovinách, lesních lemech (dubiny) a světlinách, v lužních lesích, zplaňuje (zhruba od 20. století) v blízkosti lidských sídel a zahrad, podél plotů, kolem cest a železničních tratí, na rumištích a skládkách.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="nejsou"/>
			<ManagementApplication text="není"/>
		</InvasivePotential>
		<Resources>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK B., ŠTĚPÁNKOVÁ J. & ŠTĚPÁNEK J. (eds), Květena České republiky 7, p. 114–123, Academia, Praha</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default LoubinecPopinavy;
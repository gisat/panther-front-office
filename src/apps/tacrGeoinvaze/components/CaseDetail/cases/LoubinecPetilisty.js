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

import image from "../../../assets/caseDetails/loubinec-petilisty.jpg";

const LoubinecPetilisty = props => (
	<div>
		<Title name="Loubinec pětilistý" nameSynonyms="loubinec břečtanový/réva planá/loubinec/divoké víno/loubinec pětilistý/loubinec psí víno/přísavník pětilistý/loubinec pětilistý/přísavník pětilistý/psí víno/loubinec pětilistý/loubinec pýřitý" latinName="Parthenocissus quinquefolia" latinNameSynonyms="Ampelocissus cirrhata/Ampelopsis hederacea/Ampelopsis latifolia/Ampelopsis pubescens/Ampelopsis quinquefolia/Ampelopsis quinquefolia var. angustifolia/Cissus quinquefolia/Hedera quinquefolia/Hedera carnosa/ Parthenocissus hirsuta/Parthenocissus pubescens/Psedera quinquefolia/Parthenocissus quinquefolia/Quinaria quinquefolia/Vitis quinquefolia"/>
		<Summary>
			<OriginalArea text="východní část Severní Ameriky"/>
			<SecondaryArea text="Evropa (invazní), Asie (invazní), Austrálie"/>
			<Introduction text="pěstování jako okrasná rostlina (introdukce do Evropy 1622, v ČR vysazen prvně v Praze v roce 1835"/>
			<Breeding text="ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Loubinec pětilistý (Virginia creeper, Engelman Ivy) je dřevitá liána se vzdušnými kořeny může pnout 5 až 30 m vysoko. Letorosty jsou načervenalé, úponky s 5–8 rameny jsou zakončené přísavkami. Listy jsou střídavé, řapíkaté, dlanitě pětičetné, lístky jsou eliptické až vejčité, až 10 cm dlouhé, na okraji pilovité nebo i celokrajné, špičaté, na líci zelené, matné, na rubu sivé. Na podzim se listy zbarvují do červených odstínů. Květy jsou uspořádány v latách, jsou drobné, 5četné, koruny mají asi 3 mm v průměru. Žlutavě zelené korunní lístky jsou nazpět odstálé. Rostlina kvete od července do září. Plodem jsou zhruba 1 cm kulovité, modré až modročerné, obvykle neojíněné a slabě jedovaté bobule. Pro ptáky bobule jedovaté nejsou a jsou tedy zdrojem potravy. U citlivějších jedinců může dojít k podráždění kůže při dotyku s listy.</p>
			<p>Přísavník pětilistý lze zaměnit s přísavníkem popínavým (<i>Parthenocissus inserta</i>), který se odlišuje především úponky - těch je méně (3 až 5) a nejsou zakončeny přísavnými destičkami.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Ve svém původním areál roste v křovinách, lesních lemech a ve světlých lesích, v roklích i na skalách. V Evropě je oblíbený kvůli dekorativnímu zbarvování listů na podzim a proto je vysazován v parcích, zahradách, podél zdí a plotů, protihlukových stěn apod., k zakrytí nevzhledných míst. Jako zplanělý ho najdeme především v blízkosti lidských sídel, parků, hřbitovů, na rumištích a je zaznamenán v okolí řady větších měst v ČR.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="nejsou"/>
			<ManagementApplication text="není"/>
		</InvasivePotential>
		<Resources>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK, Bohumil (editor). Květena České republiky 5. Praha: Academia, 1997</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default LoubinecPetilisty;
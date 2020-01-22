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

import image from "../../../assets/caseDetails/netykavka-zlaznata.jpg";

const NetykavkaZlaznata = props => (
	<div>
		<Title name="Netýkavka žláznatá" nameSynonyms="Netýkavka Royleova" latinName="Impatiens glandulifera" latinNameSynonyms="Impatiens roylei"/>
		<Summary>
			<OriginalArea text="oblast západního Himaláje"/>
			<SecondaryArea text="Evropa, Severní Amerika, Jižní Amerika, Mikronésie, Asie, Nový Zéland"/>
			<Introduction text="Pěstování jako okrasná, užitková a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Petra Kubíková"
		/>
		<TextBlock>
			<p>Netýkavka žláznatá je jednoletá statná bylina dorůstající až 3 m výšky. Lodyha je lysá, dutá, v dolní části až 5 cm široká. Lodyžní listy jsou vstřícné, nebo v trojčetných přeslenech v horní části lodyhy, v dolní pak střídavé, kopinaté, ostře pilovité, lesklé. Na bázi listu se nacházejí výrazné žlázky. Květy uspořádané v hroznu jsou oproti ostatním netýkavkám velké (až 4 cm), ve všech odstínech nachové, někdy bílé, vonící těžkou sladkou vůní. Semena jsou po 5 až 10 ve tobolkách až 30 mm dlouhých. Vyzrálé tobolky pukají, a vystřelují tak semena na vzdálenost až 5m od mateřské rostliny.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jde o polostinný druh, rostoucí zejména na vlhkých stanovištích na živinami bohatých půdách – podél vodních toků, v nivách řek, lužních lesích, v polních mokřadech a okrajích polí. Někdy se též vyskytuje na rumištích a opuštěných antropogenních plochách. Jde o druh konkurenčně velmi silný, šířící se na rozsáhlá území. Zejména vodní toky působí jako silný vektor šíření plovavých semen. Semena klíčí většinou následující sezónu a nejsou přeléhavá. Z hlediska vlivu invaze na invadované biotopy nebyl zaznamenán výrazný negativní dopad kromě vysoké kompetice a zástinu ostatních druhů. Druh je často předmětem ochranářského managementu, jehož dopad je ovšem vzhledem k rozsahu invaze v ČR sporný. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="Aplikace herbicidu, kosení, vytrhávání"/>
			<ManagementApplication text="Lokálně v ZCHÚ, sporné výsledky"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J., STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK, B. (editor); ŠTĚPÁNKOVÁ, J. (editor). Květena České republiky 7. Praha: Academia, 2004. </Resource>
			<Resource>STALMACHOVÁ, B. a kol. (2019). Strategie řešení invazních druhů rostlin v obcích česko-polského pohraničí. IMAGE STUDIO s.r.o., Slezská Ostrava.</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default NetykavkaZlaznata;
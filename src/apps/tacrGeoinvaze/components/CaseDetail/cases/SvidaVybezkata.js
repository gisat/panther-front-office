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

import image from "../../../assets/caseDetails/svida-vybezkata.jpg";
import image2 from "../../../assets/caseDetails/svida-vybezkata-2.jpg";

const SvidaVybezkata = props => (
	<div>
		<Title name="Svída výběžkatá" nameSynonyms="" latinName="Cornus sericea" latinNameSynonyms="Cornus alba/Cornus alba subsp. stolonifera/Cornus sericea subsp. stolonifera/Cornus stolonifera/Swida stolonifera/Swida sericea"/>
		<Summary>
			<OriginalArea text="Severní Amerika - od Aljašky po Kalifornii"/>
			<SecondaryArea text="Severní Amerika, Mexiko, Evropa (zejména v severní Evropě invazní)"/>
			<Introduction text="Pěstování jako okrasná rostlina"/>
			<Breeding text="Ne"/>
		</Summary>
		<CaseImage
			source={image}
		/>
		<CaseImage
			source={image2}
		/>
		<TextBlock>
			<p>Svída výběžkatá (Redosier dogwood) je rozložitý keř vysoký 1–2,5 m. Jeho větve jsou dlouhé, pružné, převislé, ve spodní části často poléhavé. Letorosty jsou nachově červené, starší větve šedavě zelené. Listy dlouhé až 13 cm, široké 7 cm jsou vstřícné, řapíkaté, kopinaté až úzce vejčité, na bázi klínovité, na vrcholu zašpičatělé. Na jejich rubu mají zřetelně sivé až bělavé zbarvení. Květenství je ploché vrcholičnaté, velké až 6 cm v průměru. Kališní zuby jsou ostře trojúhelníkovité, korunní lístky bílé až nažloutlé. Keř kvete od května do září. Plodem je kulovitá peckovice, bílá až namodralá.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>V původním areálu osidluje svída výběžkatá stanoviště podél vodních toků, v lužních lesích a křovinách. V evropských podmínkách zplaňuje ze zahrad a parků, kam je vysazován jako okrasná zeleň zejména kvůli červeně zbarveným větvím v zimním období. Bývá vysazován i do zeleně sídlištní a podél komunikací. Výskyt ve volné krajině je poměrně vzácný. Druh se šíří semeny a vegetativně.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="odstraňování biomasy"/>
			<ManagementApplication text="řídká"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J., STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóryČeské republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK, B. (editor); ŠTĚPÁNKOVÁ, J. (editor). <i>Květena České republiky</i> 7. Praha: Academia, 2004. </Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default SvidaVybezkata;
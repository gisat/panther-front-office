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

import image from "../../../assets/caseDetails/ambrozie-perenolista.jpg";

const AmbroziePerenolista = props => (
	<div>
		<Title name="Ambrozie peřenolistá" nameSynonyms="" latinName="Ambrosia artemisiifolia" latinNameSynonyms={
			<>Ambrosia elatior <em>v. artemisifolia (L.) Farw.</em></>
		}/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="Evropa (invazní), Afrika, Austrálie a Nový Zéland, Tichomoří"/>
			<Introduction text="Neúmyslně s obilím a sójovými boby"/>
			<Breeding text="Není"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Ambrozie peřenolistá je jednodomá, větrosprašná, jednoletá rostlina z čeledi hvězdnicovitých, osidlující ruderální a segetální stanoviště. Výška rostliny se pohybuje od 20 cm do 1,5 m v závislosti na stanovištních podmínkách. Habitus rostliny je poměrně variabilní, lodyha je přímá nevětvená nebo větvená, na průřezu kulatá nebo oble hranatá, chlupatá či plstnatá. Listy ambrosie jsou peřenosečné, v dolní části lodyhy vstřícné, nahoře střídavé, peřenosečné. Květenství jsou tvořena samčími a samičími úbory. Samičí úbory rostou z paždí lodyžních listů, žluté samčí úbory pak na jednotlivých větvích. Rostliny jsou cizosprašné, semena jsou hnědé nažky. Semena mají velmi vysokou schopnost dormance a v půdě mohou životaschopná přeléhat až 40 let. Dormance je přerušována zimními mrazy.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se rozmnožuje výhradně semeny, která se šíří zejména v okolí mateřských rostlin. Limitujícím faktorem růstu rostlin je teplota, kdy semenáče jsou citlivé na jarní mrazy a podzimní mrazy ukončí růst dospělých rostlin. V České Republice byla poprvé zaznamenána na Moravě, v současné době vytváří v teplejších oblastech populace spíše nestálého charakteru (zejména v Polabí). Výskyt je omezen na termofytikum. Nebezpečnost rostliny (druh je uveden na Evropském seznamu invazních nepůvodních druhů) spočívá v produkci obrovského množství silně alergenního pylu. V ČR zatím není druh problematický, nicméně s měnícím se klimatem je možné očekávat jeho šíření mimo termofytikum.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="aplikace herbicidu"/>
			<ManagementApplication text="v polních kulturách"/>
		</InvasivePotential>
		<Resources>
			<Resource>Essl F., Biro K., Brandes D., Broennimann O., Bullock J. M., Chapman D. S., Chauvel B., Dullinger S.,Fumanal B., Guisan A., Karrer G., Kazinczi G., Kueffer C., Laitung B., Lavoie C., Leitner M., Mang T.,Moser D., Muller-Scharer H., Petitpierre B., Richter R., Schaffner U., Smith M., Starfinger U., Vautard R.,Vogl G., von der Lippe M. & Follak S. (2015): Biological flora of the British Isles: <i>Ambrosia artemisiifolia</i>. – J. Ecol. 103: 1069–1098.</Resource>
			<Resource>Skálová H., Guo W-Y., Wild J. & Pyšek P. (2017): <i>Ambrosia artemisiifolia</i> in the Czech Republic: history of invasion,current distribution and prediction of future spread – Preslia 89: 1–16. </Resource>
			<Resource><a href="http://www.botany.cz" target="_blank">www.botany.cz</a>; 2007-2019</Resource>
		</Resources>
	</div>
);

export default AmbroziePerenolista;
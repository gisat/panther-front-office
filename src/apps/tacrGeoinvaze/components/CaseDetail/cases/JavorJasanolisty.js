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

import image from "../../../assets/caseDetails/javor-jasanolisty.jpg";

const JavorJasanolisty = props => (
	<div>
		<Title name="Javor jasanolistý" nameSynonyms="pájavec jasanolistý " latinName="Acer negundo" latinNameSynonyms="Acer californicum var. texanum/Acer fauriei/Acer fraxinifolium/Acer fraxinifolium/Acer lobatum /Acer nuttallii/Acer trifoliatum/Acer violaceum/Negundo aceroides var. violaceum/Negundo aceroides subsp. violaceus /Negundo fraxinifolium var. crispum/Negundo fraxinifolium var. violaceum/Negundo negundo/Negundo texanum/Rulac negundo"/>
		<Summary>
			<OriginalArea text="Severní Amerika, po celém kontinentu"/>
			<SecondaryArea text="Jižní Amerika, Evropa, Asie"/>
			<Introduction text="Okrasná dřevina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Zdroj wikimedia"
		/>
		<TextBlock>
			<p>Javor jasanolistý je 10-20 (maximálně 25) m vysoký strom nízkým rozložitým habitem a řídkou mezernatou korunou. Borka kmene je mělce podélně zbrázděná, letorosty šedé až šedozelené, ojíněné. Listy jsou vstřícné, asi 7–15 cm dlouhé, lichozpeřené složené z 5-7 krátce řapíkatých lístků. Lístky jsou zašpičatělé, po obvodu nepravidelně ostře zubaté (někdy téměř celokrajné), světle zelené barvy. Listová plocha je velmi tenká, proto listy působí převislým dojmem. Kvete před olistění nebo současně s rašícími lístky, plodem je nažka. Typický pro javorovec je ostrý úhel, který svírají křídla nažek. Plody tvoří výrazné hrozny světle hnědé barvy. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Javor jasanolistý je běžně pěstován v parcích a alejích, odkud velmi často zplaňuje na neudržované a opuštěné plochy (např. nehospodařená pole a louky). Zde pak vytváří husté porosty mladých jedinců. Je nadán vysokou mírou kořenové a kmenové výmladnosti. Vzhledem k tomu že jde o krátkověkou dřevinu, kvete v nízkém věku (okolo 10 let) a vytváří ohromné množství snadno šiřitelných nažek s vysokou mírou klíčivosti. Ve volné přírodě roste kromě opuštěných ploch také na okraji lesních porostů v nižších až středních polohách. Invazně se chová v lužních lesích, kde vytváří husté až neproniknutelné nižší stromové patro, zejména v jaseninách a tvrdých luzích. Díky výmladnosti je schopen vysoké míry regenerace. V přírodních biotopech lze považovat za velmi nebezpečný invazní druh.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="kácení, aplikace herbicidu"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Hejný S (1997) Květena České Republiky. Academia, Praha.</Resource>
			<Resource>Kubát, K., Hrouda, L., Chrtek, J. jun., Kaplan, Z., Kirschner, J., Štěpánek J (ed) (2002) Klíč ke květeně České republiky. Academia.</Resource>
			<Resource><a href="http://www.botany.cz" target="_blank">www.botany.cz</a>; 2007-2019</Resource>
			<Resource><a href="http://www.pladias.cz" target="_blank">www.pladias.cz</a>; 2014-2019</Resource>
			<Resource><a href="https://plants.usda.gov" target="_blank">https://plants.usda.gov</a> 2019</Resource>
		</Resources>
	</div>
);

export default JavorJasanolisty;
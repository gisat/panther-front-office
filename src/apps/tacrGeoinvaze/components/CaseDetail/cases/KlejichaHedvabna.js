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

import image from "../../../assets/caseDetails/klejicha-hedvabna.jpg";

const KlejichaHedvabna = props => (
	<div>
		<Title name="Klejicha hedvábná" nameSynonyms="klejicha vatočník" latinName="Asclepias syriaca" latinNameSynonyms="Asclepias tomentosum/Asclepias cornuti"/>
		<Summary>
			<OriginalArea text="Východní Severní Ameriky"/>
			<SecondaryArea text="Evropa; všude, kde je pěstována"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Paša Pokorná"
		/>
		<TextBlock>
			<p>Klejicha hedvábná je jedovatá bylina, která po poranění silně roní bílou šťávu. Má dlouhý, plazivý a dužnatý oddenek tlustý 2—3cm.  Jedná se o 1 až 2 metry vysokou bylinu s přímým, nevětveným hustě chlupatým stonkem s centrální dutinou. Listy jsou vstřícné, tmavozelené na líci, šedozelené na rubu. Rostlina kvete v červnu až srpnu nafialovělými 5četnými květy se složitou stavbou, uspořádaných v úžlabní lichookolík. Plodem je podlouhle vejčitý měchýřek s množstvím semen. Semena mají nápadný bílý chmýr. Oddenek obsahuje mezi jinými toxický glykosid asclepiadin.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o vytrvalou teplomilnou rostlinu, která zplaňuje na železničních náspech, v příkopech, někde už i v polních kulturách. Občas je pěstována v zahrádkách pro její nápadnou vůni. Rozmnožuje se generativně, ale zejména vegetativně oddenky. Roste na půdách lehkých a vysýchavých. Vážné problémy působí v teplejších oblastech, např. v Maďarsku, kde invaduje přírodní biotopy písčin a je velmi obtížně odstranitelná.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="neprobíhá (v ČR)"/>
			<ManagementApplication text="neprobíhá (v ČR)"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J., STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>Slavík B., Chrtek J. jun. & Štěpánková J. (eds), Květena České republiky 6, p. 66–69, Academia, Praha. </Resource>
			<Resource>Herba. Atlas plevelů. (online) Česká zemědělská univerzita, FAPaPZ, Katedra agroekologie a biometeorologie, Praha . Dostupné z: <a href="http://www.jvsystem.net/app19/Species.aspx?pk=10044&lng_user=1" target="_blank">http://www.jvsystem.net/app19/Species.aspx?pk=10044&lng_user=1</a>  cit. 21.10.2019</Resource>
			<Resource>PLADIAS. (online) dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default KlejichaHedvabna;
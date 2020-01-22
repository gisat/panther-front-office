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

import image from "../../../assets/caseDetails/borovice-vejmutovka.jpg";
import image2 from "../../../assets/caseDetails/borovice-vejmutovka-2.jpg";

const BoroviceVejmutovka = props => (
	<div>
		<Title name="Borovice vejmutovka" nameSynonyms="" latinName="Pinus strobus" latinNameSynonyms="Leucopitys strobus/Pinus chiapensis/Pinus nivea/Strobus weymouthiana/Strobus strobus"/>
		<Summary>
			<OriginalArea text="Severovýchod Severní Ameriky (severovýchodní USA až po jihovýchodní Kanadu)"/>
			<SecondaryArea text="Evropa, Asie, Jižní Amerika"/>
			<Introduction text="Pěstování v lesních porostech a jako okrasná dřevina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: K. Berchová-Bímová"
		/>
		<br/>
		<CaseImage
			source={image2}
			copyright="Foto: K. Berchová-Bímová"
		/>
		<TextBlock>
			<p>Borovice vejmutovka je jehličnatý strom dorůstající přibližně výšky 50 m. Koruna je v mládí kuželovitá, později široká až deštníkovitě rozložená s vodorovně odstálými větvemi. Tento habitus má strom zejména jako soliter. Kmen je přímý, v mládí s hladkou šedozelenou lesklou borkou, později podélně rozbrázděnou, tmavou. Dřevo je měkké s pryskyřičnými kanálky. Jehlice jsou uspořádané po 5 ve svazečcích, velmi měkké a tenké, namodrale zelené, 5–14 cm dlouhé. Šišky úzce válcovité s poměrně dlouho stopkou, až 10 cm dlouhé, v době zralosti světle hnědé, otvíravé. Šupiny šišek klínovité tenké s málo vyniklými štítky. Semena drobná, okolo 5 mm, s dlouhým křídlem. Šišky dozrávají 2. rokem a otvírají se v srpnu až září. Stromy jsou plodné již ve věku dvaceti let, nicméně plně fertilní semena produkují stromy až ve věku 50 let. Jde o poměrně dlouhověký strom, dožívá se 200–450 roků.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Ve Střední Evropě, zejména v Česku a Německu, jde o nejčastěji pěstovaný nepůvodní druh borovice. Je ceněna pro svou nenáročnost a rychlý růst. Dokáže růst na propustných písčitých půdách, není náročná na živiny a je tolerantní k vysokému rozpětí pH půdy. V poslední době je však považována za nežádoucí druh, a to ze dvou důvodů. Jednak zvyšuje škody na porostech napadením rzí vejmutovkovou a poměrně často vykazuje invazní chování potlačující ostatní dřeviny a druhy lesního podrostu. Invazně se chová zejména ve skalních městech (Labské pískovce, Českosaské Švýcarsko, Kokořínsko), kde dokáže konkurovat borovici lesní (<i>Pinus sylvestris</i>) a na některých lokalitách vytváří neproniknutelné porosty. Druh je považován za nebezpečný invazní na pískovcích a měl by být z porostů odstraňován. V ostatních typech biotopů jsou invazní schopnosti nižší, nicméně i tam by měl být odstraňován v rámci lesnických hospodářských plánů.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="mechanické – kácení a vytrhávání"/>
			<ManagementApplication text="lokálně ve zvláště chráněných územích a jejich ochranných pásmech"/>
		</InvasivePotential>
		<Resources>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>Münzbergová Z, Hadincová V, Wild J, Kindlmannová J (2013) Variability in the Contribution of Different Life Stages to Population Growth as a Key Factorin the Invasion Success of <i>Pinus strobus</i>. PLoS ONE 8(2): e56953. doi:10.1371/journal.pone.0056953</Resource>
			<Resource>Mandák B, Hadincová V, Mahelka V, Wildová R (2013) European Invasion of North American Pinus strobusat Large and Fine Scales: High Genetic Diversity and Fine-Scale Genetic Clustering over Time in the Adventive Range. PLoS ONE 8(7): e68514. doi:10.1371/journal.pone.0068514</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default BoroviceVejmutovka;
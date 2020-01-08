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

import image from "../../../assets/caseDetails/zlatobyl-obrovsky.jpg";
import image2 from "../../../assets/caseDetails/zlatobyl-obrovsky-2.jpg";

const ZlatobylObrovsky = props => (
	<div>
		<Title name="Zlatobýl obrovský" nameSynonyms="" latinName="Solidago gigantea" latinNameSynonyms="Solidago ×leiophallax/Solidago gigantea var. leiophylla/Solidago pitcheri/Solidago gigantea var. pitcheri/Solidago serotina /Aster latissimifolius var. serotinus/Solidago gigantea var. serotina/Solidago gigantea subsp. serotina/Solidago serotinoides/Solidago gigantea var. shinnersii"/>
		<Summary>
			<OriginalArea text="Severní Amerika a jižní Kanada"/>
			<SecondaryArea text="Evropa (invazní), východní Asie (invazní), Nový Zéland"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Kateřina Berchová-Bímová"
		/>
		<CaseImage
			source={image2}
			copyright="Foto: Martina Kadlecová"
		/>
		<TextBlock>
			<p>Zlatobýl obrovský (Giant goldenrod) je vytrvalá, přibližně 80 - 2000 cm vysoký bylina z čeledi hvězdnicovitých. Kvete latou drobných žlutých úborů dlouhých 4mm v období od srpna do září a vytváří velké množství nažek. Jednoduchá lodyha je přímá, lysá, s kopinatými střídavě rostoucími  listy s pilovitým okrajem dlouhými 7-18 cm a širokými 1,2 až 3 cm. Jednotlivé lodyhy, ve spodní části načervenalé, jsou pod zemí propojené oddenky, pomocí nich se rostliny poměrně rychle rozrůstají. Na obsazených lokalitách vytváří výrazné husté porosty. Od příbuzného druhu zlatobýlu kanadského (Solidago canadensis) se liší tím, že má lysou lodyhu.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Tato bylina roste roztroušeně po celém území ČR. Najdeme ji na rumištích, v blízkosti řek, na neobhospodařovávaných loukách, podél cest, silnic a železnic atp. Vyhledává světlá stanoviště s vyšší půdní vlhkostí, snese i mírné zastínění. Druh se šíří generativně semeny na delší vzdálenosti, ale i vegetativně plazivými oddenky do blízkého okolí. Na území ČR patří mezi výraznější invazní druhy, které je velmi obtížné vyhubit. Vytváří kompaktní porosty, vytlačující původní druhy vzhledem k vysokým kompetičním schopnostem.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="aplikace herbicidu, kosení, pastva"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J., STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóryČeské republiky. Praha, ČSOP, 495 s. </Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK B., ŠTĚPÁNKOVÁ J. & ŠTĚPÁNEK J. (eds), Květena České republiky 7, p. 114–123, Academia, Praha</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default ZlatobylObrovsky;
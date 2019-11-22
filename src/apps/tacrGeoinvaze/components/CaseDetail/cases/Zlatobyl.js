import React from "react";
import {
	Title,
	TextBlock,
	InvasivePotential,
	Summary,
	SexualReproduction,
	AsexualReproduction,
	EcologicalNiche,
	PopulationDensity,
	EnvironmentImpact,
	ManagementMethod,
	ManagementApplication, OriginalArea, SecondaryArea, Introduction, Breeding, Resource, Resources, CaseImage
} from "../components";
import image from "../../../assets/caseDetails/zlatobyl-kanadsky.png";

const Zlatobyl = props => (
	<div>
		<Title name="Zlatobýl kanadský/Celík kanadský" latinName={
			<>Solidago canadensis/Aster canadensis <em>(L.) Kuntze</em>/Doria canadensis <em>(L.) Lunell</em></>
		}/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="Evropa (invazní), Asie (invazní), Austrálie"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martina Kadlecová"
		/>
		<TextBlock>
			<p>Zlatobýl kanadský je vytrvalá, přibližně 1,5m vysoká, nápadná bylina z čeledi hvězdnicovitých. Kvete latou drobných žlutých květů v období od července do září a vytváří velké množství snadno šiřitelných a dobře klíčích nažek. Lodyha je odspodu olistěná kopinatými, směrem k vrcholu se zmenšujícími listy s pilovitým okrajem. Jednotlivé lodyhy jsou pod zemí propojené oddenky, pomocí nich se rostliny poměrně rychle rozrůstají. Na obsazených lokalitách vytváří výrazné husté porosty. Od příbuzného druhu zlatobýlu obrovského (<i>dago gigantea</i>) se liší přítomností ca 2 mm dlouhých chlupů na lodyze, zejména v její dolní části.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se šíří jak semeny, tak regenerací z oddenků. Osidluje zejména ruderální stanoviště, ale i nekosené louky a úhory, okraje mokřadů, lesní paseky a okolí cest. Velmi snadno se šíří i na světlé okraje lesních porostů, zejména díky transportu těženého dřeva a pohybu lesnické mechanizace. Druh je konkurenčně velmi silný a díky své konkurenceschopnosti vytlačí i kompetičně silné druhy trav. Na území ČR patří mezi nejvýraznější invazní druhy, které je velmi obtížné vyhubit. Negativně reaguje na pravidelné kosení, a tudíž účinnou metodou vedoucí k jeho trvalému odstranění je pravidelná a dlouhodobá péče o pozemky. V současné době invaze ohrožuje okraje mokřadních lokalit, mezofilní louky a okraje rákosin.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="aplikace herbicidu, kosení, pastva"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>

		<Resources>
			<Resource>Kabuce, N. & Priede, N. (2010): NOBANIS – Invasive Alien Species Fact Sheet – Solidago canadensis. – From: Online Database of the European Network on Invasive Alien Species - NOBANIS www.nobanis.org, 26. 10. 2019.</Resource>
			<Resource>MLÍKOVSKÝ J., STÝBLO P., eds., 2006: Nepůvodní druhy fauny a flóry ČR, ČSOP Praha, 496 pp.</Resource>
			<Resource>Weber, E. 1998. The dynamic of plant invasion: a case of three exotic goldenrod species (Solidago L.) in Europe. Journal of Biogeography: 25: 147–154.</Resource>
			<Resource>Weber, E. 2000. Biological flora of Central Europe: Solidago altissima L. Flora: 195, Switzerland, pp. 123–134.</Resource>
		</Resources>
	</div>
);

export default Zlatobyl;
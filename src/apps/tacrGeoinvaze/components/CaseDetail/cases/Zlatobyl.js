import React from "react";
import {Title, TextBlock, InvasivePotential, InvasivePotentialCategory, Summary, SummaryItem} from "../components";

const Zlatobyl = props => (
	<div>
		<Title name="Zlatobýl kanadský/Celík kanadský" latinName="Solidago canadensis/Aster canadensis (L.) Kuntze/Doria canadensis (L.) Lunell"/>
		<Summary>
			<SummaryItem title="Původní areál" text="Severní Amerika"/>
			<SummaryItem title="Sekundární areál" text="Evropa (invazní), Asie (invazní), Austrálie"/>
			<SummaryItem title="Introdukce" text="Pěstování jako okrasná a medonosná rostlina"/>
			<SummaryItem title="Pěstování/Chov" text="Ano"/>
		</Summary>
		<TextBlock>
			<p>Zlatobýl kanadský je vytrvalá, přibližně 1,5m vysoká, nápadná bylina z čeledi hvězdnicovitých. Kvete latou drobných žlutých květů v období od července do září a vytváří velké množství snadno šiřitelných a dobře klíčích nažek. Lodyha je odspodu olistěná kopinatými, směrem k vrcholu se zmenšujícími listy s pilovitým okrajem. Jednotlivé lodyhy jsou pod zemí propojené oddenky, pomocí nich se rostliny poměrně rychle rozrůstají. Na obsazených lokalitách vytváří výrazné husté porosty. Od příbuzného druhu zlatobýlu obrovského (Solidago gigantea) se liší přítomností ca 2 mm dlouhých chlupů na lodyze, zejména v její dolní části.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Druh se šíří jak semeny, tak regenerací z oddenků. Osidluje zejména ruderální stanoviště, ale i nekosené louky a úhory, okraje mokřadů, lesní paseky a okolí cest. Velmi snadno se šíří i na světlé okraje lesních porostů, zejména díky transportu těženého dřeva a pohybu lesnické mechanizace. Druh je konkurenčně velmi silný a díky své konkurenceschopnosti vytlačí i kompetičně silné druhy trav. Na území ČR patří mezi nejvýraznější invazní druhy, které je velmi obtížné vyhubit. Negativně reaguje na pravidelné kosení, a tudíž účinnou metodou vedoucí k jeho trvalému odstranění je pravidelná a dlouhodobá péče o pozemky. V současné době invaze ohrožuje okraje mokřadních lokalit, mezofilní louky a okraje rákosin.</p>
		</TextBlock>
		<InvasivePotential>
			<InvasivePotentialCategory name="Rozmnožování pohlavní" score={3}/>
			<InvasivePotentialCategory name="Rozmnožování nepohlavní" score={3}/>
			<InvasivePotentialCategory name="Ekologická nika" score={3}/>
			<InvasivePotentialCategory name="Hustota populací" score={2}/>
			<InvasivePotentialCategory name="Dopad na životní prostředí" score={1}/>
			<InvasivePotentialCategory name="Management metoda" text="aplikace herbicidu, kosení, pastva"/>
			<InvasivePotentialCategory name="Management aplikace" text="řídká, lokálně"/>
		</InvasivePotential>
	</div>
);

export default Zlatobyl;
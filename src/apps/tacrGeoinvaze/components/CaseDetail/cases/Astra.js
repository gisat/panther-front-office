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

import image from "../../../assets/caseDetails/astra-novobelgicka.jpg"; //TODO change source

const Astra = props => (
	<div>
		<Title name="Astra novobelgická" nameSynonyms="hvězdniček novobelgický (Opiz 1852)/hvězdnice virginská (Dostál 1989)/astřička novobelgická, hvězdnice novobelgická (Danihelka 2012)" latinName="Aster novi-belgii" latinNameSynonyms={
			<>Symphyotrichum novi-belgii <em>(L.) Nesom/</em> Amellus novae-belgii <em>(L.) Opiz/</em>Amellus divaricatus <em>Gaterau/</em>Aster adulterinus <em>Willd./</em>Aster argutus <em>Nees/</em>Aster brumalis <em>Nees/</em>Aster caespitosus <em>Hort. ex Lindl./</em>Aster floribundus <em>Willd./</em>Aster laevigatus <em>Lam./</em> Aster luxurians <em>Spreng./</em>Aster mutabilis <em>Dryand. ex Aiton/</em> Aster onustus <em>Nees/</em> Aster serotinus <em>Willd./</em> Aster spectabilis <em>Willd. nom. illeg./</em> Aster thyrsiflorus<em> Hoffm./</em>Crinitaria humilis <em>Hook.</em></>
		}/>
		<Summary>
			<OriginalArea text="Primární areál se táhne v úzkém, asi 150 km širokém pásmu při Atlantickém pobřeží Severní Ameriky do Apačského pohoří po kanadský poloostrov Labrador a ostrov Newfoundland."/>
			<SecondaryArea text="V 18. století dovezena do střední Evropy. Rovněž ji nalezneme v Anglii. Izolovaně se vyskytuje v Rumunsku. Na našem území pěstována v různých kultivarech jako okrasná rostlina (např. parky, zahrady). Roztroušeně zplaňuje. Maximum výskytu je v okolí velkých měst."/>
			<Introduction text="Vysazována jako okrasná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Vytrvalá, 0,4–1,2(–1,4) m vysoká bylina s podzemními výběžky; lodyhy jsou přímé a lysé. Listy celokrajné až ostře pilovité, jsou střídavé, obkopinaté až eliptické, až 20 cm dlouhé a 4 cm široké, zejména horní přisedlé a oušky na bázi objímající lodyhu. Lodyha v horní části s rozvětveným početným modrým vzácněji bělavým květenstvím až 3 cm velkých úborů, s 3 -4řadým zákrovem, 30–50 jazykovitých květů, terč je žlutý. Plody jsou chlupaté nažky asi 2 mm dlouhé, s 5–6 mm dlouhým chmýrem. Názory na taxonomické uspořádání aster se různí. Druhy jsou šlechtěny do různých kultivarů (včetně metod hybridizace). Poté, co se začaly šířit po Evropě, vznikly komplikace s přiřazením různých odlišných typů k původně popsaným mateřským druhům.</p>
			<p>Možná záměna s další běžně zplaňující astrou – astřičkou kopinatou (<i>Aster lanceolatus, Symphyotrichum lanceolatum</i>), která má zpravidla bělavé nebo světle modré jazykovité květy a neobjímavé horní listy.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o oblíbenou nenáročnou pozdně kvetoucí (srpen až říjen) okrasnou trvalku, nalezneme ji zejména u lidských sídel, odkud opětovně zplaňuje. Tolerantní k mírnému zasolení půdy.  V původním areálu rozšíření obsazuje štěrkovitá místa na mořském pobřeží nebo světlé borové lesy v zázemí dun. V sekundárním areálu zplaňuje hlavně na slunná místa s vlhkou půdu s dostatkem živin (rumniště, ruderální trávníky, lemy lužních lesů, aluviální louky nížinných řek, podél cest a vodních toků). Šíří se generativně (semeny) i vegetativně (podzemními výhony). Prozatím se výrazně nerozrůstá, ale na obsazené lokalitě se udrží po velmi dlouhou dobu. Prioritní je zejména monitoring a likvidace v okolí chráněných území.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="Mechanické metody managementu (malé populace: vytrhávání celých rostlin), případně kombinovat s aplikací herbicidů."/>
			<ManagementApplication text="Lokálně, zejména v okolí chráněných území.  Lze tolerovat v urbánním prostředí, kde nehrozí riziko ohrožení zájmů ochrany přírody."/>
		</InvasivePotential>
		<Resources>
			<Resource>KOVANDA M. et KUBÁT K., 2004: Aster L. – hvězdnice. – In: Slavík B., Štěpánková J. et Štěpánek J. (eds), Květena České republiky 7, p. 125–140, Academia, Praha.</Resource>
			<Resource>PERGL J., PERGLOVÁ I., VÍTKOVÁ M., POCOVÁ L., JANATA T. et ŠÍMA J, 2015: Likvidace vybraných invazních druhů rostlin. Standard péče o přírodu a krajinu, vytvořený pro AOPK ČR, 22 pp.</Resource>
			<Resource>PERGL J., DUŠEK J., HOŠEK M., KNAPP M., SIMON O., BERCHOVÁ K., BOGDAN V., ČERNÁ M., POLÁKOVÁ S., MUSIL J., SÁDLO J. et SVOBODOVÁ J., 2016: Metodiky mapování a monitoringu invazních (vybraných nepůvodních) druhů, 119 pp.</Resource>
			<Resource>BOTANY.cz - <a href="https://botany.cz/cs/symphyotrichum-novi-belgii/" target="_blank">https://botany.cz/cs/symphyotrichum-novi-belgii/</a>, cit 4. 9. 2019</Resource>
			<Resource>PLADIAS – databáze české flóry a vegetace, <a href="https://pladias.cz/taxon/overview/Symphyotrichum%20novi-belgii" target="_blank">https://pladias.cz/taxon/overview/Symphyotrichum%20novi-belgii</a>, cit. 4. 9. 2019</Resource>
		</Resources>
	</div>
);

export default Astra;
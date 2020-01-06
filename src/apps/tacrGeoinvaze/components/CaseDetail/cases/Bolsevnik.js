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

import image from "../../../assets/caseDetails/bolsevnik-velkolepy.jpg";

const Bolsevnik = props => (
	<div>
		<Title name="Bolševník velkolepý" nameSynonyms="" latinName="Heracleum mantegazzianum" latinNameSynonyms="Heracleum speciosum"/>
		<Summary>
			<OriginalArea text="Západní části Kavkazu"/>
			<SecondaryArea text="Česká republika, Irsko, Velká Británie, Skandinávie, Německo, Holandsko, Belgie, Francie, Švýcarsko, Itálie, Rakousko, Slovensko, Maďarsko, část Ruska a Severní Amerika"/>
			<Introduction text="Úmyslně – ve druhé polovině 19. stol. byl přivezen jako okrasná rostlina"/>
			<Breeding text="Není"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Jedná se o dvouletou až vytrvalou bylinu, která je vysoká 1 až 5 m. Lodyha je poměrně tlustá (dolní část v průměru až 10 cm), brázditě žebernatá, štětinatá a červeně skvrnitá. Listy má rostlina až 2 m dlouhé (zejména přízemní), 3četné nebo zpeřené, na spodní straně roztroušeně chlupaté. Koncový lístek je dělen ve 3 ostře špičaté a na okraji pilovité úkrojky, postranní úkrojky jsou peřeně dělené a horní lodyžní listy jsou oproti spodním výrazně menší. Květy jsou uspořádány v mnoha okolících, z nichž jasně dominuje okolík vrcholový, který může mít až 60 cm v průměru a bývá složen z 30 až 100 okolíčků. Obal okolíků je poté složen z 1 až 12 kopinatých až čárkovitých listenů. Květy druhu jsou 5četné, bílé, korunní lístky obvejčité, vnější 2laločné. Kvete od června do září.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Bolševník velkolepý roste na okrajích lesů, vlhkých loukách, v příkopech u silničních koridorů, podél vodních toků, ale také na rumištích, opuštěných a neobhospodařovaných pozemcích či jiných zanedbaných místech. Rostlina může působit silně agresivně na původní vegetaci a má tendence stávat se dominantním druhem, který postupně likviduje původní strukturu společenstva. Na některých lokalitách může vytvářet husté souvislé porosty, kde si tvorbou velkého množství semen zajišťuje úspěšnost nejen pro dané stanoviště, ale také pro další vhodná místa v blízkém okolí. Poměrně velká, avšak lehká semena se šíří nejlépe vodou a mají schopnost klíčení po dobu sedmi let. </p>
			<p>Rostlina obsahuje furanokumariny (bergapten, imperatorin, xanthotoxin, psoralen atd.), které mohou po styku s rostlinou vyvolat na kůži pigmentové skvrny, otoky, puchýře nebo záněty, které se pomalu hojí. Ačkoli se tyto fotoaktivní látky nachází v celé rostlině, nejvíce jich je patrně přítomno v nezralých plodech.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="Aplikace herbicidu, přesekávání kořenů, pastva, kosení."/>
			<ManagementApplication text="Herbicid-mimo ZCHÚ, přesekávání kořenů – malé plochy, pastva a kosení-před kvetením a několikrát za sezonu."/>
		</InvasivePotential>
		<Resources>
			<Resource>Hejný S (1997) Květena České Republiky. Academia, Praha</Resource>
			<Resource>Kubát, K., Hrouda, L., Chrtek, J. jun., Kaplan, Z., Kirschner, J., Štěpánek J (ed) (2002) Klíč ke květeně České republiky. Academia</Resource>
			<Resource>Moravcová L, Pyšek P, Jarošík V, et al (2010) Reproductive characteristics of neophytes in the Czech Republic: Traits of invasive and non-invasive species. Preslia 82:365–390. </Resource>
			<Resource><a href="https://botanika.wendys.cz" target="_blank">botanika.wendys.cz</a></Resource>
			<Resource><a href="https://botany.cz/cs/" target="_blank">botany.cz/cs</a></Resource>
			<Resource><a href="https://pladias.cz/" target="_blank">pladias.cz</a></Resource>
		</Resources>
	</div>
);

export default Bolsevnik;
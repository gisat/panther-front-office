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

import image from "../../../assets/caseDetails/lupina-mnoholista.jpg";

const LupinaMnoholista = props => (
	<div>
		<Title name="Lupina mnoholistá" nameSynonyms="škrkavičník/vlčí bob/vlčí bob mnoholistý" latinName="Lupinus polyphyllus" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Severní Amerika: západní část USA"/>
			<SecondaryArea text="Téměř celá Evropa"/>
			<Introduction text="Vysazována jako okrasná a meliorační rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Johana Vardarman"
		/>
		<TextBlock>
			<p>Vytrvalá, 50—150 cm vysoká bylina.  Lodyha je přímá, listy dlanitě složené, dlouze řapíkaté, 12—15četné, s lístky kopinatými až obkopinatými, nejširšími v polovině až v horní třetině. Květy vyrůstají v 15—40 cm dlouhém hroznu, jsou modré až fialové, zřídka bílé. Květní hrozen až 50—80květý. Plodem je lusk.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o světlomilnou okrasnou trvalku často pěstovanou v mnoha kultivarech. Kvete od června do září. Lupina má schopnost obohacovat půdu dusíkatými sloučeninami. Proto byla dříve vysévána do lesních kultur, zvláště na kyselých půdách pro obohacení půdy dusíkem. Rovněž v minulosti využívána jako pastva pro zvěř. Ojediněle používána ke zpevnění náspů v okolí železničních tratí. Vyskytuje se na mýtinách, okrajích cest a lesů, v lesních světlinách a podél železnic. Snadno kolonizuje travnaté plochy uvolněné narušením drnu. Vyhovují ji kyselé až neutrální půdy, na půdách zásaditých jej nenajdeme. Šíří se semeny. Je sice klonální (mnohohlavý oddenek), ale rozrůstání trsů je plošně velmi omezené. Druh často zplaňuje. Dokáže vytvořit rozsáhlé porosty, které mění půdní poměry (obohacování půdy dusíkem) a konkurencí mění a snižují diverzitu místní vegetace. Celá rostlina je jedovatá. Prioritní je zejména monitoring a likvidace v okolí chráněných území.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={1}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="aplikace herbicidu, kosení, pastva"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>KAPLAN Z., DANIHELKA J., CHRTEK J. JUN., KIRSCHNER J., KUBÁT K., ŠTECH M. et ŠTĚPÁNEK J. (eds), 2019: Klíč ke květeně České republiky [Key to the flora of the Czech Republic]. Ed. 2. – 1168 p., Academia, Praha.</Resource>
			<Resource>PERGL J., PERGLOVÁ I., VÍTKOVÁ M., POCOVÁ L., JANATA T. et ŠÍMA J, 2015: Likvidace vybraných invazních druhů rostlin. Standard péče o přírodu a krajinu, vytvořený pro AOPK ČR, 22 pp.</Resource>
			<Resource>PERGL J., DUŠEK J., HOŠEK M., KNAPP M., SIMON O., BERCHOVÁ K., BOGDAN V., ČERNÁ M., POLÁKOVÁ S., MUSIL J., SÁDLO J. et SVOBODOVÁ J., 2016: Metodiky mapování a monitoringu invazních (vybraných nepůvodních) druhů, 119 pp.</Resource>
			<Resource>TOMŠOVIC P. et BĚLOHLÁVKOVÁ R., 1995: <i>Lupinus</i> L. – lupina. – In: Slavík B., Smejkal M., Dvořáková M. & Grulich V. (eds), Květena České republiky 4, p. 357–360, Academia, Praha.</Resource>
			<Resource><a href="https://pladias.cz/taxon/data/Lupinus%20polyphyllus" target="_blank">PLADIAS – databáze české flóry a vegetace</a>, cit. 11. 10. 2019</Resource>
		</Resources>
	</div>
);

export default LupinaMnoholista;
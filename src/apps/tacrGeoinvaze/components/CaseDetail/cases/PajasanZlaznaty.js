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

import image from "../../../assets/caseDetails/pajasan-zlaznaty.jpg";

const PajasanZlaznaty = props => (
	<div>
		<Title name="Pajasan žláznatý" nameSynonyms="pajasan cizí" latinName="Ailanthus altissima" latinNameSynonyms="Ailanthus cacodendron/A. giraldii/A. glandulosa/A. peregrina/A. procera/A. rhodoptera/A. sutchuensis/A. vilmoriniana/Pongelion cacodendron/P. glandulosum/Rhus cacodendron/R. hypselodendron/R. sinense/R. peregrina/Toxicodendron altissima"/>
		<Summary>
			<OriginalArea text="Východní Asie (oblasti opadavých lesů): severovýchodní a východní Čína a Korea"/>
			<SecondaryArea text="Na území ČR byl patrně dovezen na konci 18. století a vysazen na jižní Moravě v lesních školkách lednického panství Lichtensteinů. Plně ověřený je pak údaj z roku 1865 (Hluboká). Vyskytuje zejména v teplých oblastech s centrem na jižní Moravě a v Polabí. Dále roste např. v Podyjí a jeho okolí. Vzhledem k vysazování pajasanu a jeho dobré schopnosti šíření se očekává invaze do dalších lokalit. V roce 1784 byla evropská semena pajasanu dovezena do Severní Ameriky, rovněž je vysazován v severní Africe, Střední a Jižní Americe, Austrálii a na Novém Zélandě, na tichomořských i atlantických ostrovech. "/>
			<Introduction text="Vysazován jako okrasná dřevina, z výsadeb opětovně zplaňuje"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojík"
		/>
		<TextBlock>
			<p>Pajasan žláznatý je opadavý listnatý strom dorůstající výšky až 25 m, šířky koruny až 30 m a průměru kmene 0,5 m. Kmen je rovný, kůra hladká, šedavá, podélně slabě rozbrázděná. Listy dorůstají až 60 cm a tvarem připomínají jasan. Na rozdíl od něj nesou 1 až 2 zoubky s charakteristickou žlázkou na spodní straně. Po rozedmutí nepříjemně páchnou (myšina). Květy jsou žlutozelené. Plodem je křídlatá podlouhlá nažka se semenem uprostřed (na jednom stromě jich je až milion) 3,5 – 5 cm dlouhá často visící na stromu až do jara. Vzrůstem a tvarem koruny je podobný ořešáku nebo jasanu. Mladé semenáčky lze rovněž zaměnit za škumpu orobincovou (<i>Rhus hirta</i>), která je u nás invazním nepůvodním druhem.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o rychle rostoucí strom. Semenáčky mohou během prvního roku života dorůst až do výšky 2 m. Mladí jedinci jsou náchylní k vymrzání, ale jinak se jedná o nenáročný teplomilný, světlomilný druh. Toleruje široké spektrum půd od písčitých po jílovité, vysychavé i podmáčené. Snáší i znečištěné městské prostředí, zasolení a sucho, proto bývá velmi oblíben při okrasných výsadbách. Rozmnožuje se jak generativním, tak vegetativním způsobem. Kvete v červnu až v 20 cm dlouhých latách. Dvoudomý, samčí květy jsou tvořenými pouze tyčinkami, samičí květy oboupohlavné, ale tyčinky zakrněné a neprodukují pyl. Plodit začíná v 10 letech. Semena jsou schopna šířit se na velké vzdálenosti vodou i větrem. Klíčí i v extrémnějších podmínkách (spáry mezi asfaltem, na zdech apod.) Kromě toho je druh schopen velmi intenzivního šíření kořenovými a kmenovými výmladky (až 3 m za sezonu). Výmladky se objevují až ve vzdálenosti 300 m od rodičovského jedince. Často se lze setkat s hustými keřovitými porosty na místě pařezu po pokáceném stromě. Je schopen dobře a rychle obsadit jakoukoli opuštěnou plochu s dostatkem světla. Vzhledem ke své schopnosti agresivního šíření představuje značné riziko pro chráněná území. Mechanická likvidace nebo vypalování jen podporuje zmlazení. Je nutno se zaměřit zejména na prevenci a omezení dalších výsadeb. Po zásahu je třeba rychle provést zalesnění. Pajasan žláznatý se řadí mezi nejinvazivnější dřeviny světa. Proto je nutné porosty v krajině monitorovat a včas eradikovat.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="Kácení na vysoký pařez, kácení na nízký pařez a částečné kroužkování, vždy bezprostředně následované aplikací herbicidu. Ponecháním stromů k odumření na stojato. Eliminace kořenových výmladků."/>
			<ManagementApplication text="lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>KOBLÍŽEK J. 1997: <i>Ailanthus Desf.</i> – pajasan. – In: Slavík B., Chrtek J. jun. et Tomšovic P. (eds), Květena České republiky 5, p. 144–146, Academia, Praha.</Resource>
			<Resource>KRIVANEK M., 2007: Pajasan žlaznatý – nebeský strom z pekel. Živa3/2007: 108–111.</Resource>
			<Resource>MLÍKOVSKÝ J., STÝBLO P., eds., 2006: Nepůvodní druhy fauny a flóry ČR, ČSOP Praha, 496 pp.</Resource>
			<Resource>PERGL J., PERGLOVÁ I., VÍTKOVÁ M., POCOVÁ L., JANATA T. et ŠÍMA J, 2015: Likvidace vybraných invazních druhů rostlin. Standard péče o přírodu a krajinu, vytvořený pro AOPK ČR, 22 pp.</Resource>
			<Resource>PYŠEK P., SÁDLO J. et MANDÁK B., 2002: Catalogue of alien plants of the Czech Republic. Preslia 74: 97–186.</Resource>
			<Resource>SPOHN M., SPOHN R., 2013: Stromy Evropy. Vyd. 1. — Praha: Beta-Dobrovský (Originál: Baumführer Europa); 301pp</Resource>
			<Resource>SVOBODA A. M. et SVOBODOVÁ D., 1969: Vysoce okrasná a nenáročná dřevina pajasan žláznatý – Ailanthus glandulosa Desf. Živa 17: 168–169. </Resource>
			<Resource>SVOBODA A. M., 1981: Introdukce okrasných listnatých dřevin. Praha: Academia, 162 pp.</Resource>
			<Resource>BOTANICKÝ ÚSTAV AV ČR v.v.i.: <a href="http://invaznirostliny.ibot.cas.cz/druhy/pajasan-zlaznaty/" target="_blank">http://invaznirostliny.ibot.cas.cz/druhy/pajasan-zlaznaty/</a>, cit. 2. 9. 2019.</Resource>
		</Resources>
	</div>
);

export default PajasanZlaznaty;
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

import image from "../../../assets/caseDetails/muflon-evropsky.png"; //TODO change source

const Muflon = props => (
	<div>
		<Title name="Muflon evropský" nameSynonyms="" latinName="Ovis aries musimon" latinNameSynonyms="Ovis musimon"/>
		<Summary>
			<OriginalArea text="Muflon byl dříve považován za předka domácích ovcí.  Nyní však na základě archeologických poznatků a genetických analýz převládá názor, že muflon je naopak zdivočelou formou domácích ovcí z Malé Asie, které se v 5. – 6. tisíciletí před naším letopočtem dostaly s neolitickými osadníky na Sardinii a Korsiku a odtud i dále do Evropy."/>
			<SecondaryArea text="Evropa, Severní Amerika, Jižní Amerika, Havaj"/>
			<Introduction text="Únik z chovů, záměrné vypouštění"/>
			<Breeding text="V oborách podle mysliveckého plánování, ve volné přírodě nekontrolovatelný"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto J. Červený"
		/>
		<TextBlock>
			<p>Tvarem těla a postavou se muflon podobá domácím ovcím, s nimiž se také může velmi lehce křížit. Délka těla dosahuje až 130 cm, ocasu 10 cm, výška v kohoutku je 90 cm a hmotnost 60 kg. Samice jsou výrazně menší. Samci nosí mohutné, nápadně vrubované rohy, muflonky jsou bez nich, vzácně mají jen drobné růžky. Letní srst je krátká, rezavohnědě zbarvená s tmavším odstínem na hřbetě. Světlé jsou pouze kresba okolo nosu, břicho, obřitek a dolní část končetin. Někteří berani mají na bocích i světlé sedlo (čabraku). Na zimu srst muflonům zhoustne a ztmavne, samcům vyrůstá na krku i hříva (rouno). Muflon sice není v Evropském seznamu nepůvodních invazních druhů, je ale uveden na Seznamu prioritních invazních druhů ČR (tzv. černý seznam, Pergl et al. 2016). Myslivecká legislativa tento druh řadí mezi zvěř se stanovenou dobou lovu. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Muflon obývá hlavně kamenité terény listnatých a smíšených lesů pahorkatin, přizpůsobí se však i jinému prostředí. Pouze nemá rád vlhké lokality s měkkou půdou a oblasti s vysokou sněhovou pokrývkou. Původně se choval pouze v oborách, dnes se vyskytuje i ve volné přírodě. Je býložravec, který využívá vlákninu velmi efektivně, takže není náročný na výběr potravy. Ta zahrnuje především nejrůznější druhy travin, bylin či zemědělské plodiny, méně pak listy, výhonky, plody a kůru lesních dřevin. Vegetaci spásají mufloni těsně u země. Mufloni žijí po celý rok ve smíšených tlupách obojího pohlaví, starší berani tvoří samostatné menší skupinky nebo žijí kromě doby říje zcela samotářsky. Tlupy vodí většinou starší muflonky, které jsou velmi ostražité a v případě nebezpečí varují ostatní členy tlupy jakýmsi hvízdnutím. Normální dorozumívací hlas je však jako u všech ovcí bečení. Nejaktivnější je mufloní zvěř za šera, často se však pase i během dne. Teritorium tlupy zabírá pouze několik km2. Mufloni mají výborný zrak, dobře běhají, obratně skáčou, ale voda je pro ně velkou překážkou. Rychle stoupá i početnost druhu čímž v některých oblastech negativně ovlivňují prostředí.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={2}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="odstřel, odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J.: Červený seznam savců České republiky. Příroda,22: 139-149.</Resource>
			<Resource>Anděra M., Červený J. 2009: Velcí savci v České republice. Rozšíření, historie a ochrana. 1. Sudokopytníci (Artiodactyla). Národní muzeum, Praha, 87 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource>Feuereisel  J., Koubek P., 2003: Die Verbreitung, Anzahl und Perpektiven des Müffelwildes in der Tschechischen Republic. Beiträge zur Jagd-und Wildforschung,28:79-83.</Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
			<Resource>Zima J., Slavíčková M., Havránková J., Černý M., 1988: Karyotypy divokých ovcí a chromozomová analýza muflonů z honiteb v České socialistické republice. Folia Venatoria , 18: 281-285. </Resource>
			<Resource>Pergl J., Sádlo J., Petrusek A., Laštůvka Z., Musil J., Perglová I., Šanda R., Šefrová H., Šíma J., Vohralík V., Pyšek P., 2016: Black, Grey and Watch Lists of alien species in the Czech Republic based on environmental impacts and management strategy. NeoBiota 28: 1-37.</Resource>
		</Resources>
	</div>
);

export default Muflon;
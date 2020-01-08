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

import image from "../../../assets/caseDetails/kolotocnik-ozdobny.png";

const KolotocnikOzdobny = props => (
	<div>
		<Title name="Kolotočník ozdobný" nameSynonyms="volovec srdcolistný/volské oko srdcolistý/kolotočník/telekova okázalá/volské oko srdcolisté/telekie" latinName="Telekia speciosa" latinNameSynonyms="Buphthalmum speciosum/Buphthalmum cordifolium/Telekia cordifolia"/>
		<Summary>
			<OriginalArea text="Jižní a východní Evropa, sever Malé Asie, Kavkaz, Východní Karpaty, původní areál zasahuje až na východní Slovensko a do Polska"/>
			<SecondaryArea text="Severozápadní Evropa až evropské části Ruska"/>
			<Introduction text="Pěstování jako okrasná a medonosná rostlina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Martin Vojtík"
		/>
		<TextBlock>
			<p>Kolotočník (Heartleaf oxeye) je statná trvalka se silným oddenkem. Dorůstá výšky 70 až 200 cm. Lodyha je přímá, chudě větvená s chlupy. Dolní a přízemní listy jsou řapíkaté (řapík žlábkovitý), srdčitě vejčité, celistvé, vroubkovaně pilovité, zejména na rubu pýřité a dlouhé  10–40 cm. Horní listy jsou přisedlé. Úbory jsou uspořádány po 2–8 v chocholičnaté latě a dosahují  5–9 cm v průměru. Zákrovní listeny se střechovitě překrývají, jsou vejčité až kopinaté. Květy jsou žluté, jazykovité až 1 mm široké. Terč dosahuje v průměru až 3,5 cm. Plodem je nažka. Obsahuje látky, které mohou u citlivých osob po dotyku vyvolat na pokožce alergickou reakci.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Preferuje stanoviště slunné až polostinné, půdy vlhké, hlinité, výživné, slabě kyselé až slabě zásadité. Roste na výslunných stanovištích od podhůří až do hor, především kolem potoků a na lesních světlinách, v příkopech kolem cest, a loukách, v blízkosti lidských sídel. Pěstuje se v zahradách a parcích, odkud často zplaňuje. Lze jej považovat za druh dokonale zplanělý a zdomácnělý. Najdeme jej roztroušeně skoro po celém území ČR, schází většinou jen v teplejších oblastech. Kvete od června do srpna.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={2}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="Aplikace herbicidu, kosení"/>
			<ManagementApplication text="Řídká, lokálně v ZCHÚ (např. CHKO Labské pískovce)"/>
		</InvasivePotential>
		<Resources>
			<Resource>MLÍKOVSKÝ J, STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>SLAVÍK B., ŠTĚPÁNKOVÁ J. & ŠTĚPÁNEK J. (eds), Květena České republiky 7, p. 114–123, Academia, Praha</Resource>
			<Resource>PLADIAS. dostupné z: <a href="https://pladias.cz/" target="_blank">https://pladias.cz/</a>; cit. 21.10.2019</Resource>
		</Resources>
	</div>
);

export default KolotocnikOzdobny;
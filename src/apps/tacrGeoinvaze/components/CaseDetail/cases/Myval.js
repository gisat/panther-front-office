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

import image from "../../../assets/caseDetails/myval-severni.jpg";

const Myval = props => (
	<div>
		<Title name="Mýval severní" nameSynonyms="Medvídek mýval" latinName="Procyon lotor" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Severní Amerika, severní část Jižní Ameriky"/>
			<SecondaryArea text="Evropa, střední Asie"/>
			<Introduction text="Únik z chovů, záměrné vypouštění"/>
			<Breeding text="Není povolen"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: J. Vogeltanz"
		/>
		<TextBlock>
			<p>Mýval je zavalité zvíře s nahrbeným držením těla, které je dlouhé až 70 cm, délkou ocasu až 30 cm a hmotností 16 kg. Typická je jeho černobílá maska na hlavě a pruhovaný ocas (4-7 proužků). Tyto znaky jsou důležité pro rozpoznání od zaměnitelných druhů – psíka mývalovitého a jezevce lesního. Typické pro mývala jsou dlouhé pohyblivé prsty, zvláště na předních končetinách. Mýval severní je uveden v Evropském seznamu nepůvodních invazních druhů a jeho záměrné šíření je protizákonné. Je uveden i na Seznamu prioritních invazních druhů ČR (tzv. černý seznam). Myslivecká legislativa tento druh řadí mezi zavlečené druhy živočichů v přírodě nežádoucí, které však může lovit pouze myslivecká stráž.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Mýval dává přednost listnatým a smíšeným lesům s bohatým podrostem v okolí vod. Může se však vyskytovat i na jiných vlhkých stanovištích nebo v mozaikovité krajině či v blízkosti lidských sídel (např. příměstské parky či vilové zástavby). Při hledání potravy využívá mýval obratné přední končetiny, jimiž pečlivě ohmatává všechny předměty. Je všežravý, avšak rychlejší nebo větší živočichy nedokáže ulovit. Jeho potrava je velmi rozmanitá – od drobných savců ptáků a jejich vajec, mlžů, raků, drobných rybek, hmyzu až po různé plody či zemědělské plodiny Svou potravní strategií může ohrožovat populace různých druhů živočichů. Mýval je aktivní hlavně v noci, výborně šplhá po stromech, přes den se ukrývá zejména ve stromových dutinách, nebo i skalních štěrbinách.  V zimě omezuje svou aktivitu, ale neukládá se k zimnímu spánku. Převážně žije samotářsky, někdy se však sdružuje i do větších skupin. Jeho teritorium se pohybuje v rozmezí stovek hektarů. V podmínkách ČR se mýval zatím vyskytuje především v polohách pod 600 m n. m., nadmořská výška však není limitujícím faktorem výskytu. Početnost populace mývala u nás prudce stoupá, zejména v severozápadních Čechách a na střední Moravě, odkud se druh velmi rychle šíří.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J.: Červený seznam savců České republiky. Příroda,22: 139-149.</Resource>
			<Resource>Anděra M., Červený J. 2009: Velcí savci v České republice. Rozšíření, historie a ochrana. 2. Šelmy (Carnivora). Národní muzeum, Praha,215 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource>Červený J., Anděra M., Koubek P., Homolka M., Toman A., 2001: Recently expanding mammal species in the Czech Republic: distribution, abundace and legal status. Beiträge zur Jagd- und Wildforschung, 26: 111-125.</Resource>
			<Resource>Červený J., Anděra M., Koubek P. Bufka L., 2006: Změny vrozšíření naich savců na začátku 21. století. Ochrana přírody 62(2): 44-51.</Resource>
			<Resource>Matějů J., Dvořák S., Tejrovský V., Bušek O., Ježek M., Matějů Z., 2012:  Current distribution of Procyon lotor in nort-western Bohemia, Czech Republic (Carnivora: Procyonidae). Lynx, n.s. (Praha), 43: 133-140.</Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
		</Resources>
	</div>
);

export default Myval;
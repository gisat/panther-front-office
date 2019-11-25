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

import image from "../../../assets/caseDetails/psik-myvalovity.jpg";

const Psik = props => (
	<div>
		<Title name="Psík mývalovitý" nameSynonyms="Mývalovec kuní" latinName="Nyctereutes procyonoides" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Východní a jihovýchodní Asie"/>
			<SecondaryArea text="Evropa"/>
			<Introduction text="Únik z chovů, záměrné vypouštění"/>
			<Breeding text="Není povolen"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: J. Červený"
		/>
		<TextBlock>
			<p>Velikost těla je přibližně stejná jako u lišky, psík má však mnohem kratší nohy i ocas. Na první pohled připomíná spíš jezevce nebo mývala než psovitou šelmu. Délka těla dosahuje až 70 cm, ocasu 25 cm, hmotnost 12 kg. Dlouhá srst je plavě šedá až šedohnědá s tmavým žíháním, končetiny jsou téměř černé. Hlava má pestrou černobílou masku. Psík mývalovitý je uveden v Evropském seznamu nepůvodních invazních druhů a jeho záměrné šíření je protizákonné. Je uveden i na Seznamu prioritních invazních druhů ČR (tzv. černý seznam). Myslivecká legislativa tento druh řadí mezi zavlečené druhy živočichů v přírodě nežádoucí, které však může lovit pouze myslivecká stráž.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Psík mývalovitý se rád se zdržuje v okolí vod na podmáčených stanovištích a v listnatých lesích, běžně se však vyskytuje i jiných stanovištích včetně agrocenóz a blízkosti lidských sídel. Ačkoliv patří mezi šelmy je všežravý a jeho potrava je proto velmi rozmanitá – od drobných savců velikosti zajíce, ptáků a jejich vajec, žab, hadů a ještěrek, ryb, hmyzu a měkkýšů až po různé plody, kořínky i zelené části rostlin. Často požírá také zdechliny, nepohrdne ani odpadky. Svou potravní strategií může ohrožovat populace na zemi hnízdících ptáků a obojživelníků. Psík je aktivní hlavně v noci, přes den se ukrývá ve vlastních nebo liščích či jezevčích norách. Na vlhkých stanovištích si buduje úkryty i z trávy a rákosu. Za krutých zim může upadat jako jediný z psovitých šelem do nepravého zimního spánku. Jako monogamní druh žije v párech nebo v rodinných skupinách s odrůstajícími mláďaty. Obývá relativně malé území o rozloze 50-200 ha. Žije velmi skrytým a nenápadným způsobem života. Může se podílet na přenosu vztekliny. V podmínkách ČR se psík mývalovitý vyskytuje především v polohách 200–600 m n. m., nadmořská výška však není limitujícím faktorem. Ze Šumavy je výskyt je známý i z poloh nad 1000 m n. m., z Krkonoš dokonce z výšky 1440 m n. m. Početnost populace psíka u nás stále stoupá.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J.: Červený seznam savců České republiky. Příroda,22: 139-149.</Resource>
			<Resource>Anděra M., Červený J. 2009: Velcí savci v České republice. Rozšíření, historie a ochrana. 2. Šelmy (Carnivora). Národní muzeum, Praha,215 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource>Červený J., Anděra M., Koubek P., Homolka M., Toman A., 2001: Recently expanding mammal species in the Czech Republic: distribution, abundace and legal status. Beiträge zur Jagd- und Wildforschung, 26: 111-125.  45-56.</Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
		</Resources>
	</div>
);

export default Psik;
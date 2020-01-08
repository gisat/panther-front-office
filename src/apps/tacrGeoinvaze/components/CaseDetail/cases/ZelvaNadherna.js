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

import image from "../../../assets/caseDetails/zelva-nadherna.jpg";
import image2 from "../../../assets/caseDetails/zelva-nadherna-2.jpg";

const ZelvaNadherna = props => (
	<div>
		<Title name="Želva nádherná" nameSynonyms="" latinName="Trachemys scripta" latinNameSynonyms="Testudo scripta/Pseudemys scripta/ Crysemys scripta/Emys vitata"/>
		<Summary>
			<OriginalArea text="Východní, jihovýchodní a centrální státy USA a severovýchodní Mexiko."/>
			<SecondaryArea text="Sladkovodní stanoviště po celém světě (Afrika, Asie, Evrope, Austrálie). U nás nebyl zaznamenán případ rozmnožování, ale jsou schopny přezimovat a přežívat zejména v teplých oblastech, ale díky úniku (vypuštění) ze zájmových chovů jsou k nalezení takřka po celém území"/>
			<Introduction text="Záměrné vypouštění do volné přírody, únik z chovů (v současnosti již dovoz zakázán)"/>
			<Breeding text="Nyní zakázán"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="U poddruhu T. s. troosti se červená skvrna za okem nevyskytuje. Foto: Tomáš Holer - Berounka, 2017."
		/>
		<br/>
		<CaseImage
			source={image2}
			copyright="Poddruh T. s. elegans s charakteristickou červenou skvrnou za okem. Foto převzato z www.nobanis.org."
		/>
		<TextBlock>
			<p>Sladkovodní želva dorůstající délky až 30 cm (samci bývají menší cca do 20 cm). Typickým znakem je proužek výrazné červené, oranžové nebo žluté barvy po stranách hlavy (tvar i barva se u jednotlivých poddruhů liší). U některých jedinců však může vzácně proužek úplně chybět. Končetiny mají plovací blánu a drápy, které jsou u samců výrazně dlouhé. Možná záměna s naší kriticky ohroženou želvou bahenní (<i>Emys orbicularis</i>). Ta je rozpoznatelná díky chybějícímu barevnému pruhu za okem (hlavu pokrývají drobné žluté skvrnky).</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Želva nádherná obývá rozličné sladkovodní biotopy (zejména pomalu tekoucí a stojaté vody).  Daří se jí i v městském prostředí (např. jezírka v parcích). Zaznamenány byly i případy rozmnožování a přežívání v mírně slaném prostředí. Pohlavní dospělosti dosahuje ve druhém až třetím roce. Dožívá se až 50 let. Rozmnožuje se začátkem jara (může docházet i k pozdnímu kladení, kdy želvy přečkají zimu ve vejcích a vylíhnou se až v teplejším počasí). Samice snáší do písku až 30 vajec. Mladé želvy potřebují vyšší teplotu (ideálně 27-30 °C) a jsou prakticky výhradně masožravé, starší jedinci jsou převážně býložraví, přesto se mohou místy významněji podílet i na predaci nativní fauny bezobratlých živočichů, ryb a obojživelníků. Dále mohou ohrozit průběh hnízdění ptáků v důsledku kompetice o vhodná místa ke slunění. Uniklé a zejména záměrně vypouštěné želvy se dostávají do volné přírody, kde mohou za příhodných podmínek přežívat a v teplých částech světa se i rozmnožovat. U nás zatím nebylo rozmnožování popsáno. Vyskytují se však zprávy o pozorování velmi malých jedinců. Proto panuje podezření, že k němu vzácně dochází. Vlivem klimatických změn by se však mohlo stát i běžným jevem. Vyskytuje se ve třech poddruzích (<i>T. s. elegans, T. s. scripta, T. s.  troosti</i>). K nám se dovážela zejména <i>T. s. elegans</i>. V současnosti byl dovoz do členských států pozastaven (nařízení Rady (ES) č. 338/97 z 9. 12. 1996 o ochraně druhů volně žijících živočichů a planě rostoucích rostlin regulováním obchodu s nimi, Nařízení EP a Rady č. 1143/2014 o prevenci a regulaci zavlékání či vysazování a šíření invazních nepůvodních druhů). Lze tedy předpokládat, že se stavy jedinců na našem území i v ostatních členských státech EU postupně sníží. Nicméně díky možnému ojedinělému rozmnožování je nutné tyto jedince monitorovat a odchytávat.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={2}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>BIOLIB.CZ: Profil taxonu <i>Trachemys scripta</i>, <a href="https://www.biolib.cz/cz/taxon/id25100/" target="_blank">https://www.biolib.cz/cz/taxon/id25100/</a>, cit. 31. 8. 2019</Resource>
			<Resource>DIXON G. et FORSTNER, M., 2001: Geographic distribution. Trachemys scripta. Herpetological Review. 32. 192.</Resource>
			<Resource>HONG M., JIANG A., LI N., LI W., SHI H., STOREY K. B. et DING L., 2019: Comparative analysis of the liver transcriptome in the red-eared slider <i>Trachemys scripta elegans</i> under chronic salinity stress. PeerJ, 7, e6538. doi:10.7717/peerj.6538</Resource>
			<Resource>MLÍKOVSKÝ J., STÝBLO P., eds., 2006: Nepůvodní druhy fauny a flóry ČR, ČSOP Praha, 496 pp</Resource>
			<Resource>PEŠAT J., 2008: Želvy ohrožují hnízdění vodního ptactva. – Živa 5: 229–230.</Resource>
			<Resource>TUCKER J.K., LAMER J.T. et DOLAN C.R., 2007: <i>Trachemys Scripta Elegans</i>. Kyphosis. Herpetological Review. 38. 337-338.</Resource>
		</Resources>
	</div>
);

export default ZelvaNadherna;
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

import image from "../../../assets/caseDetails/vodni-mor-kanadsky.jpg";

const VodniMorKanadsky = props => (
	<div>
		<Title name="Vodní mor kanadský" nameSynonyms="" latinName="Elodea canadensis" latinNameSynonyms={
			<>
			Anacharis canadensis <em>(Michx.) Planch.</em>/Hydora canadensis <em>(Michx.) Besser</em>/Philotria canadensis <em>(Michx.) Britton.</em>/Serpicula canadensis <em>(Michx.) Eaton</em>/Udora canadensis <em>(Michx.) Nutt.</em>
			</>
		}/>
		<Summary>
			<OriginalArea text="Severní Amerika (USA a Kanada), jinde druhotně"/>
			<SecondaryArea text="Evropa/Irsko (od roku 1836), ČR (od roku 1879). V současnosti prakticky na celé severní polokouli a v Australii. "/>
			<Introduction text="Rozšiřován v rámci botanických zahrad, akvaristy a při přesunu rybí násady. Není vyloučeno šíření propagulí vodními ptáky. Druh rozšířen od nížin do podhorských oblastí."/>
			<Breeding text="V kultuře (uzavřené nádrže) jako akvaristicky využitelný druh."/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Chrisitan Fisher"
		/>
		<TextBlock>
			<p>Poměrně vytrvalá ponořená vodní rostlina z čeledí voďankovitých (<i>Hydrocharitaceae</i>). Lodyhy bohatě olistěny drobnými listy v přeslenech po třech. Samičí květy vyrůstají na dlouhých, nitkovitých stopkách. Mají růžové kališní lístky a 3 bělavé korunní lístky.
				V ČR se vyskytuje pouze populace se samičími květy, proto u nás ke generativnímu rozmnožování nedochází. Samčí jedinci udávaní z Irska – jedná se zřejmě o záměnu s <i>Elodea nuttallii</i>.
			</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Hydrofyt, anemofil, hydrochor, K-stratég. Roste ve stojatých i tekoucích vodách od mělkých tůní až po hlubší mrtvá ramena a rybníky. V současné době je výskyt vázán především na poříční tůně, náhony a stoky.V rybnících vzácně, pouze v litorálu, nikoliv v monotypických populacích.  Druh náročný na vyšší obsah vápníku ve vodáchméně toleruje kyselé vody. I přesto ho lze považovat za druh se širokou ekologickou amlitudou, včetně tolerance k zastínění.  Může se objevovat ve všech typech společenstev vodních rostlin, v případě intentzivního rozvoje potlačuje růst a vývoj drobnolistých typů makrofyt.</p>
			<p>Množí se výhradně vegetativně. Propagulemi jsou úlomky lodyh a zimní pupeny (propagule).
				Vzhledem k přirozenému úbytku v rybničních nádržích (lze přisuzovat zejména vysokým rybím obsádkám, neověřeným vlivem je hydrobiologicky potvrzená změna obsahu dusíku a fosforu v rybnících) není nutné žádné razantní opatření.Dříve (60. – 80. léta 20. stol). bylo účinnou formou likvidace zimování a letnění rybníků.
			</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={0}/>
			<AsexualReproduction score={3}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="mechanická likvidace, využití specifické rybí obsádky"/>
			<ManagementApplication text="cíleně se neprovádí"/>
		</InvasivePotential>
		<Resources>
			<Resource>Černý, R. (1994). Vegetace makrofyt tůní a slepých ramen nivy řeky Lužnice a její bioindikační význam. Kandidátská dizertační práce. Pedagogická fakulta JU v Českých Budějovicích. České Budějovice.</Resource>
			<Resource>Hejný, S. a kol. (2000). Rostliny vod a pobřeží. East West Publisching Company Praha.</Resource>
			<Resource>Jehlík, V. (ed.) (1998). Cizí expanzní plevele české a Slovenské republiky. Academia Praha.</Resource>
			<Resource>Stalmachová, B. a kol. (2019). Strategie řešení invazních druhů rostlin v obcích česko-polského pohraničí. IMAGE STUDIO s.r.o., Slezská Ostrava.</Resource>
			<Resource>Thouvenot, L., Thiébaut, G. (2018). Regeneration and colonization abilities of the invasive species <i>Elodea canadensis</i> and <i>Elodea nuttallii</i> under a salt gradient: implications for freshwater invasibility. Hydrobiologia, 817(1), 193-203.</Resource>
		</Resources>
	</div>
);

export default VodniMorKanadsky;
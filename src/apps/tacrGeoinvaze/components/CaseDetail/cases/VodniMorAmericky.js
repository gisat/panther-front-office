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

import image from "../../../assets/caseDetails/vodni-mor-americky.jpg"; //TODO change source

const VodniMorAmericky = props => (
	<div>
		<Title name="Vodní mor americký" nameSynonyms="" latinName="Elodea nuttallii" latinNameSynonyms={
			<>
			Anacharis nuttallii<em> Planch./</em>Elodea columbiana<em> H. St. John/</em>Elodea minor<em> (Engelm. ex Casp.) Farw./</em>Philotria minor<em> (Engelm. ex Casp.) Small/</em>Philotria nuttallii<em> (Planch.) Rydb./</em>Udora verticillata<em> var. minor Engelm. ex Casp.</em>
			</>
		}/>
		<Summary>
			<OriginalArea text="Severní Amerika, USA, Kanada"/>
			<SecondaryArea text="Evropa, Asie. Poprvé zjištěn v roce 1939 v Belgii"/>
			<Introduction text={
				<>
				Pravděpodobně s akvarijními rybami, možné též s rybí násadou. Dle Grulicha (2019) se v současné době nejhojněji vyskytuje v řece Ohři od Chebu až po Klášterec nad Ohří. Jednotlivé lokality byly nalezeny na dalších místech Čech, např. u Děčína, v Praze, Plzni, ale i v Novohradských horách, na Moravě v Ostravě i v dolním Podyjí. Další šíření lze očekávat, není vyloučené ani šíření případné hybridní populace <i>Elodea nuttallii</i> x <i>Elodea canadensis</i>.
				V některých oblastech (např. Anglie, Porýní) vytlačuje vodní mor kanadský (<i>Elodea canadensis</i>). U nás problémem dosud není.

				</>
			}
			/>
			<Breeding text="V kultuře (uzavřené nádrže) jako akvaristicky využitelný druh."/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Christian Fisher"
		/>
		<TextBlock>
			<p>Vytrvalá ponořená dvoudomá rostlina z čeledi voďankovitých.  Lodyhy jsou chudě větvené až 1,5 m dlouhé.  Listy jsou na bázi lodyhy vstřícné, výše obvykle tvoří 3četné přesleny. Listy často výrazně srpovitě zahnuté. Květy vyrůstají jednotlivě v paždí horních listů.  Samčí květy se v době zralosti pylu uvolňují a otevírají na hladině. Samičí květy vyrůstají z válcovitého toulce a mají až 25 cm dlouhou trubku. Plody jsou obráceně kyjovité tobolky 0,5–1 cm dlouhé, na vrcholu dlouze zobanité. V ČR se vyskytují samčí i samičí rostliny. Hybridy mezi Elodea canadensis a Elodea nuttallii se mohou vyskytovat přirozeně. Toto může nastat i v ČR, přestože E. canadensis se vyskytuje pouze jako samičí populace.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Hydrofyt, anemofil, hydrochor, K-stratég. Osidluje tekoucí i stojaté vody, zejména mezotrofní, průhledné, s nižším obsahem živin (významný rozdíl proti E. canadensis která preferuje eutrofní vody s významným podílen vápníku). Přezimuje pomocí turionů, snadno se šíří fragmentací lodyh. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={1}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={1}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="cíleně se neprovádí"/>
			<ManagementApplication text="cíleně se neprovádí"/>
		</InvasivePotential>
		<Resources>
			<Resource>Cook, C. D., Urmi-König, K. (1985). A revision of the genus Elodea (Hydrocharitaceae). Aquatic Botany, 21(2), 111-156.</Resource>
			<Resource>Greulich, S.,Tremolieres, M. (2006). Present distribution of the genus Elodea in the Alsatian Upper Rhine floodplain (France) with a special focus on the expansion of Elodea nuttallii St. John during recent decades. Hydrobiologia, 570(1), 249-255.</Resource>
			<Resource>Grulich,V. (2019). <a href="https://botany.cz/cs/elodea-nuttallii/" target="_blank">https://botany.cz/cs/elodea-nuttallii/</a></Resource>
			<Resource>Thouvenot, L., Thiébaut, G. (2018). Regeneration and colonization abilities of the invasive species Elodea canadensis and Elodea nuttallii under a salt gradient: implications for freshwater invasibility. Hydrobiologia, 817(1), 193-203.</Resource>
		</Resources>
	</div>
);

export default VodniMorAmericky;
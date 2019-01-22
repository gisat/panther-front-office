import React from 'react';
import IntroHeader from "../../../common/intro/introHeader/presentation";
import VisualsConfig from "../../../../constants/VisualsConfig";
import PropTypes from "prop-types";

import "./style.css";

class GeoinvIntro extends React.PureComponent{
	render() {
		let data = VisualsConfig["geoinvaze"];

		return (
			<div>
				<IntroHeader
					title={data.headerTitle}
					description=""
					backgroundSource={data.introHeaderBackgroundSrc}
					logoSource={data.introLogoSrc}
					withBackgroundOverlay
				/>
				{this.renderContent()}
			</div>
		);
	}

	renderContent() {
		return (
			<div className={"ptr-intro-geoinv-content"}>
				<p>Tento geoinformační portál je zaměřen na vizualizaci distribuce invazních nepůvodních druhů v rámci ČR. Výstupy jsou prezentovány ve formě síťových map. Objektem zájmu jsou vybrané druhy rostlin a živočichů obsažené v seznamu druhů (2016/1141) k nařízení EU (1143/2014) a druhy z Černého seznamu ČR (Pergl et al. 2016). Pro druhy byly vytvořeny mapy současného výskytu a predikční modely možného výskytu. V mapách současného rozšíření je možné též sledovat vývoj šíření druhu podle délky trvání výskytu v zájmovém území. Zobrazení výstupů modelů pak ukazuje maximální možné rozšíření druhů a predikci v časových horizontech. </p>
				<h3>Popis druhů</h3>
				<p>Mapové výstupy byly vytvořeny pro vybrané druhy vyskytující se ve volné krajině, mimo kultury a intravilán, a druhy s vysokým impaktem na přírodě blízká společenstva a ekosystémy. Pro potřeby portálu byly vybrány druhy na tzv. Unijním seznamu invazních druhů (seznam druhů k nařízení EU 1143/2014), druhy Černého a šedého seznamu ČR (Pergl et al. 2016) a některé druhy tzv. watch listu. Jde o druhy v současné době dosud nerozšířené, ale vykazující invazní chování v na jiných místech Evropy a z ekologického hlediska potenciálně schopné se šířit na naše území.</p>
				<p>Ze seznamů byly vyjmuty druhy, které se v ČR vyskytují buď velmi málo a mají malý environmentální dopad, nebo netvoří stálé populace, a zároveň druhy, které se vyskytují po celém území ČR na mnoha různých stanovištích a výskyt je v rámci ČR celoplošný. U takových druhů nemá vizuální prezentace valného významu. V rámci portálu nejsou zobrazovány druhy s celoplošným výskytem v rámci ČR (např. muflon evropský (Ovis musimon), ….XXXX), druhy jejichž výskyt nezávisí na podmínkách prostředí, ale spíše na lidských aktivitách, tedy všechny formy kultur. Pod tímto pojmem jsou zahrnuty plantáže, chovy v oborách, zájmové chovy ve volné přírodě atd. Dále nejsou zahrnuty druhy, které sice mají vysoký impakt (např. ambrosie peřenolistá (Ambrosia artemissifolia), ale jejich populace jsou v čase nestálé a výskyt je závislý na náhodných faktorech. </p>
			</div>
		);
	}
}

export default GeoinvIntro;
import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import moment from "moment";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";

import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import MapResources, {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName, mapPeriodOptions, outlinesStyle} from "../../constants/MapResources";

import utils, {hoveredStyleDefinition, selectedStyleDefinition} from "../../utils";
import {LineChartPopup} from "../LineChartPopup";
import {MapInfo} from "../MapInfo";
import {MapLegend} from "../MapLegend";
import {MapPopup} from "../MapPopup";
import Select from "../../../../components/common/atoms/Select/Select";

const getChlorophyllChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
	{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,15],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [15,30],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [30,45],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [45,60],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [60,100],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

const getWaterChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,0.015],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [0.015,0.030],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [0.030,0.045],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [0.045,0.060],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [0.060,0.1],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

const getLeafsChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,2],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [2,4],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [4,6],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [6,8],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [8,15],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

class Biofyzika extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		placeView: PropTypes.object,
		scope: PropTypes.object,
		activePeriodKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpbKey: props.data && props.data[0].properties[fidColumnName],
			mapView: props.activePlaceView,
			selectedMapPeriod: mapPeriodOptions[3]
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onMapPeriodChange = this.onMapPeriodChange.bind(this);
	}

	componentDidMount() {
		if (this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.data) {
			let exists = this.getSelectedAreaData();
			if (!exists) {
				this.setState({
					activeDpbKey: props.data && props.data[0] && props.data[0].properties[fidColumnName]
				});
			}
		}

		if (!this.state.mapView && this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	onMapViewChange(view) {
		this.setState({
			mapView: view
		})
	}

	onMapClick(mapKey, layerKey, fids) {
		this.setState({
			activeDpbKey: fids[0]
		})
	}

	onMapPeriodChange(option) {
		this.setState({
			selectedMapPeriod: option
		});
	}

	render() {
		const props = this.props;

		let dataForCharts = null;

		let chlorophyllAttribute = "C" + this.state.selectedMapPeriod.key;
		let chlorophyllStyle = getChlorophyllChoroplethStyle(chlorophyllAttribute);

		let waterAttribute = "W" + this.state.selectedMapPeriod.key;
		let waterStyle = getWaterChoroplethStyle(waterAttribute);

		let leafsAttribute = "L" + this.state.selectedMapPeriod.key;
		let leafsStyle = getLeafsChoroplethStyle(leafsAttribute);

		let chlorophyllFirstMapLayers, chlorophyllSecondMapLayers = [];
		let waterFirstMapLayers, waterSecondMapLayers = [];
		let leafsFirstMapLayers, leafsSecondMapLayers = [];

		if (this.state.activeDpbKey) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			chlorophyllFirstMapLayers = this.getMapLayers(chlorophyllStyle);
			chlorophyllSecondMapLayers = this.getMapLayers(outlinesStyle);

			waterFirstMapLayers = this.getMapLayers(waterStyle);
			waterSecondMapLayers = this.getMapLayers(outlinesStyle);

			leafsFirstMapLayers = this.getMapLayers(leafsStyle);
			leafsSecondMapLayers = this.getMapLayers(outlinesStyle);
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<div>
						<h1>{props.scope && props.scope.data.nameDisplay}</h1>
						<p>Biofyzikální monitoring představuje vizualizaci výsledků kvantitativního odhadu hodnot vybraných biofyzikálních charakteristik porostů zemědělských plodin: <b>obsahu chlorofylu (C<sub>ab</sub>), obsahu vody (C<sub>w</sub>) a indexu listové plochy (LAI)</b>. Vlastní výpočet těchto parametrů je založeno na zpracování družicových dat Sentinel-2. Výsledné hodnoty jednotlivých parametrů jsou potom agregovány vždy po 10-denních časových obdobích (vždy 1. – 10., 11. -  20. a 21. – 30./31. dne v daném měsíci). Z úrovně družicových snímků jsou pak hodnoty dílčích biofyzikálních charakteristik dále prostorově agregovány na úroveň jednotlivých zemědělských pozemků. Získané odhady biofyzikálních charakteristik jsou následně použity pro vymezení tzv. management zón v rámci monitorovaných zemědělských pozemků. Tato zonace je pak založena na srovnání aktuálně zjištěných hodnot daného parametru s hodnotami obvyklými pro danou plodinu, termín a klimatické podmínky. </p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Obsah chlorofylu</h2>
						<p>Vrstva „obsah chlorofylu“ vyjadřuje obsah fotosynteticky aktivních pigmentů v listoví vegetace přepočtený na listovou plochu (μg/cm<sup>2</sup>). Množství listových pigmentů velmi těsně souvisí s celkovou fotosyntetickou aktivitou rostlin, která je pak dále navázána na výživu porostu (například dusíkem).</p>
						<p>Obsah chlorofylu je tedy jednou ze základních vstupů pro tvorbu map pro variabilní aplikace (např. aplikace hnojiv během produkčního a kvalitativního hnojení). Při sledování časové řady obsahu chlorofylu je pak možné i zhodnotit dopady provedených agrotechnických opatření (opět zejména hnojení, případně aplikace POR). V průběhu dozrávání (obilniny, řepka apod.) dochází v důsledku celkového prosýchání porostů k přirozenému úbytku obsahu chlorofylu. Díky tomu je možné sledovat nejen aktuální stav zralosti porostů, ale také případné selektivní dozrávání porostu v rámci jednoho pozemku. Hodnoty obsahu chlorofylu se u zdravých porostů pohybují nejčastěji v rozmezí mezi 20 – 60 μg/cm<sup>2</sup>. U zralých/suchých porostů pak obsah chlorofylu klesá zpravidla pod 10 μg/cm<sup>2</sup>.</p>
						<p className="tacrAgritas-component-description">
							Mapové okno vlevo znázorňuje výsledky kvantitativního odhadu obsahu chlorofylu v absolutní hodnotě (μg/cm<sup>2</sup>), a to jak na úrovni družicových dat Sentinel-2, tak jako hodnoty agregované za jednotlivé zemědělské pozemky. Mapové okno vpravo znázorňuje vymezení tzv. management zón na základě prostorové variability hodnot obsahu chlorofylu a jejich srovnání s hodnotami obvyklými pro danou plodinu, termín a klimatické podmínky.
						</p>
						{this.renderMapSet('map-set-1', chlorophyllFirstMapLayers, chlorophyllSecondMapLayers, chlorophyllAttribute, "μg/cm2")}
						<MapLegend
							style={chlorophyllStyle}
							name={"Obsah chlorofylu"}
							unit={"μg/cm2"}
							noData
						/>
						{dataForCharts && dataForCharts.chlorophyll ? this.renderChlorophyllChart(dataForCharts) : null}
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Obsah vody</h2>
						<p>
							Obsah vody je v tomto případě vyjádřen v podobě tzv. Equivalent Water Thickness (EWT) popisující tloušťku vrstvičky vody, které by se vytvořila, pokud bychom veškerou vodu obsaženou v listoví vyseparovali a rovnoměrně rozprostřeli po ploše listu. Množství vody je tedy vyjádřeno v centimetrech (cm). Obsah vody je obecně velmi dynamický parametr popisující aktuální zásobenost rostlin vodou. Díky tomu je možné pomocí této datové vrstvy sledovat případné ohrožení rostlin nedostatkem vody (např. vlivem sucha). Podobně jako v případě obsahu chlorofylu klesá přirozeně obsah vody v průběhu dozrávání (obilniny, řepka apod.). Proto je možné datovou vrstvu využít i pro sledování selektivního dozrávání plodin. Obdobným způsobem je pak možné sledovat například přítomnost různých anomálií (např. podmáčených ploch apod.). Hodnoty obsahu vody se u „čerstvé“ zelené vegetace pohybují nejčastěji v rozmezí 0.0100 – 0.0550 cm, u suchých, zrajících porostů se pak zpravidla obsah vody pohybuje v rozmezí 0.0005 – 0.0100 cm.
						</p>
						<p className="tacrAgritas-component-description">
							Mapové okno vlevo znázorňuje výsledky kvantitativního odhadu obsahu vody v absolutní hodnotě (cm), a to jak na úrovni družicových dat Sentinel-2, tak jako hodnoty agregované za jednotlivé zemědělské pozemky. Mapové okno vpravo znázorňuje vymezení tzv. management zón na základě prostorové variability hodnot obsahu vody a jejich srovnání s hodnotami obvyklými pro danou plodinu, termín a klimatické podmínky.
						</p>
						{this.renderMapSet('map-set-2', waterFirstMapLayers, waterSecondMapLayers, waterAttribute, "cm")}
						<MapLegend
							style={waterStyle}
							name={"Obsah vody"}
							unit={"cm"}
							noData
						/>
						{dataForCharts && dataForCharts.water ? this.renderWaterChart(dataForCharts) : null}
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Index listové plochy</h2>
						<p>Index listové plochy (LAI) je definován jako jednostranná plocha listoví vegetace vztažená na jednotkovou plochou povrchu. Jedná se tedy o bezrozměrnou veličinu (resp. její jednotkou by byly m<sup>2</sup>/m<sup>2</sup>). LAI je důležitým parametrem k určování mnoha dalších biologických a fyzikálních procesů souvisejících s vegetací neboť de facto popisuje plochu, na níž dochází k příjmu slunečního záření a dalších látek ze zemské atmosféry. Pomocí hodnot indexu listové plochy lze sledovat především zapojenost porostu a nárůst množství biomasy v čase, čehož lze využít při přípravě podkladů pro variabilní aplikace hnojiv při produkčním a kvalitativním hnojení, a následně též pro sledování jejich dopadů. Hodnoty indexu listové plochy se mohou pro různé plodiny a různá stádia vývoje těchto plodin poměrně výrazně lišit.</p>
						<p className="tacrAgritas-component-description">
							Mapové okno vlevo znázorňuje výsledky kvantitativního odhadu indexu listové plochy v absolutní hodnotě (m<sup>2</sup>/m<sup>2</sup>), a to jak na úrovni družicových dat Sentinel-2, tak jako hodnoty agregované za jednotlivé zemědělské pozemky. Mapové okno vpravo znázorňuje vymezení tzv. management zón na základě prostorové variability hodnot indexu listové plochy a jejich srovnání s hodnotami obvyklými pro danou plodinu, termín a klimatické podmínky.
						</p>
						{this.renderMapSet('map-set-3', leafsFirstMapLayers, leafsSecondMapLayers, leafsAttribute, "m2/m2")}
						<MapLegend
							style={leafsStyle}
							name={"Index listové plochy"}
							unit={<>m<sup>2</sup>/m<sup>2</sup></>}
							noData
						/>
						{dataForCharts && dataForCharts.leafs ? this.renderLeafsChart(dataForCharts) : null}
					</div>
				</div>
				{this.renderMethodology()}
			</>
		);
	}

	renderMapSet(key, firstMapLayers, secondMapLayers, valueColumnName, unit) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-map-set-container">
				<HoverHandler
					popupContentComponent={
						<MapPopup
							valueColumnName={valueColumnName}
							unit={unit}
						/>
					}
				>
					<MapSetPresentation
						activeMapKey={key}
						mapComponent={WorldWindMap}
						view={this.state.mapView}
						onViewChange={this.onMapViewChange}
						sync={{
							boxRange: true,
							center: true,
							tilt: true,
							heading: true,
							roll: true
						}}
						backgroundLayer={MapResources.cartoDbVoyagerLight}
					>
						<PresentationMap
							mapKey={key+'-map-1'}
							layers={firstMapLayers}
							onLayerClick={this.onMapClick}
						/>
						<PresentationMap
							mapKey={key+'-map-2'}
							layers={secondMapLayers}
							onLayerClick={this.onMapClick}
						/>
						<MapControlsPresentation zoomOnly/>
						<MapInfo
							cropName={selectedArea && selectedArea.properties[cropColumnName]}
							selectedAreaName={selectedArea && selectedArea.properties[nameColumnName]}
							selectedAreaClimRegion={selectedArea && selectedArea.properties[climRegionColumnName]}
						/>
						<Select
							className="tacrAgritas-map-label"
							value={this.state.selectedMapPeriod}
							optionLabel="label"
							optionValue="key"
							options={mapPeriodOptions}
							onChange={this.onMapPeriodChange}
						/>
					</MapSetPresentation>
				</HoverHandler>
			</div>
		);
	}

	renderChlorophyllChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-chart-wrapper">
				<HoverHandler
					popupContentComponent={LineChartPopup}
				>
					<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
					<LineChart
						key="chlorophyll"

						data={[data]}
						keySourcePath="ID_DPB"
						nameSourcePath="NKOD_DPB"
						serieDataSourcePath="chlorophyll"
						xSourcePath="date"
						ySourcePath="value"
						colorSourcePath="color"

						isSerie
						pointRadius={3}

						xScaleType="time"
						xValuesSize={4}
						xOptions={{
							name: "Time",
							axisValueFormat: "MMMM",
							popupValueFormat: "D. MMMM YYYY",
							min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
							max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
						}}

						yLabel
						yValuesSize={3}
						yOptions={{
							unit: "μg/cm2",
							name: "Obsah chlorofylu"
						}}
						withoutYbaseline={false}

					/>
					<p className="tacrAgritas-component-description">
						Časový vývoj obsahu chlorofylu (μg/cm<sup>2</sup>) pro vybraný zemědělský pozemek.
					</p>
				</HoverHandler>
			</div>
		);
	}

	renderWaterChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-chart-wrapper">
				<HoverHandler
					popupContentComponent={LineChartPopup}
				>
					<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
					<LineChart
						key="water"

						data={[data]}
						keySourcePath="ID_DPB"
						nameSourcePath="NKOD_DPB"
						serieDataSourcePath="water"
						xSourcePath="date"
						ySourcePath="value"
						colorSourcePath="color"

						isSerie
						pointRadius={3}

						xScaleType="time"
						xValuesSize={4}
						xOptions={{
							name: "Time",
							axisValueFormat: "MMMM",
							popupValueFormat: "D. MMMM YYYY",
							min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
							max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
						}}

						yLabel
						yValuesSize={3}
						yOptions={{
							unit: "cm",
							name: "Obsah vody"
						}}
						withoutYbaseline={false}

					/>
					<p className="tacrAgritas-component-description">
						Časový vývoj obsahu vody (cm) pro vybraný zemědělský pozemek.
					</p>
				</HoverHandler>
			</div>
		);
	}

	renderLeafsChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-chart-wrapper">
				<HoverHandler
				popupContentComponent={LineChartPopup}
				>
				<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
					<LineChart
						key="leafs"

						data={[data]}
						keySourcePath={fidColumnName}
						nameSourcePath={nameColumnName}
						serieDataSourcePath="leafs"
						xSourcePath="date"
						ySourcePath="value"
						colorSourcePath="color"

						isSerie
						pointRadius={3}

						xScaleType="time"
						xValuesSize={4}
						xOptions={{
							name: "Time",
							axisValueFormat: "MMMM",
							popupValueFormat: "D. MMMM YYYY",
							min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
							max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
						}}

						yLabel
						yValuesSize={3}
						yOptions={{
							unit: "m2/m2",
							name: "Index listové plochy"
						}}
						withoutYbaseline={false}

					/>
					<p className="tacrAgritas-component-description">
						Časový vývoj indexu listové plochy (m<sup>2</sup>/m<sup>2</sup>) pro vybraný zemědělský pozemek.
					</p>
				</HoverHandler>
			</div>
		);
	}

	renderMethodology() {
		return (
			<div className="tacrAgritas-section methodology">
				<div>
					<h3>Kvantitativní odhad biofyzikálních charakteristik porostů zemědělských plodin</h3>
					<p>Kvantitativní odhad hlavních biofyzikálních parametrů je založen na obecné skutečnosti, že biofyzikální parametry ovlivňují spektrální charakteristiky porostů sledované pomocí družicových dat. Vzájemný funkční vztah mezi spektrální signaturou a biofyzikálními parametry porostů je v případě našich produktů řešen metodou aplikace modelu přenosu záření PROSAIL (radiative transfer model). Tento koncept je založen na využití matematického modelu popisujícího přenos záření při jeho interakci s povrchem (vegetací). Výstupem modelu je simulace spektrální signatury porostu pro danou kombinaci biofyzikálních (a jiných) parametrů. Kromě vlastních biofyzikálních charakteristik porostů (jako jsou například obsahy listových pigmentů, vody a sušiny, index listové plochy aj.) bere model v potaz parametry popisující strukturu porostu (např. orientaci listoví v prostoru), vliv geometrie pořízení obrazových dat (např. poloha Slunce, směr pohledu senzoru apod.) a vliv spektrálních charakteristik půdy. Hlavní výhodou využití konceptu modelu přenosu záření je skutečnost, že pomocí něj můžeme nasimulovat spektrální signatury porostů pro velké rozsahy hodnot jednotlivých vstupních parametrů, jejichž pokrytí reálným pozemním vzorkováním by bylo prakticky nerealizovatelné. Ačkoliv je model přenosu záření založen na obecných fyzikálních zákonech, je nejprve nutné jej parametrizovat („zkalibrovat“) tak, aby výsledné simulace byly realistické. V případě našich produktů je optimalizace použitého modelu provedena specificky pro každou zájmovou plodinu. Tím je zajištěn nejlepší možný soulad modelovaných hodnot s realitou.</p>
					<p>
						Vlastní odhad jednotlivých biofyzikálních parametrů je následně realizován s využitím nástrojů tzv. strojového učení (machine learning) jejichž „učení“ probíhá pomocí databáze nasimulovaných spektrálních signatur jednotlivých plodin, po němž je algoritmus aplikován na reálná data Sentinel-2. Finálním výstupem výše popsaného procesu je kvantitativní odhad tří hlavní biofyzikálních parametrů porostů: obsah chlorofylu (C<sub>ab</sub>) vyjádřený v μg/cm<sup>2</sup>, obsah vody (C<sub>w</sub>) vyjádřený jako tzv. Equivalent Water Thickness (tloušťka vrstvy, která by vznikla rozprostřením veškeré obsažené vody po ploše listu) v cm a index listové plochy (LAI), který je bezrozměrnou jednotkou a vyjadřuje podíl plochy listoví porostu vůči jednotkové ploše povrchu.
					</p>
					<p>
						Kromě základního výstupu zobrazujícího odhadované hodnoty jednotlivých parametrů v původních fyzikálních jednotkách je současně vytvořena i mapa tzv. management zón, sdružujících vždy části porostu s podobnými vlastnostmi. Oproti obdobným řešením založeným na analýze jednoduchých vegetačních indexů (např. NDVI) je zde výhoda především v tom, že případné rozdíly v charakteru porostu v dílčích částech pozemku je možné přesněji specifikovat. Zařazení do určité management zóny zohledňuje aktuálně pěstovanou plodinu, klimatický region, do kterého daný pozemek spadá, a datum, ke němž je výsledek analýzy vztažen. Rozsahy hodnot jednotlivých parametrů jsou pro dílčí management zóny odvozeny ze statistické analýzy 4333 zemědělských pozemků z let 2016 – 2019 a představují kvantily (Q<sub>0.25</sub>, Q<sub>0.50</sub> a Q<sub>0.75</sub>) hodnot daného biofyzikálního parametru pro danou plodinu, klimatický region a datum. Zóna 1 tak představuje hodnoty spadající mezi 25 % nejnižších hodnot pro danou plodinu, klimatický region a čas, zatímco zóna 4 analogicky zahrnuje hodnoty spadající mezi 25 % nejvyšších hodnot pro danou plodinu, klimatický region a čas.
					</p>
				</div>
			</div>
		);
	}

	getMapLayers(style) {
		return [
			{
				key: "test",
				layerKey: "test",
				type: "vector",
				opacity: 0.7,

				options: {
					features: this.props.data,
					style: style.data.definition,
					hovered: {
						style: hoveredStyleDefinition
					},
					selected: {
						'test': {
							style: selectedStyleDefinition,
							keys: [this.state.activeDpbKey],
						}
					},
					fidColumnName
				}
			}
		]
	}

	prepareDataForCharts() {
		let chlorophyll = [];
		let water = [];
		let leafs = [];

		let feature = this.getSelectedAreaData();

		if (feature) {
			_.forIn(feature.properties, (value, key) => {
				let attributeParts = key.split("_");
				let attribute = attributeParts[0];

				if (attribute.length === 5) {
					const attributeCode = attribute.substring(0,1);
					const dateCode = attribute.substring(1,5);
					const dateCodeNumber = Number(attribute.substring(1,5));

					if (!_.isNaN(dateCodeNumber)) {
						const day = dateCode.substring(2,4);
						const month = dateCode.substring(0,2);
						const date = moment(`${this.props.activePeriodKey}-${month}-${day}`).toISOString();

						const dateEndCode = attributeParts[1];
						const dayEnd = dateEndCode.substring(2,4);
						const monthEnd = dateEndCode.substring(0,2);
						const dateEnd = moment(`${this.props.activePeriodKey}-${monthEnd}-${dayEnd}`).toISOString();

						const record = {date, dateEnd, value};

						if (value) {
							if (attributeCode === "C") {
								chlorophyll.push(record);
							} else if (attributeCode === "W") {
								water.push(record);
							} else if (attributeCode === "L") {
								leafs.push(record);
							}
						}
					}
				}
			});

			return {...feature.properties, chlorophyll, water, leafs, color: "#ff00ff"};
		} else {
			return null;
		}
	}

	getSelectedAreaData() {
		return _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
	}
}

export default Biofyzika;
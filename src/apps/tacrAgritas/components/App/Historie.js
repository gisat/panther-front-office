import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import MapResources, {
	climRegionColumnName,
	cropColumnName,
	fidColumnName,
	mapPeriodOptionsHistorie,
	nameColumnName
} from "../../constants/MapResources";

import {outlinesStyle, hoveredStyleDefinition, selectedStyleDefinition} from "../../constants/MapStyles";
import {MapLegend} from "../MapLegend";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import {MapPopup} from "../MapPopup";
import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import {MapInfo} from "../MapInfo";
import Select from "../../../../components/common/atoms/Select/Select";
import utils from "../../utils";
import moment from "moment";
import {LineChartPopup} from "../LineChartPopup";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import Fade from "react-reveal/Fade";

import image1 from "../../assets/img/dlouhodoby_normal_figure1.png";


const getChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,50],
					"intervalBounds": [false, false],
					"fill": "#ff0000"
				},
				{
					"interval": [50,70],
					"intervalBounds": [true, false],
					"fill": "#ff8888"
				},
				{
					"interval": [70,90],
					"intervalBounds": [true, false],
					"fill": "#ffaa00"
				},
				{
					"interval": [90,110],
					"intervalBounds": [true, false],
					"fill": "#ffff00"
				},
				{
					"interval": [110,130],
					"intervalBounds": [true, false],
					"fill": "#b0e000"
				},
				{
					"interval": [130,150],
					"intervalBounds": [true, false],
					"fill": "#6fc400"
				},
				{
					"interval": [150,300],
					"intervalBounds": [true, false],
					"fill": "#38a800"
				}
			]
		}
	)
};

class Historie extends React.PureComponent {
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
			selectedMapPeriod: mapPeriodOptionsHistorie[3]
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

		let attribute = "P" + this.state.selectedMapPeriod.key;
		let mapChoroplethStyle = getChoroplethStyle(attribute);


		let mapLayers = [];

		if (this.state.activeDpbKey) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			mapLayers = this.getMapLayers(mapChoroplethStyle);
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<div>
						<h1>{props.scope && props.scope.data.nameDisplay}</h1>
						<div className="tacrAgritas-section-subtitle">Srovnání aktuálního stavu zemědělský porostů s dlouhodobým normálem (1985 - 2015)</div>
						<p>Srovnání aktuálního stavu s dlouhodobým normálem je založeno na zpracování dlouhodobé časové řady družicových dat Landsat, obsahující přibližně 8500 scén pořízených v průběhu období 1985 – 2015. Analýzou těchto družicových snímků byly stanoveny tzv. normálové křivky popisující obvyklý časový vývoj hodnot vegetačního indexu NDVI pro různé zemědělské plodiny za daných klimatických podmínek. Aktuální hodnoty vegetačního indexu NDVI (zjištěné pomocí družicových dat pořízených v průběhu aktuální vegetační sezóny) jsou potom srovnávány s hodnotou dlouhodobého normálu (pro danou plodinu, termín a klimatický region). Výsledek je vyjádřen jako procentuální podíl aktuální hodnoty ku hodnotě dlouhodobého normálu (tj. 100 % = aktuální hodnota je právě rovna hodnotě dlouhodobého normálu pro danou plodinu, termín a klimatický region). Srovnání aktuálního stavu s dlouhodobým normálem je pak realizováno průběžně vždy 2x do měsíce (1. – 15. a 16. – 30./31. dne v daném měsíci). Výsledky jsou v tomto případě agregovány na úroveň jednotlivých zemědělských pozemků.</p>

						{this.renderMapSet('map-set-historie', mapLayers, attribute, "%")}
						<MapLegend
							style={mapChoroplethStyle}
							name={"Aktuální hodnota NDVI vs. dlouhodobý normál"}
							unit={"%"}
							noData
						/>
						{dataForCharts ? this.renderChart(dataForCharts) : null}
						<p>Určení referenčních normálových křivek vegetačního indexu NDVI pro jednotlivé zemědělské plodiny a klimatické regiony bylo založeno na zpracování kompletního archivu družicových dat Landsat pro Českou republiku. Toto zpracování zahrnovalo celkem přibližně 8500 scén pořízených v období mezi roky 1985 – 2015. V první fázi zpracování byly na podkladě těchto scén vytvořeny plodinové mapy pro všechny vegetační sezóny uvedeného období 1985 – 2015. Provádění analýzy časového průběhu hodnot vegetačního indexu specificky pro jednotlivé plodiny je zcela klíčové, vzhledem k odlišnostem v časovém vývoji jednotlivých plodin (např. ozimé obiloviny ve srovnání s cukrovkou apod.). Ze sérií družicových dat byly následně pro jednotlivé kombinace plodina – klimatický region extrahovány temporální profily indexu NDVI (popisující vývoj hodnot tohoto indexu v čase). Tyto křivky pak byly převedeny do jednotného časového měřítka (uvažována byla agregace dat do 15-denních intervalů). Z dílčích křivek potom byla vygenerována tzv. normálová křivka popisující z dlouhodobého hlediska obvyklý průběh hodnot indexu NDVI pro danou plodinu a klimatický region. Klimatické regiony, uvažované v rámci této analýzy, vycházejí z regionalizace používané v systému bonitovaných půdně-ekologických jednotek (BPEJ).</p>
						<p>V další fázi jsou hodnoty NDVI průběžně extrahovány z družicových dat pořízených v průběhu aktuální vegetační sezóny (opět vždy v 15-denních monitorovacích oknech). Aby byla maximalizována pravděpodobnost, že analyzovaný pozemek bude v rámci daného monitorovacích období zachycen bez oblačnosti, jsou pro sledování aktuálních hodnot indexu NDVI využívána nejen družicová data Landsat, ale současně i Sentinel-2. S ohledem na poněkud odlišné radiometrické charakteristiky senzorů OLI (Landsat-8) a MSI (Sentinel-2) je v tomto případě ovšem nutné na data Sentinel-2 nejprve aplikovat proces radiometrické harmonizace, díky němuž jsou hodnoty indexu NDVI odvozené z dat Sentinel-2 a Landsat-8 navzájem srovnatelné. Aktuální hodnoty indexu NDVI jsou v následujícím kroku srovnávány s hodnotou odvozenou z normálové křivky pro danou plodinu a daný klimatický region. Výsledný mapový produkt tak vyjadřuje procentuální úroveň aktuální hodnoty indexu NDVI vůči normálové hodnotě (100 %). Srovnání aktuálního vývoje s dlouhodobým normálem je možné pro jednotlivé zemědělské parcely vyjádřit rovněž v podobě grafu zobrazujícím průběh aktuální temporální křivky indexu NDVI a jeho srovnání s průběhem křivky normálové.</p>
						<p>V další fázi jsou hodnoty NDVI průběžně extrahovány z družicových dat pořízených v průběhu aktuální vegetační sezóny (opět vždy v 15-denních monitorovacích oknech). Aby byla maximalizována pravděpodobnost, že analyzovaný pozemek bude v rámci daného monitorovacích období zachycen bez oblačnosti, jsou pro sledování aktuálních hodnot indexu NDVI využívána nejen družicová data Landsat, ale současně i Sentinel-2. S ohledem na poněkud odlišné radiometrické charakteristiky senzorů OLI (Landsat-8) a MSI (Sentinel-2) je v tomto případě ovšem nutné na data Sentinel-2 nejprve aplikovat proces radiometrické harmonizace, díky němuž jsou hodnoty indexu NDVI odvozené z dat Sentinel-2 a Landsat-8 navzájem srovnatelné. Aktuální hodnoty indexu NDVI jsou v následujícím kroku srovnávány s hodnotou odvozenou z normálové křivky pro danou plodinu a daný klimatický region. Výsledný mapový produkt tak vyjadřuje procentuální úroveň aktuální hodnoty indexu NDVI vůči normálové hodnotě (100 %). Srovnání aktuálního vývoje s dlouhodobým normálem je možné pro jednotlivé zemědělské parcely vyjádřit rovněž v podobě grafu zobrazujícím průběh aktuální temporální křivky indexu NDVI a jeho srovnání s průběhem křivky normálové.</p>
					</div>
				</div>
				<Fade left distance="50px">
					<div className="tacrAgritas-image">
						<img src={image1}/>
						<p className="tacrAgritas-component-description">
							Ukázka srovnání aktuálního stavu porostu ozimé pšenice (A) a jarního ječmene (B) vzhledem k dlouhodobému normálu (1985 - 2015). Po rychlém nárůstu na počátku vegetační sezóny, který byl dán zejména neobvykle teplým počasím v dubnu (vývoj některých plodin byl urychlen o 30 – 40 dní), začal vlivem nastupujícího sucha stav porostů v polovině května stagnovat a v průběhu června klesl až k podprůměrným hodnotám.
						</p>
					</div>
				</Fade>
			</>
		);
	}

	renderMapSet(key, layers, valueColumnName, unit) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<Fade left distance="50px">
				<div className="tacrAgritas-map-set-container single-map">
					<HoverHandler
						popupContentComponent={
							<MapPopup
								valueColumnName={valueColumnName}
								unit={unit}
							/>
						}>
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
								layers={layers}
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
								options={mapPeriodOptionsHistorie}
								onChange={this.onMapPeriodChange}
							/>
						</MapSetPresentation>
					</HoverHandler>
				</div>
			</Fade>
		);
	}

	renderChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-chart-wrapper">
				<HoverHandler
					popupContentComponent={LineChartPopup}
				>
					<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
					<LineChart
						key="history"

						data={data}
						keySourcePath="key"
						nameSourcePath="name"
						serieDataSourcePath="data"
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
							name: "NDVI"
						}}
						withoutYbaseline={false}
						legend
					/>
				</HoverHandler>
			</div>
		);
	}

	getSelectedAreaData() {
		return _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
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
		let history = [];
		let current = [];

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
							if (attributeCode === "R") {
								history.push(record);
							} else if (attributeCode === "C") {
								current.push(record);
							}
						}
					}
				}
			});

			return [
				{
					...feature.properties,
					key: "history",
					name: "Dlouhodobý normál",
					data: history,
					color: "#aaaaaa"

				},{
					...feature.properties,
					key: "current",
					name: "Aktuální hodnota",
					data: current,
					color: "#ff00ff"

				}
			];
		} else {
			return null;
		}
	}
}

export default Historie;
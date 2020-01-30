import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import MapResources, {
	climRegionColumnName,
	cropColumnName,
	fidColumnName, fenologyOptions,
	nameColumnName
} from "../../constants/MapResources";
import {outlinesStyle, hoveredStyleDefinition, selectedStyleDefinition} from "../../constants/MapStyles";
import phenology from "../../assets/img/phenology.png";
import productivity from "../../assets/img/productivity.png";
import Fade from "react-reveal/Fade";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import {MapPopup} from "../MapPopup";
import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import {MapInfo} from "../MapInfo";
import Select from "../../../../components/common/atoms/Select/Select";
import {MapLegend} from "../MapLegend";
import HorizontalBarInfoGraphic from "../HorizontalBarInfoGraphic";

class Produktivita extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpbKey: props.data && props.data[0].properties[fidColumnName],
			mapView: props.activePlaceView,
			selectedAttribute: fenologyOptions[0]
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onAttributeChange = this.onAttributeChange.bind(this);
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

	onAttributeChange(option) {
		this.setState({
			selectedAttribute: option
		});
	}

	render() {
		const props = this.props;
		const selectedArea = this.getSelectedAreaData();
		let selectedAttribute = this.state.selectedAttribute;
		let layers = [];
		let dataForChart = null;

		if (this.props.data && this.state.selectedAttribute) {
			layers = this.getMapLayers(selectedAttribute.style);
		}

		if (this.props.data && this.state.activeDpbKey) {
			dataForChart = this.getDataForChart();
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<div>
						<h1>Fenologické a produkční charakteristiky porostů zemědělský plodin</h1>
						<p>
							Fenologie se zabývá popisem časového průběhu životních projevů rostlin (a živočichů). Jejím cílem je především určení termínů periodicky se opakujících stavů (tzv. fenofází), jakými je v případě rostlin například kvetení či senescence. I když většinu projevů monitorovaných v rámci pozemních fenologických pozorování nelze přímo zachytit pomocí dat dálkového průzkumu, přesto lze na základě zpracování časových řad družicových snímků získat mnoho důležitých informací popisujících časový vývoj rostlinného porostu (např. termíny začátku, konce a vrcholu vegetační sezóny, délku vegetační sezóny apod.). Vývoj vegetace v čase pak současně souvisí i s celkovou produktivitou porostu.
						</p>
						<p>
							Mapové vrstvy představují hodnoty celkem 14 různých fenologických charakteristik, odvozených pomocí matematické analýzy časového vývoje hodnot vegetačních indexů NDVI a NRERI získaných z družicových dat Sentinel-2. Tyto hodnoty jsou prezentovány jak v rastrové podobě (tj. na úrovni pixelu), tak jako hodnoty agregované na úroveň jednotlivých zemědělských pozemků. Obdobně je pak určeno celkem 6 indikátorů produktivity porostů.
						</p>

						<Fade left distance="50px">
							<div className="tacrAgritas-map-set-container single-map">
								<HoverHandler
									popupContentComponent={
										<MapPopup
											valueColumnName={selectedAttribute && selectedAttribute.key}
											unit={selectedAttribute && selectedAttribute.unit}
										/>
									}
								>
									<MapSetPresentation
										activeMapKey={"productivity-map-set"}
										mapComponent={WorldWindMap}
										view={this.state.mapView}
										onViewChange={this.onMapViewChange}
										backgroundLayer={MapResources.cartoDbVoyagerLight}
									>
										<PresentationMap
											mapKey={'map-1'}
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
											className="tacrAgritas-map-label wide"
											value={this.state.selectedAttribute}
											optionLabel="longName"
											optionValue="key"
											options={fenologyOptions}
											onChange={this.onAttributeChange}
										/>
									</MapSetPresentation>
								</HoverHandler>
							</div>
						</Fade>
						<MapLegend
							style={selectedAttribute && selectedAttribute.style}
							name={selectedAttribute && selectedAttribute.name}
							unit={selectedAttribute && selectedAttribute.unit}
							noData
						/>
						{dataForChart ? this.renderChart(dataForChart) : null}
					</div>
				</div>

				<div className="tacrAgritas-section">
					<div>
						<h2>Popis fenologických charakteristik</h2>
						<div className="tacrAgritas-fenology-list">
							<div className="tacrAgritas-fenology-list-item">
								<div>SOS (A)</div>
								<div>Datum začátku vegetační sezóny vyjádřené v DOY</div>
							</div>

							<div className="tacrAgritas-fenology-list-item">
								<div>EOS (B)</div>
								<div>Datum konce vegetační sezóny vyjádřené v DOY</div>
							</div>

							<div className="tacrAgritas-fenology-list-item">
								<div>LOS_GRW (C)</div>
								<div>Délka růstové fáze vegetační sezóny vyjádřená ve dnech (doba od začátku do vrcholu vegetační sezóny)</div>
							</div>

							<div className="tacrAgritas-fenology-list-item">
								<div>LOS_SEN (D)</div>
								<div>Délka senescenční fáze vegetační sezóny vyjádřená ve dnech (doba od vrcholu do konce vegetační sezóny) </div>
							</div>

							...TODO

							<Fade left distance="50px">
								<div className="tacrAgritas-image">
									<img style={{padding: '1rem'}} src={phenology}/>
									<p className="tacrAgritas-component-description">Pozn.: DOY = Day Of Year, tj. pořadové číslo dne v daném roce. 1.1. = DOY 1, 2.1. = DOY 2…31.12. = DOY 365 (v nepřestupném roce)</p>
								</div>
							</Fade>
						</div>

						<h2>Popis produkčních charakteristik</h2>

						...TODO

						<Fade left distance="50px">
							<div className="tacrAgritas-image">
								<img style={{padding: '1rem'}} src={productivity}/>
								<p className="tacrAgritas-component-description">Pozn.: indikátor hrubé produkce koreluje s celkovým množstvím biomasy porostu, zatímco indikátor čisté produkce bere v potaz pouze nárůst biomasy nad úroveň báze na začátku vegetační sezóny. Ani v jednom případě se však nejedná o kvantitativní odhad tzv. hrubé primární produkce (gross primary production - GPP) či čisté primární produkce (net primary production - NPP). </p>
							</div>
						</Fade>
					</div>
				</div>
			</>
		);
	}

	renderChart(data) {
		return (
			<div className="tacrAgritas-fenology-chart">
				{data.map((item, index) => {
					return (
						<HorizontalBarInfoGraphic
							key={index}
							name={item.longName}
							unit={item.unit}
							min={item.min}
							max={item.max}
							mean={item.mean}
							value={item.currentValue}
						/>
					);
				})}
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

	getDataForChart() {
		const selectedAreaData = this.getSelectedAreaData();

		if (selectedAreaData) {
			return fenologyOptions.map(option => {
				let attributeValues = this.props.data.map(item => {
					return item.properties[option.key];
				});

				let sortedValues = _.sortBy(attributeValues);

				return {
					...option,
					min: sortedValues[0],
					max: sortedValues[sortedValues.length -1],
					mean: sortedValues[Math.floor(sortedValues.length/2)],
					currentValue: selectedAreaData.properties[option.key]
				}
			});
		} else {
			return null;
		}
	}
}

export default Produktivita;
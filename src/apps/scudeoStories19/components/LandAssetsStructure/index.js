import React from 'react';
import Fade from "react-reveal/Fade";

import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import SankeyChart from "../../../../components/common/charts/SankeyChart/SankeyChart";
import Select from "../../../../components/common/atoms/Select/Select";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";
import conversions from "../../data/conversions";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";

import {Footer, Visualization} from '../Page';
import {Header} from "../Page";

import {
	getMergedDataset,
	clearEmptyNodes,
	classesL3,
	classesL4,
	colors,
	classesLCF1,
	classesLCFG,
	getVectorLayer
} from '../../data/data';

import './styles/style.scss';
import fetch from "isomorphic-fetch";
import _ from "lodash";
import Expandable from "../Expandable";
import MapSet, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";

// LULC Level III
const URBAN_FABRIC_KEYS = ["11100", "11200"];

// LULC Level IV
const URBAN_FABRIC_DISCONTINUOUS_KEYS = ["11210", "11220", "11221", "11222", "11240", "11300"]
const URBAN_FABRIC_CONTINUOUS_KEYS = ["11100"]

//urban densifications
//l4
const URBAN_DENSIFICATION_SOURCE_KEYS = ["11210", "11220", "11221","11222", "11240", "11300", "13100", "13300", "13310","13400", "14100", "14200", "14210","14220", "14230", "14300"];
const URBAN_DENSIFICATION_TARGET_KEYS = ["11100", "11210", "11220","11221", "11222", "11240", "11300", "12110", "12111","12112","12120","12121","12122","12123","12124","12125","12126","12127","12128","12130","12131","12132","12133", "12210","12211","12212","12220", "12300", "12400"];
//l3
const URBAN_DENSIFICATION_SOURCE_KEYS_l3 = ["11200","13100","13300","13400","14100","14200","14300"];
const URBAN_DENSIFICATION_TARGET_KEYS_l3 = ["11100","11200","12100","12200","12300","12400"];

//urban expansions
//l4
const URBAN_EXPANSIONS_SOURCE_KEYS = ["20000", "21000", "31000", "32000", "33000", "40000", "51000", "52000"];
const URBAN_EXPANSIONS_TARGET_KEYS = ["11100", "11210", "11220","11221", "11222", "11240", "11300", "12110", "12111","12112","12120","12121","12122","12123","12124","12125","12126","12127","12128","12130","12131","12132","12133", "12210","12211","12212","12220", "12300", "12400", "13100", "13300", "13310", "13400", "14100", "14110", "14200", "14210", "14220", "14230", "14300"];
//l3
const URBAN_EXPANSIONS_SOURCE_KEYS_l3 = ["20000","31000","32000","33000","40000","51000","52000"];
const URBAN_EXPANSIONS_TARGET_KEYS_l3 = ["11100","11200","12100","12200","12300","12400","13100","13300","13400","14100","14200","14300",];

const filterUrbanExpansion = (dataset) => {
	const links = dataset.links.filter(l => {
		const sourceId = l.source.id || l.source;
		const targetId = l.source.id || l.target;
		const sourceFromCONSUMPTION = URBAN_EXPANSIONS_SOURCE_KEYS.includes(sourceId.split("_")[0]);
		const targetToFORMATION = URBAN_EXPANSIONS_TARGET_KEYS.includes(targetId.split("_")[0]);
		return sourceFromCONSUMPTION && targetToFORMATION;
	})
	const nodes = [...dataset.nodes];
	const nonEmptyNodes = clearEmptyNodes(nodes, links);
	return {
		nodes: nonEmptyNodes,
		links,
	};
}

const filterUrbanDensifications = (dataset) => {
	const links = dataset.links.filter(l => {
		const sourceId = l.source.id || l.source;
		const targetId = l.source.id || l.target;
		const sourceFromDISCONTINUOUS = URBAN_DENSIFICATION_SOURCE_KEYS.includes(sourceId.split("_")[0]);
		const targetToCONTINUOUS = URBAN_DENSIFICATION_TARGET_KEYS.includes(targetId.split("_")[0]);
		return sourceFromDISCONTINUOUS && targetToCONTINUOUS;
	})
	const nodes = [...dataset.nodes];
	const nonEmptyNodes = clearEmptyNodes(nodes, links);
	return {
		nodes: nonEmptyNodes,
		links,
	};
}


const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
	}
};
const lulcFirstYearStructureLayer = {
	name: 'Data layer',
	key: 'lulcFirstYearStructureLayer',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params: {
			layers: 'scudeo_lulc_first_year',
			styles: '',
		},
	}
};

const lulcLastYearStructureLayer = {
	name: 'Data layer',
	key: 'lulcLastYearStructureLayer',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params: {
			layers: 'scudeo_lulc_second_year',
			styles: '',
		},
	}
};

const lulcLastYearChangeStructureLayer = {
	name: 'Data layer',
	key: 'lulcLastYearChangeStructureLayer',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params: {
			layers: 'scudeo_change_lcf2',
			styles: '',
		},
	}
};

const getClassPercentagePropertyKey = (classId, year) => `lulc_l3_${year}_${classId}_percentage`
const getLCFGClassPropertyKey = (classId, yearFirst, yearLast) => `lcfg_${yearFirst}_${yearLast}_${classId}_percentage`
const getLCF1ClassPropertyKey = (classId, yearFirst, yearLast) => `lcf1_${yearFirst}_${yearLast}_${classId}_percentage`
const getCoverageLCFGClassPropertyKey = (classId, yearFirst, yearLast) => `lcfg_${yearFirst}_${yearLast}_${classId}_coverage`
const getCoverageLCF1ClassPropertyKey = (classId, yearFirst, yearLast) => `lcf1_${yearFirst}_${yearLast}_${classId}_coverage`
const getClassCoveragePropertyKey = (classId, year) => `lulc_l3_${year}_${classId}_coverage`

const LULCStructureDataset = [];
const changesStructure = [];
const differenceStructure = [];

const prepareData = (dataset) => {
	dataset.forEach((dataSet) => {
		//LULCStructureDataset
		const avarageData = {
			data: {}
		};

		const changes = {
			data: {},
			sum: 0,
		};

		const difference = {
			data: {},
			sum: 0,
		};

		for (const [classId, className] of Object.entries(classesL3)) {
			const percentageKey = getClassPercentagePropertyKey(classId, dataSet.lastYear);
			avarageData.data[classId] = dataSet.data.features[0].properties[percentageKey];

			//change
			const coverageKeyFirst = getClassCoveragePropertyKey(classId, dataSet.firstYear);
			const coverageFirst = dataSet.data.features[0].properties[coverageKeyFirst];
			const coverageKeyLast = getClassCoveragePropertyKey(classId, dataSet.lastYear);
			const coverageLast = dataSet.data.features[0].properties[coverageKeyLast];
			// const changeCoverageKey = getClassCoveragePropertyKey(classId, dataSet.firstYear, dataSet.lastYear);

			const change = (coverageLast - coverageFirst) / (dataSet.data.features[0].properties.area / 100)
			difference.data[classId] = isNaN(change) ? 0 : change;
		}

		for (const [classId, className] of Object.entries(classesLCF1)) {
			// const percentageKey = getClassPercentagePropertyKey(classId, dataSet.lastYear);
			const changeKey = getLCF1ClassPropertyKey(classId, dataSet.firstYear, dataSet.lastYear);
			const coverageChangeKey = getCoverageLCF1ClassPropertyKey(classId, dataSet.firstYear, dataSet.lastYear);
			changes.data[classId] = dataSet.data.features[0].properties[changeKey];
			changes.data[`${classId}_coverage`] = conversions.toSquareKm(dataSet.data.features[0].properties[coverageChangeKey]);
		}
		for (const [classId, className] of Object.entries(classesLCFG)) {
			// const percentageKey = getClassPercentagePropertyKey(classId, dataSet.lastYear);
			const changeKey = getLCFGClassPropertyKey(classId, dataSet.firstYear, dataSet.lastYear);
			const coverageChangeKey = getCoverageLCFGClassPropertyKey(classId, dataSet.firstYear, dataSet.lastYear);
			changes.data[classId] = dataSet.data.features[0].properties[changeKey];
			changes.data[`${classId}_coverage`] = conversions.toSquareKm(dataSet.data.features[0].properties[coverageChangeKey]);
		}


		avarageData.AL3_NAME = dataSet.name;
		avarageData.AL3_ID = dataSet.key;
		LULCStructureDataset.push(avarageData);

		changes.AL3_NAME = dataSet.name;
		changes.AL3_ID = dataSet.key;

		// for(const [key, value] of Object.entries(changes.data)){
		// 	changes.sum += Math.abs(value);
		// }


		difference.AL3_NAME = dataSet.name;
		difference.AL3_ID = dataSet.key;
		differenceStructure.push(difference);

		changesStructure.push(changes);
	});
}


const pathLULCStructureYSourcePath = [];
for (const [classId, className] of Object.entries(classesL3)) {
	const valuePath = `data.${classId}`;
	pathLULCStructureYSourcePath.push({
		path: valuePath,
		name: className,
		color: colors[classId],
	})
}

const pathLULCStructureAreasYSourcePath = [];
for (const [classId, className] of Object.entries({...classesLCF1, ...classesLCFG})) {
	const valuePath = `data.${classId}_coverage`;
	pathLULCStructureAreasYSourcePath.push({
		path: valuePath,
		name: className,
		color: colors[classId],
	})
}

const pathLULCChangesStructureYSourcePath = [];
for (const [classId, className] of Object.entries({...classesLCF1, ...classesLCFG})) {
	const valuePath = `data.${classId}`;
	pathLULCChangesStructureYSourcePath.push({
		path: valuePath,
		name: className,
		color: colors[classId],
	})
}

const pathchangesStructureYSourcePath = [];
for (const [classId, className] of Object.entries(classesL3)) {
	const valuePath = `data.${classId}`;
	pathchangesStructureYSourcePath.push({
		path: valuePath,
		name: className,
		color: colors[classId],
	})
}

class LandAssetsStructure extends React.PureComponent {
	static propTypes = {};

	constructor(props) {
		super(props);

		this.state = {
			dataset: null,
			cityOne: null,
			loading: true,
			vectorLayer: null,
			landUseMapLegendData: null,
			changeMapLegendData: null,
			cityYear: null,
			cityYears: [],
		};
	}

	componentDidMount() {
		getMergedDataset().then((dataset) => {
			const vectorLayer = getVectorLayer(dataset);
			prepareData(dataset);
			this.setState({
				dataset,
				loading: false,
				cityOne: dataset[0],
				vectorLayer,
				cityYear: {
					key: dataset[0].firstYear,
					name: dataset[0].firstYear,
				},
				cityYears: [
					{
						key: dataset[0].firstYear,
						name: dataset[0].firstYear,
					},
					{
						key: dataset[0].lastYear,
						name: dataset[0].lastYear,
					}
				]

			});
		});

		this.loadLegendData(lulcFirstYearStructureLayer, 'landUseMapLegendData');
		this.loadLegendData(lulcLastYearChangeStructureLayer, 'changeMapLegendData');
	}


	onCityChange(city, data) {
		this.setState({
			[city]: data,
			cityYear: {
				key: data.firstYear,
				name: data.firstYear,
			},
			cityYears: [
				{
					key: data.firstYear,
					name: data.firstYear,
				},
				{
					key: data.lastYear,
					name: data.lastYear,
				}
			]
		});
	}

	onSelectedYearChanged(cityYear) {
		this.setState({
			cityYear
		});
	}

	loadLegendData(source, stateProp) {
		// Get legend for change map
		fetch(source.options.url + 'service=WMS&request=GetLegendGraphic&layer=' + source.options.params.layers + '&FORMAT=application/json', {
			method: 'GET'
		}).then(response => {
			let contentType = response.headers.get('Content-type');
			if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
				response.json().then(data => {
					let rules = _.get(data, 'Legend[0].rules');
					if (rules) {
						this.setState({
							[stateProp]: rules.map(rule => {
								return {
									label: rule.name,
									color: _.get(rule, 'symbolizers[0].Polygon.fill'),
									graphicFill: _.get(rule, 'symbolizers[0].Polygon.graphic-fill')
								}
							})
						});
					}
				});
			} else {
				console.warn('Legend request error');
			}
		});
	}

	renderMapLegend(data) {
		return data.map((item, index) => {
			return (
				<div className="legend-field" key={index}>
					{item.color ?
						(<div className="legend-color" style={{background: item.color}}></div>) :
						(item.graphicFill ?
							<div className="legend-image"
								 style={{backgroundImage: `url(${item.graphicFill.url})`, backgroundColor: '#333'}}></div>

							: null)
					}
					<div className="legend-value">{item.label}</div>
				</div>
			);
		});
	}

	render() {
		let firstYearStructureLayers = null;
		let lastYearStructureLayers = null;
		let firstYearChangeStructureLayers = null;
		let lastYearChangeStructureLayers = null;

		let densificationsData = null;
		let densificationsDataEmpty = null;

		let expansionData = null;
		let expansionDataEmpty = null;

		if (this.state.cityOne) {
			firstYearStructureLayers = [lulcFirstYearStructureLayer, this.state.vectorLayer];
			lastYearStructureLayers = [lulcLastYearStructureLayer, this.state.vectorLayer];

			const selectedCityIndex = this.state.cityYears.findIndex((c) => c.key === this.state.cityYear.key);
			if(selectedCityIndex === 0) {
				firstYearChangeStructureLayers = [lulcFirstYearStructureLayer, this.state.vectorLayer];
			} else if(selectedCityIndex === 1) {
				firstYearChangeStructureLayers = [lulcLastYearStructureLayer, this.state.vectorLayer];
			}
			lastYearChangeStructureLayers = [lulcLastYearChangeStructureLayer, this.state.vectorLayer];

			densificationsData = filterUrbanDensifications(this.state.cityOne.l4OverallFlowsCoverage);
			densificationsDataEmpty = densificationsData.nodes.length === 0 && densificationsData.links.length === 0;

			expansionData = filterUrbanExpansion(this.state.cityOne.l4OverallFlowsCoverage);
			expansionDataEmpty = expansionData.nodes.length === 0 && expansionData.links.length === 0;


		}


		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="City Land Assets Structure and Evolution"
					intro="Earth Observation data can provide insight into Land Use and Land Cover (LULC) assets structure and evaluate quantity and quality of LULC changes"
					abstract="Land is a non-renewable resource and its quantity and quality play a vital role in the development of a city. Land structure and spatial-temporal patterns to a large extent influence city livability and resilience as well as determine physical constraints, opportunities and potential for further development."
				/>

				{
					this.state.cityOne ?
						<div className="scudeoStories19-content">
							<section>
								<p>As cities strive to become centers of global production, trade and development, they are increasingly concerned with improving their attractiveness for foreign direct investment and employment generation. This includes efficient spatial structures, adequate infrastructure and urban services, affordable housing and healthy environments. Effective urban land assets management is required to promote urban regeneration and development of new industrial and commercial districts, investments to upgrade and expansion of critical infrastructure, programs to enhance and protect the environment, and initiatives to upgrade social capital (housing, education, healthcare).</p>
								<p>An important characteristic of land is that it is fixed in supply. More land cannot be produced in response to greater demand for it, still land quality can be changed as well as its actual use and cover.</p>
								<p> Satellite imagery can be used to provide an up-to-date picture of the state of land, its cover and its use on a large scale. Land cover indicates the physical land type such as forest or open water whereas land use documents how people are using the land. Repeated satellite acquisition allows for a changing picture of the urban environment to be created which is essential for land assets monitoring, management and planning purposes. The ability of remote sensing to contribute to the mandate of planners and managers has changed significantly over the last decade. Satellite data are now available that can be used to map and monitor change from continental to local scales and over daily to decades temporal scales. Similarly, advances in image processing, database management and spatial analysis and visualisation tools have enhanced our ability to analyse these data for depicting land cover and land use change. Examples below show such fundamental analysis for selected cities using LULC service provided by EO4SD Urban project, supported by European Space Agency. </p>
								<Select
									className={"scudeoStories19-city-select"}
									onChange={this.onCityChange.bind(this, 'cityOne')}
									options={this.state.dataset}
									optionLabel="name"
									optionValue="key"
									value={this.state.cityOne}
									menuPortalTarget={this.props.pageKey}
								/>

								<p>Distribution and the spatial composition of LULC classes for two reference years is presented in the maps below. Pick the city from the pull-down menu on the top to display the maps for respective city.</p>


								<Fade left distance="50px">
									<Visualization
										title="Land Cover Land Use Structure"
										description="Interactive maps above provide an overview of the spatial composition of LULC classes for a selected city for two reference years. Thus, an amount, spatial distribution and typology of LULC changes within the observed period can be identified and related statistics derived as seen on graphs below. In addition, due to the standard service specification used, results can be compared with the same information from other cities."
										legend={
											<Expandable>
												<div className="scudeoStories19-visualization-legend"
													 style={{width: '100%', maxWidth: '50rem', alignItems: 'center'}}>
													{this.state.landUseMapLegendData ? this.renderMapLegend(this.state.landUseMapLegendData) : null}
												</div>
											</Expandable>
										}
									>
										<div className="scudeoStories19-map-container">
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
												<MapSet
													activeMapKey="scudeoStories19-urbanExtent-map-3"
													backgroundLayer={backgroundLayer}
													mapComponent={LeafletMap}
													sync={{
														boxRange: true,
														center: true
													}}
												>
													<PresentationMap
														mapKey="scudeoStories19-urbanExtent-map-3"
														scrollWheelZoom="afterClick"
														layers={firstYearStructureLayers}
														scale
													>
														<div className="scudeoStories19-map-label">
															{this.state.cityOne.firstYear}
														</div>
													</PresentationMap>
													<PresentationMap
														mapKey="scudeoStories19-urbanExtent-map-4"
														scrollWheelZoom="afterClick"
														layers={lastYearStructureLayers}
													>
														<div className="scudeoStories19-map-label">
															{this.state.cityOne.lastYear}
														</div>
													</PresentationMap>
													<MapControls zoomOnly levelsBased/>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</MapSet>
											</AdjustViewOnResizeLeafletWrapper>
										</div>
									</Visualization>
								</Fade>

								<HoverHandler selectedItems={[this.state.cityOne.key]} compressedPopups>
									<Fade left distance="50px">
										<Visualization
											title="Land Cover Land Use Structure"
											description="The graph above provides an overview of LULC structure (class % of the total area) in observed cities for a given reference year. Note: Lima – Only partial data are available, not complete city coverage."
											subtitle={this.state.cityOne.lastYear}
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<ColumnChart
														key="lulc-structure"

														data={LULCStructureDataset}
														keySourcePath="AL3_ID"
														nameSourcePath="AL3_NAME"
														xSourcePath="AL3_NAME"
														ySourcePath={pathLULCStructureYSourcePath}

														height={20}
														xValuesSize={4}

														yLabel
														yOptions={{
															name: "Structure",
															unit: "sqm"
														}}
														yValuesSize={3}

														stacked="relative"
													/>
												</div>
											</Fade>
										</Visualization>
									</Fade>
								</HoverHandler>

								<HoverHandler selectedItems={[this.state.cityOne.key]} compressedPopups>
									<Fade left distance="50px">
										<Visualization
											title="Total Area Changed"
											subtitle={`${this.state.cityOne.firstYear} - ${this.state.cityOne.lastYear}`}
											description="The graph above provides an overview of the amount of LULC changes (in km sq.) in observed cities for a given period. Note: Lima – Only partial data are available, not complete city coverage."
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<ColumnChart
														key="lulc-structure"

														data={changesStructure}
														keySourcePath="AL3_ID"
														nameSourcePath="AL3_NAME"
														xSourcePath="AL3_NAME"
														ySourcePath={pathLULCStructureAreasYSourcePath}

														height={20}
														xValuesSize={4}

														yLabel
														yOptions={{
															name: "Area",
															unit: "km2"
														}}
														yValuesSize={3}

														stacked
													/>
												</div>
											</Fade>
										</Visualization>
									</Fade>
								</HoverHandler>

								<HoverHandler selectedItems={[this.state.cityOne.key]} compressedPopups>
									<Fade left distance="50px">
										<Visualization
											title="Structure of Land Cover Land Use Changes (% of total change)"
											subtitle={`${this.state.cityOne.firstYear} - ${this.state.cityOne.lastYear}`}
											description="The graph above provides an overview of the structure of LULC changes classified into Land Flows. For each Land Flow type, it shows its share (% of the total changed area) in observed cities for a given period. Note: Lima – Only partial data are available, not complete city coverage."
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<ColumnChart
														key="diverging-bars"

														data={changesStructure}
														keySourcePath="AL3_ID"
														nameSourcePath="AL3_NAME"
														xSourcePath="AL3_NAME"
														ySourcePath={pathLULCChangesStructureYSourcePath}

														height={20}
														xValuesSize={4}
														diverging
														yLabel
														yOptions={{
															name: "Land Flow Type",
															unit: "%",
															max: 100,
															min: 0
														}}
														yValuesSize={3}

														stacked="relative"
													/>
												</div>
											</Fade>
										</Visualization>
									</Fade>
								</HoverHandler>


								{/* <Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Rozdíly???"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
										<ColumnChart 
											key="diverging-bars"
											
											data={differenceStructure}
											keySourcePath="AL3_ID"
											nameSourcePath="AL3_NAME"
											xSourcePath="AL3_NAME"
											ySourcePath={pathLULCStructureYSourcePath}
											
											height={20}
											xValuesSize={6}
											diverging
											yLabel
											yOptions={{
												name: "Change structure",
												unit: "%",
												max: 50,
												min: -50
											}}
											yValuesSize={3}

											// stacked="relative"
										/>
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
						</Fade> */}

								<Fade left distance="50px">
									<Visualization
										title="Land Cover and Land Use Changes"
										description="Interactive maps above provide an overview of spatial composition LULC classes in a selected city for a selected year (left) and an overview of spatial composition of Land Flow types (right) for the same city for the selected observation period. Land Flow types classification is used to ease individual land cover and land use changes interpretation. Note: Lima – Only partial data are available, not complete city coverage."
										legend={
											<div style={{display: 'flex', width: '100%', padding: '0 1rem'}}>
												<div style={{flexGrow: 1}}>
													<Expandable>
														<div className="scudeoStories19-visualization-legend">
															{this.state.landUseMapLegendData ? this.renderMapLegend(this.state.landUseMapLegendData) : null}
														</div>
													</Expandable>
												</div>
												<div style={{flexGrow: 1}}>
													<Expandable>
														<div className="scudeoStories19-visualization-legend">
															{this.state.changeMapLegendData ? this.renderMapLegend(this.state.changeMapLegendData) : null}
														</div>
													</Expandable>
												</div>
											</div>
										}
									>
										<div className="scudeoStories19-map-container">
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
												<MapSet
													activeMapKey="scudeoStories19-urbanExtent-map-1"
													backgroundLayer={backgroundLayer}
													mapComponent={LeafletMap}
													sync={{
														boxRange: true,
														center: true
													}}
												>
													<PresentationMap
														mapKey="scudeoStories19-urbanExtent-map-1"
														scrollWheelZoom="afterClick"
														layers={firstYearChangeStructureLayers}
														scale
													>
														<div className="scudeoStories19-map-label">
															{/* {this.state.cityOne.firstYear} */}
															<Select
																onChange={this.onSelectedYearChanged.bind(this)}
																options={this.state.cityYears}
																optionLabel="name"
																optionValue="key"
																value={this.state.cityYear}
																menuPortalTarget={this.props.pageKey}
															/>	
														</div>
													</PresentationMap>
													<PresentationMap
														mapKey="scudeoStories19-urbanExtent-map-2"
														scrollWheelZoom="afterClick"
														layers={lastYearChangeStructureLayers}
													>
														<div className="scudeoStories19-map-label">
															{`Change flows: ${this.state.cityOne.firstYear} - ${this.state.cityOne.lastYear}`}
														</div>
													</PresentationMap>
													<MapControls zoomOnly levelsBased/>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</MapSet>
											</AdjustViewOnResizeLeafletWrapper>
										</div>
									</Visualization>
								</Fade>


								<HoverHandler>
									<Fade left distance="50px">
										<Visualization
											title={`Land Cover Land Use Changes Structure - Overall flows`}
											description="Sankey graph above provides an overview of all land flows types in a selected city for a given observation period. Individual consumption and formation flows and their magnitude can be highlighted providing users with an immediate perception of their composition, importance and contribution into the overall changes. Note: Lima – Only partial data are available, not complete city coverage."
											subtitle={`${this.state.cityOne.name} ${this.state.cityOne.firstYear}/${this.state.cityOne.lastYear}`}
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<SankeyChart
														hoverValueSourcePath="valueSize"
														key="sankey-overall-flows"
														data={this.state.cityOne.l3OverallFlowsCoverage}
														keySourcePath="key"

														nodeNameSourcePath="name"
														nodeValueSourcePath="value"
														nodeColorSourcePath="color"

														linkNameSourcePath="name"
														hoverValueSourcePath="value"

														// valueSourcePath="value"
														maxWidth={50}
														width={50}
														height={66}
														yOptions={{
															// name: 'Node title',
															unit: 'km2'
														}}
													/>
												</div>
											</Fade>
										</Visualization>
									</Fade>
								</HoverHandler>

								{!expansionDataEmpty ? (<HoverHandler>
									<Fade left distance="50px">
										<Visualization
											title={`Land Cover Land Use Changes Structure - Urban Expansion flows`}
											description="Sankey graph above provides an overview of all land flows related to Urban Expansion in a selected city for a given observation period. Individual consumption and formation flows and their magnitude can be highlighted providing users with an immediate perception of their composition, importance and contribution into the overall changes. Note: Lima – Only partial data are available, not complete city coverage."
											subtitle={`${this.state.cityOne.name} ${this.state.cityOne.firstYear}/${this.state.cityOne.lastYear}`}
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<SankeyChart
														hoverValueSourcePath="valueSize"
														key="sankey-expansions-flows"
														data={expansionData}
														keySourcePath="key"

														nodeNameSourcePath="name"
														nodeValueSourcePath="value"
														nodeColorSourcePath="color"

														linkNameSourcePath="name"
														hoverValueSourcePath="value"

														// valueSourcePath="value"
														maxWidth={50}
														width={50}
														height={40}
														yOptions={{
															// name: 'Node title',
															unit: 'km2'
														}}
													/>
												</div>
											</Fade>
										</Visualization>
									</Fade>
								</HoverHandler>) : null}


								{!densificationsDataEmpty ?
									<HoverHandler>
										<Fade left distance="50px">
											<Visualization
												title={`Land Cover Land Use Changes Structure - Urban Densification Flows`}
												description="Sankey graph above provides an overview of all land flows related to Urban Densification in a selected city for a given observation period. Individual consumption and formation flows and their magnitude can be highlighted providing users with an immediate perception of their composition, importance and contribution into the overall changes. Note: Lima – Only partial data are available, not complete city coverage."
												subtitle={`${this.state.cityOne.name} ${this.state.cityOne.firstYear}/${this.state.cityOne.lastYear}`}
											>
												<Fade cascade>
													<div className="scudeoStories19-chart-container">
														<SankeyChart
															hoverValueSourcePath="valueSize"
															key="sankey-densifacation-flows"
															data={densificationsData}
															keySourcePath="key"

															nodeNameSourcePath="name"
															nodeValueSourcePath="value"
															nodeColorSourcePath="color"

															linkNameSourcePath="name"
															hoverValueSourcePath="value"

															// valueSourcePath="value"
															maxWidth={50}
															width={50}
															height={40}
															yOptions={{
																// name: 'Node title',
																unit: 'km2'
															}}
														/>
													</div>
												</Fade>
											</Visualization>
										</Fade></HoverHandler> : null}
								<p>Information about land cover and land use is a very important component of the planning process as it can contribute to the debate on the current arrangements and patterns and the need to modify land use as part of a regional plan, a resource development or management project, an environmental planning exercise, nature-based solution for risk prevention, etc. Planners may seek to suggest modifications to land use patterns to achieve some social or economic outcomes, or as part of an environmental conservation or sustainability activities, or to avoid some predicted future unwanted consequences. Access to accurate land cover and land use information can assist city planners and the enterprises in these planning tasks. In this context, remote sensing is able to contribute to operational land cover land use status monitoring. Examples above show how such spatial data can be interpreted and visualized in a meaningful way to allow better insight into land cover and land use related processes, changes and flows in the city.</p>

								<h2>About LULC data and accounting methodology</h2>
								<p>The key focus of land accounts is the understanding of city land assets - stocks of different land and change over time. Land accounts used in the EO4SD Urban framework consist of physical asset accounts for land use and land cover status and changes. These accounts describe the land over an accounting period for a particular area by available land use and land cover categories. Land accounting indicators are calculated from the LCLU Baseline product from the EO4SD Urban service portfolio mapped using satellite images with different resolution. Changes from agriculture, forest or semi-natural/natural land, wetlands or water to urban are grouped according to the land cover accounts (LEAC) methodology into land flows types (LCF) providing a meaningful flow categories e.g. urban expansion, urban densification etc. for assessment. Methodology framework is inspired by UN SEEA and the European Environmental Agency' land analytical framework (LEAC). Land accounting indicators provide base information about land cover and land use assets in the observed areas, consumption and formation flows during an observed period and stock changes resulting from these flows. It offers to decision-makers detailed, structured and standardized quantitative and qualitative information on land changes for assessment for the city, district or any user-defined areas. It provides information about the land profile in a selected area and highlights its strengths and weaknesses. </p>


								<h3>More resources</h3>
								<ul>
									<li><a href="http://urban-eo4sd.wixsite.com/trial/post/supporting-the-local-urban-planning-process-in-kolkata-india" target="_blank">Use Case - Supporting the local urban planning process in Kolkata (India)</a></li>
									<li><a href="http://urban-eo4sd.wixsite.com/trial/post/integration-of-phase-1-eo4sd-urban-geo-spatial-products-in-world-bank-studies" target="_blank">Use Case - Integration of EO4SD-Urban geo-spatial products in World Bank studies</a></li>
									<li><a href="https://urban-tep.eu/puma/tool/?id=82971&lang=en#" target="_blank">Explore the EO4SD Urban LULC data in more depth</a></li>
								</ul>

							</section>
						</div>
						: null
				}
			</>
		);
	}
}

export default LandAssetsStructure;


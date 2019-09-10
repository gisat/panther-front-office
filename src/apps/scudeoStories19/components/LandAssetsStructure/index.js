import React from 'react';
import Fade from "react-reveal/Fade";

import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import SankeyChart from "../../../../components/common/charts/SankeyChart/SankeyChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Select from "../../../../components/common/atoms/Select/Select";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import conversions from "../../data/conversions";

import Helmet from "react-helmet";
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

// LULC Level III
const URBAN_FABRIC_KEYS = ["11100", "11200"];

// LULC Level IV
const URBAN_FABRIC_DISCONTINUOUS_KEYS = ["11210", "11220", "11221", "11222", "11240", "11300"]
const URBAN_FABRIC_CONTINUOUS_KEYS = ["11100"]

//urban densifications
const URBAN_DENSIFICATION_SOURCE_KEYS = ["11210", "11220", "11230", "11240"];
const URBAN_DENSIFICATION_TARGET_KEYS = ["11100", "11210", "11220"];

const filterUrbanExpansion = (dataset) => {
	const links = dataset.links.filter(l => {
		const targetId = l.source.id || l.target;
		return URBAN_FABRIC_KEYS.includes(targetId.split("_")[0]);
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
	key: 'slums',
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
	key: 'slums',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params: {
			layers: 'scudeo_lulc_second_year',
			styles: '',
		},
	}
};

const lulcFirstYearChangeStructureLayer = {
	name: 'Data layer',
	key: 'slums',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params: {
			layers: 'scudeo_lulc_first_year',
			styles: '',
		},
	}
};

const lulcLastYearChangeStructureLayer = {
	name: 'Data layer',
	key: 'slums',
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
			changes.data[classId] = dataSet.data.features[0].properties[changeKey];
		}
		for (const [classId, className] of Object.entries(classesLCFG)) {
			// const percentageKey = getClassPercentagePropertyKey(classId, dataSet.lastYear);
			const changeKey = getLCFGClassPropertyKey(classId, dataSet.firstYear, dataSet.lastYear);
			changes.data[classId] = dataSet.data.features[0].properties[changeKey];
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
			});
		});

		this.loadLegendData(lulcFirstYearStructureLayer, 'landUseMapLegendData');
		this.loadLegendData(lulcLastYearChangeStructureLayer, 'changeMapLegendData');
	}


	onCityChange(city, data) {
		this.setState({
			[city]: data
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
									color: _.get(rule, 'symbolizers[0].Polygon.fill')
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
		return data.map((item) => {
			return (
				<div className="legend-field">
					<div className="legend-color" style={{background: item.color}}></div>
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

		if (this.state.cityOne) {
			firstYearStructureLayers = [lulcFirstYearStructureLayer, this.state.vectorLayer];
			lastYearStructureLayers = [lulcLastYearStructureLayer, this.state.vectorLayer];

			firstYearChangeStructureLayers = [lulcFirstYearChangeStructureLayer, this.state.vectorLayer];
			lastYearChangeStructureLayers = [lulcLastYearChangeStructureLayer, this.state.vectorLayer];

			densificationsData = filterUrbanDensifications(this.state.cityOne.l4OverallFlowsCoverage);
			densificationsDataEmpty = densificationsData.nodes.length === 0 && densificationsData.links.length === 0
		}


		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="City Land Assets Structure and Evolution"
					intro="EO data can provide insight into LULC assets structure and evaluate quantity and quality of LULC changes"
					abstract="Land as non-renewable resource and land structure influence city livability and resilience. The quantity and quality of land resources plays a vital role in the development of a city and its structure and spatial-temporal patterns to a large extent influence city livability and resilience as well as determine its physical constraints and opportunities and potential for further development."
				/>

				{
					this.state.cityOne ?
						<div className="scudeoStories19-content">
							<section>
								<p>As cities strive to become centers of global production, trade and development, they
									are increasingly concerned with improving their attractiveness for foreign direct
									investment and employment generation. For example, cities must have efficient
									spatial structures, adequate infrastructure and urban services, affordable housing
									and healthy environments. Effective urban land assets management is required to
									promote urban regeneration and development of new industrial and commercial
									districts, investments to upgrade and expand critical infrastructure systems,
									programs to enhance and protect the environment, and initiatives to upgrade social
									overhead capital (housing, education, healthcare). </p>
								<p>An important characteristic of land is that it is fixed in supply. Land is a free
									gift from nature and its quantity is fixed by nature. Therefore, more land cannot be
									produced in response to greater demand for it, still land quality can be changed as
									well as its actual use and cover.</p>
								<p> Satellite imagery can be used to provide an up-to-date picture of the state of land
									use and land cover on a large scale. Land cover indicates the physical land type
									such as forest or open water whereas land use documents how people are using the
									land. Repeated satellite acquisition allows for a changing picture of the urban
									environment to be created which is essential for land assets monitoring, management
									and planning purposes. The ability of remote sensing to contribute to the mandate of
									planners and managers has changed significantly over the last decade. Satellite data
									are now available that can be used to map and monitor change from continental to
									local scales and over daily to weekly temporal scales. Similarly, advances in image
									processing, database management and spatial analysis tools have enhanced our ability
									to analyse these data for depicting land cover and land use change. </p>
								<Select
									className={"scudeoStories19-city-select"}
									onChange={this.onCityChange.bind(this, 'cityOne')}
									options={this.state.dataset}
									optionLabel="name"
									optionValue="key"
									value={this.state.cityOne}
									menuPortalTarget={this.props.pageKey}
								/>


								<Fade left distance="50px">
									<Visualization
										title="Land Cover Land Use Structure"
										description="Interactive maps above provide overview of land cover land use classes spatial distribution for a selected city for two reference years. Thus, spatial distribution of land cover land use changes for in-between period can be observed."
										legend={
											<div className="scudeoStories19-visualization-legend"
												 style={{maxWidth: '100%', alignItems: 'center'}}>
												{this.state.landUseMapLegendData ? this.renderMapLegend(this.state.landUseMapLegendData) : null}
											</div>
										}
									>
										<div className="scudeoStories19-map-container">
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
												<PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-urbanExtent-map-1"
															scrollWheelZoom="afterClick"
															backgroundLayer={backgroundLayer}
															layers={firstYearStructureLayers}
															scale
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														{this.state.cityOne.firstYear}
													</div>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</PresentationMapWithControls>
											</AdjustViewOnResizeLeafletWrapper>
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
												<PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-urbanExtent-map-2"
															scrollWheelZoom="afterClick"
															backgroundLayer={backgroundLayer}
															layers={lastYearStructureLayers}
															scale
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														{this.state.cityOne.lastYear}
													</div>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</PresentationMapWithControls>
											</AdjustViewOnResizeLeafletWrapper>
										</div>
									</Visualization>
								</Fade>

								<HoverHandler selectedItems={[this.state.cityOne.key]}>
									<Fade left distance="50px">
										<Visualization
											title="Land Cover Land Use Structure"
											description="Graph above provides overview of land cover land use structure of selected cities for a given reference year."
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

								<HoverHandler selectedItems={[this.state.cityOne.key]}>
									<Fade left distance="50px">
										<Visualization
											title="Land Cover Land Use Changes Intensity and Structure"
											description="Graph above provides overview of land cover land use change intensity and land cover flows structure for selected cities for a selected observation period."
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
															name: "Change structure",
															unit: "%",
															max: 50,
															min: 0
														}}
														yValuesSize={3}

														// stacked="relative"
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
										title="Land Cover Land Use Change Structure"
										description="Interactive maps above provide overview of land cover land use spatial composition in a selected city for a selected year (left) and land cover flows spatial composition for the same city for selected change observation period. Individual consumption and formation flows are specified to ease individual land cover land use changes interpretation. "
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
												{/* //year 2016 */}
												<PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-urbanExtent-map-3"
															scrollWheelZoom="afterClick"
															backgroundLayer={backgroundLayer}
															layers={firstYearChangeStructureLayers}
															scale
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														{this.state.cityOne.firstYear}
													</div>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</PresentationMapWithControls>
											</AdjustViewOnResizeLeafletWrapper>
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
												{/* //year 2006 */}
												<PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-urbanExtent-map-4"
															scrollWheelZoom="afterClick"
															backgroundLayer={backgroundLayer}
															layers={lastYearChangeStructureLayers}
															scale
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														{`Change flows: ${this.state.cityOne.firstYear} - ${this.state.cityOne.lastYear}`}
													</div>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright"
															 target="_blank">OpenStreetMap</a> contributors © <a
														href="https://carto.com/attribution/#basemaps"
														target="_blank">CARTO</a>
													</div>
												</PresentationMapWithControls>
											</AdjustViewOnResizeLeafletWrapper>
										</div>
									</Visualization>
								</Fade>


								<HoverHandler>
									<Fade left distance="50px">
										<Visualization
											title={`Land Cover Land Use Changes Structure - Overall flows`}
											description="Sankey graph above provides overview of all land cover flows in a selected city for a given observation period. Individual consumption and formation flows and their magnitude can be highlighted providing users with an immediate perception of their composition, importance and contribution into the final net area figures of any land cover land use class. "
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
								<HoverHandler>
									<Fade left distance="50px">
										<Visualization
											title={`Land Cover Land Use Changes Structure - Urban Expansion`}
											description="Sankey graph above provides overview of all land cover flows in a selected city for a given observation period related to Urban Expansion process. Individual consumption and formation flows and their magnitude can be highlighted for an immediate perception of their composition, importance, severity and contribution into the final net area figures of urban land cover land use classes."
											subtitle={`${this.state.cityOne.name} ${this.state.cityOne.firstYear}/${this.state.cityOne.lastYear}`}
										>
											<Fade cascade>
												<div className="scudeoStories19-chart-container">
													<SankeyChart
														hoverValueSourcePath="valueSize"
														key="sankey-expansions-flows"
														data={filterUrbanExpansion(this.state.cityOne.l3OverallFlowsCoverage)}
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
								</HoverHandler>

								{!densificationsDataEmpty ?
									<HoverHandler>
										<Fade left distance="50px">
											<Visualization
												title={`Land Cover Land Use Changes Structure - Urban Densification`}
												description="Sankey graph above provides overview of all land cover flows in a selected city for a given observation period related to Urban Densification process. Individual consumption and formation flows and their magnitude can be highlighted for an immediate perception of their composition, importance and contribution into the final net area figures of urban land cover land use classes."
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
								<p>Information about land cover and land use is a very important component of the
									planning process as it can contribute to the debate on the current arrangements and
									patterns and the need to modify land use as part of a regional plan, a resource
									development or management project, an environmental planning exercise, nature based
									solution for risk prevention etc. Planners may seek to suggest modifications to
									land-use patterns to achieve some social or economic outcomes, or as part of an
									environmental conservation or sustainability activities, or to avoid some predicted
									future unwanted consequences. Access to accurate land cover land use information can
									assist city planners and the enterprise of planning. In this context remote sensing
									is able to contribute in operational land cover land use status monitoring. Examples
									above show how such a spatial data can be interpreted and visualized in a meaningful
									way to allow better insight into land cover land use related processes, changes and
									flows in the city.</p>

								<h2>About LULC data and accounting methodology</h2>
								<p>The key focus of land cover accounts is the understanding of city land assets -
									stocks of different land covers - change over time. Land accounts used in the EO4SD
									Urban framework consist of physical asset accounts for land use and land cover
									status and changes. These accounts describe the land over an accounting period for
									particular area by available land use and land cover categories. Land accounting
									indicators are calculated from LCLU Baseline product from EO4SD Urban service
									portfolio mapped from satellite images with different resolution. Changes from
									agriculture, forest and semi-natural/natural land, wetlands or water to urban are
									grouped according to the land cover accounts (LEAC) methodology into land cover
									flows (LCF) providing a meaningful flow categories e.g. urban expansion, urban
									densification etc . Methodology framework is inspired by UN SEEA and the European
									Environmental Agency LEAC analytical framework. Land accounting indicators provides
									base information about land cover land use assets in the observed areas, consumption
									and formation flows during observed period and net changes resulting from these
									flows, thus offering to decision maker detailed, structured and standardized
									quantitative and qualitative information on land changes for assessment in central
									or peri-urban areas. This product is quite helpful again in the Diagnosis Phase of
									projects. It provides information about the profile of a City or districts within
									the City and highlights strengths and weaknesses of various areas. </p>


								{/*<h3>More resources</h3>*/}
								{/*<ul>*/}
								{/*<li><a href="#" target="_blank">Link A ullamcorper urna</a></li>*/}
								{/*<li><a href="#" target="_blank">Link B libero ac leo</a></li>*/}
								{/*<li><a href="#" target="_blank">Link C Curabitur volutpat lacus at eros luctus</a></li>*/}
								{/*</ul>*/}

							</section>
						</div>
						: null
				}
			</>
		);
	}
}

export default LandAssetsStructure;


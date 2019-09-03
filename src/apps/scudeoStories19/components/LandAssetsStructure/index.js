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

import {mergedDataset, clearEmptyNodes, classesL3, classesL4, colors, classesLCF1, classesLCFG} from '../../data/data';

import './styles/style.scss';

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
	}
};

// LULC Level III
const URBAN_FABRIC_KEYS = ["11100", "11200"];

// LULC Level IV
const URBAN_FABRIC_DISCONTINUOUS_KEYS = ["11210", "11220", "11221", "11222", "11240", "11300"]
const URBAN_FABRIC_CONTINUOUS_KEYS = ["11100"]

const filterUrbanExpansion = (dataset) => {
	const links = dataset.links.filter(l => {
		return URBAN_FABRIC_KEYS.includes(l.target.split("_")[0]);
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
		const sourceFromDISCONTINUOUS = URBAN_FABRIC_DISCONTINUOUS_KEYS.includes(l.source.split("_")[0]);
		const targetToCONTINUOUS = URBAN_FABRIC_CONTINUOUS_KEYS.includes(l.target.split("_")[0]);
		return sourceFromDISCONTINUOUS && targetToCONTINUOUS;
	})
	const nodes = [...dataset.nodes];
	const nonEmptyNodes = clearEmptyNodes(nodes, links);
	return {
		nodes: nonEmptyNodes ,
		links,
	};
}

let vectorLayers = [{
	key: 'aoi-vector',
	name: 'AOI',
	type: 'vector',
	options: {
		keyProperty: 'key',
		nameProperty: 'name',
		features: {
			"type":"FeatureCollection",
			"name":"EO4SD_DHAKA_AL2",
			"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},
			"features": mergedDataset.reduce((acc, d) => [...acc, ...d.data.features], [])
		}
	}
}];

const getClassPercentagePropertyKey = (classId, year) => `lulc_l3_${year}_${classId}_percentage`
const getLCFGClassPropertyKey = (classId, yearFirst, yearLast) => `lcfg_${yearFirst}_${yearLast}_${classId}_percentage`
const getLCF1ClassPropertyKey = (classId, yearFirst, yearLast) => `lcf1_${yearFirst}_${yearLast}_${classId}_percentage`
const getClassCoveragePropertyKey = (classId, year) => `lulc_l3_${year}_${classId}_coverage`

const LULCStructureDataset = [];
const changesStructure = [];
const differenceStructure = [];
mergedDataset.forEach((dataSet) => {
	//LULCStructureDataset
	const avarageData = {
		data:{}
	};

	const changes = {
		data:{},
		sum: 0,
	};

	const difference = {
		data:{},
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
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			cityOne: mergedDataset[0],
		};
	}


	onCityChange(city, data) {
		this.setState({
			[city]: data
		});
	}


	render() {

		const densificationsData = filterUrbanDensifications(this.state.cityOne.l4OverallFlows);
		const densificationsDataEmpty = densificationsData.nodes.length === 0 && densificationsData.links.length === 0


		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="City Land Assets Structure and Evolution"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section>
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Structure"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

								<HoverHandler>
									<ColumnChart
											key="lulc-structure"

											data={LULCStructureDataset}
											keySourcePath="AL3_ID"
											nameSourcePath="AL3_NAME"
											xSourcePath="AL3_NAME"
											ySourcePath={pathLULCStructureYSourcePath}

											height={20}
											xValuesSize={6}

											yLabel
											yOptions={{
												name: "Structure",
												unit: "sqm"
											}}
											yValuesSize={3}

											stacked="relative"
										/>
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
					</Fade>

					<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Structure"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">
									<HoverHandler>
										{/* <ColumnChart 
												key="diverging-bars"
												
												data={changesStructure}
												keySourcePath="AL3_ID"
												nameSourcePath="AL3_NAME"
												xSourcePath="AL3_NAME"
												ySourcePath="sum"
												
												height={20}
												xValuesSize={6}

												yLabel
												yOptions={{
													name: "Change intensity",
													unit: "%",
													max: 100,
													min: 0
												}}
												yValuesSize={3}

												// stacked="relative"
											/> */}

										<ColumnChart 
											key="diverging-bars"
											
											data={changesStructure}
											keySourcePath="AL3_ID"
											nameSourcePath="AL3_NAME"
											xSourcePath="AL3_NAME"
											ySourcePath={pathLULCChangesStructureYSourcePath}
											
											height={20}
											xValuesSize={6}
											diverging
											yLabel
											yOptions={{
												name: "Change structure",
												unit: "%",
												max: 100,
												min: -100
											}}
											yValuesSize={3}

											// stacked="relative"
											/>
										</HoverHandler>
									</div>
							</Fade>
						</Visualization>
					</Fade>
					<Fade left distance="50px">
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
					</Fade>
					</section>
					<section key="section-2">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>


						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Structure (2006 / 2016)"
								description="Footer maps description. Lorem ipsum dolor sit amet, causae incorrupte ut nec, eu vix iuvaret tacimates lobortis. In tollit
								suscipit pertinacia eum, delenit perpetua splendide ei eum. Ut menandri intellegam eam, augue repudiare ei pro."
							>
								<div className="scudeoStories19-map-container">
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
										{/* //year 2016 */}
										<PresentationMapWithControls
											map={
												<LeafletMap
													mapKey="scudeoStories19-urbanExtent-map-1"
													scrollWheelZoom="afterClick"
													backgroundLayer={backgroundLayer}
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
											<div className="scudeoStories19-map-label">
												<Select
													onChange={this.onCityChange.bind(this, 'cityOne')}
													options={mergedDataset}
													optionLabel="name"
													optionValue="key"
													value={this.state.cityOne}
													menuPortalTarget={this.props.pageKey}
												/>
											</div>
											<div className="scudeoStories19-map-attribution">
												Add <a href="#" target="_blank">attribution</a> according to used background map. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus.
											</div>
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.data}>
										{/* //year 2006 */}
										<PresentationMapWithControls
											map={
												<LeafletMap
													mapKey="scudeoStories19-urbanExtent-map-2"
													scrollWheelZoom="afterClick"
													backgroundLayer={backgroundLayer}
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
								</div>
							</Visualization>
						</Fade>
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Change Structure (2006 / 2016)"
								description="Footer maps description. Lorem ipsum dolor sit amet, causae incorrupte ut nec, eu vix iuvaret tacimates lobortis. In tollit
								suscipit pertinacia eum, delenit perpetua splendide ei eum. Ut menandri intellegam eam, augue repudiare ei pro."
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
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
											<div className="scudeoStories19-map-label">
												<Select
													onChange={this.onCityChange.bind(this, 'cityOne')}
													options={mergedDataset}
													optionLabel="name"
													optionValue="key"
													value={this.state.cityOne}
													menuPortalTarget={this.props.pageKey}
												/>
											</div>
											<div className="scudeoStories19-map-attribution">
												Add <a href="#" target="_blank">attribution</a> according to used background map. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus.
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
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
								</div>
							</Visualization>
						</Fade>


						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Structure - Overall flows"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
										<SankeyChart
											hoverValueSourcePath="valueSize"
											key="sankey-overall-flows"
											data={this.state.cityOne.l3OverallFlows}
											keySourcePath="key"

											nodeNameSourcePath="name"
											nodeValueSourcePath="value"
											nodeColorSourcePath="color"
											
											linkNameSourcePath="name"
											hoverValueSourcePath="value"

											// valueSourcePath="value"
											maxWidth = {50}
											width={50}
											height={100}
											yOptions={{
												// name: 'Node title',
												unit: '%'
											}}
										/>
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
					</Fade>
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Structure - Urban Expansion"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
										<SankeyChart
											hoverValueSourcePath="valueSize"
											key="sankey-expansions-flows"
											data={filterUrbanExpansion(this.state.cityOne.l3OverallFlows)}
											keySourcePath="key"

											nodeNameSourcePath="name"
											nodeValueSourcePath="value"
											nodeColorSourcePath="color"
											
											linkNameSourcePath="name"
											hoverValueSourcePath="value"

											// valueSourcePath="value"
											maxWidth = {50}
											width={50}
											height={50}
											yOptions={{
												// name: 'Node title',
												unit: '%'
											}}
										/>
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
					</Fade>

					{ !densificationsDataEmpty ?
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Structure - Urban Expansion"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
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
											maxWidth = {50}
											width={50}
											height={50}
											yOptions={{
												// name: 'Node title',
												unit: '%'
											}}
										/>
									</HoverHandler>
								</div>
							</Fade> 
						</Visualization>
					</Fade>: null}
						<h3>More resources</h3>
						<ul>
							<li><a href="#" target="_blank">Link A ullamcorper urna</a></li>
							<li><a href="#" target="_blank">Link B libero ac leo</a></li>
							<li><a href="#" target="_blank">Link C Curabitur volutpat lacus at eros luctus</a></li>
						</ul>

					</section>
				</div>
			</>
		);
	}
}

export default LandAssetsStructure;


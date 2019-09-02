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
import * as dodoma_au_level_3 from '../../data/EO4SD_DODOMA_AL3.json';
import conversions from "../../data/conversions";

import Helmet from "react-helmet";
import {Footer, Visualization} from '../Page';
import {Header} from "../Page";

//Data
import arushaDataset from './data/scudeo_stories_data/arusha_combined_output_p7.json';
import dhakaDataset from './data/scudeo_stories_data/dhaka_combined_output_p7.json';
import dodomaDataset from './data/scudeo_stories_data/dodoma_combined_output_p7.json';
import kigomaDataset from './data/scudeo_stories_data/kigoma_combined_output_p7.json';
import mbeyaDataset from './data/scudeo_stories_data/mbeya_combined_output_p7.json';
import mtwaraDataset from './data/scudeo_stories_data/mtwara_combined_output_p7.json';
import mwanzaDataset from './data/scudeo_stories_data/mwanza_combined_output_p7.json';
// import dhakaDataset from './data/dhaka_lulc.json';

import './styles/style.scss';

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
	}
};

const classes = {
    "11100":"Continuous Urban Fabric (Sealing level: 80% - 100%)",
    "11200":"Discontinuous Urban Fabric (Sealing level: 10% - 80%)",
    "12100":"Industrial, Commercial, Public, Military and Private Units",
    "12200":"Roads and rail network and associated land",
    "12300":"Roads and rail network and associated land",
    "12400":"Airport",
    "13100":"Mineral Extraction and Dump Sites",
    "13300":"Construction Sites",
    "13400":"Land without current use",
    "14100":"Green Urban Areas",
    "14200":"Recreation Facilities (Sport Facilities, Stadiums, Golf Courses, etc.)",
    "14300":"Cemeteries",
    "20000":"Agricultural Area",
    "31000":"Forest",
    "32000":"Other Natural and Semi-natural Areas (Savannah, Grassland)",
    "33000":"Bare land",
    "40000":"Wetlands",
    "51000":"Inland Water",
    "52000":"Marine Water"
};

const colors = {
    "11100":"#9f1313",
    "11200":"#d31414",
    "12100":"#9b1794",
    "12200":"#9C9C9C",
    "12300":"#61007F",
    "12400":"#FFAA00",
    "13100":"#734d37",
    "13300":"#FF73DF",
    "13400":"#BEE8FF",
    "14100":"#4dca00",
    "14200":"#8cdc00",
    "14300":"#A34963",
    "20000":"#ffdc9b",
    "31000":"#006a00",
    "32000":"#B4D79E",
    "33000":"#CCCCCC",
    "40000":"#a6a6ff",
    "51000":"#4c96e4",
    "52000":"#95d6ea"
};

const getL3Nodes = (dataset, years) => {
	const nodes = [];
	for (const [key, value] of Object.entries(classes)) {
		for (const year of years) {
			const propsKey = `lulc_l3_${year}_${key}_coverage`;
			const node = {
				id: `${key}_${year}`,
				name: value,
				color: colors[key],
				valueSize: dataset.features[0].properties[propsKey]
			}
			nodes.push(node);
		}
	}
	return nodes;
}

const getL3Links = (dataset, fromYear, toYear) => {
// lulc_l4_2006_11210_percentage

	const links = [];
	for (const [key, value] of Object.entries(classes)) {
		const changeFromKey = `lulc_l3_${fromYear}_${key}_percentage`
		const changeToKey = `lulc_l3_${toYear}_${key}_percentage`
		const fromValue = dataset.features[0].properties[changeFromKey];
		const toValue = dataset.features[0].properties[changeToKey];
		const change = fromValue - toValue;
		const link = {
			source: `${key}_${fromYear}`,
			target: `${key}_${toYear}`,
			value: change,
			name: value
		}
		links.push(link);
	}
	return links;

}

const mergedDataset = [
	{
		data: arushaDataset,
		overallFlows: {
			nodes: getL3Nodes(arushaDataset, [2005, 2016]),
			links: getL3Links(arushaDataset, 2005, 2016),
		},
		lastYear: 2016,
		firstYear: 2005,
		name: 'Arusha',
		key: 1,
	},
	{
		data: dhakaDataset,
		overallFlows: {
			nodes: getL3Nodes(dhakaDataset, [2006, 2017]),
			links: getL3Links(dhakaDataset, 2006, 2017),
		},
		lastYear: 2017,
		firstYear: 2006,
		name: 'Dhaka',
		key: 2,
	},
	{
		data: dodomaDataset,
		overallFlows: {
			nodes: getL3Nodes(dodomaDataset, [2006, 2016]),
			links: getL3Links(dodomaDataset, 2006, 2016),
		},
		lastYear: 2016,
		firstYear: 2006,
		name: 'Dodoma',
		key: 3,
	},
	{
		data: kigomaDataset,
		overallFlows: {
			nodes: getL3Nodes(kigomaDataset, [2005, 2015]),
			links: getL3Links(kigomaDataset, 2005, 2015),
		},
		lastYear: 2015,
		firstYear: 2005,
		name: 'Kigoma',
		key: 4,
	},
	{
		data: mbeyaDataset,
		overallFlows: {
			nodes: getL3Nodes(mbeyaDataset, [2004, 2017]),
			links: getL3Links(mbeyaDataset, 2004, 2017),
		},
		lastYear: 2017,
		firstYear: 2004,
		name: 'Mbeya',
		key: 5,
	},
	{
		data: mtwaraDataset,
		overallFlows: {
			nodes: getL3Nodes(mtwaraDataset, [2008, 2016]),
			links: getL3Links(mtwaraDataset, 2008, 2016),
		},
		lastYear: 2016,
		firstYear: 2008,
		name: 'Mtwara',
		key: 6,
	},
	{
		data: mwanzaDataset,
		overallFlows: {
			nodes: getL3Nodes(mwanzaDataset, [2005, 2015]),
			links: getL3Links(mwanzaDataset, 2005, 2015),
		},
		lastYear: 2015,
		firstYear: 2005,
		name: 'Mwanza',
		key: 7,
	},
]

console.log(mergedDataset);

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
const getClassCoveragePropertyKey = (classId, year) => `lulc_l3_${year}_${classId}_coverage`

const LULCStructureDataset = [];
const changesStructure = [];
mergedDataset.forEach((dataSet) => {
	//LULCStructureDataset
	const avarageData = {
		data:{}
	};

	const changes = {
		data:{},
		sum: 0,
	};

	for (const [classId, className] of Object.entries(classes)) {
		const percentageKey = getClassPercentagePropertyKey(classId, dataSet.lastYear);
		avarageData.data[classId] = dataSet.data.features[0].properties[percentageKey];
		
		//change
		const coverageKeyFirst = getClassCoveragePropertyKey(classId, dataSet.firstYear);
		const coverageKeyLast = getClassCoveragePropertyKey(classId, dataSet.lastYear);

		const change = (dataSet.data.features[0].properties[coverageKeyFirst] - dataSet.data.features[0].properties[coverageKeyLast]) / (dataSet.data.features[0].properties.area / 100)
		changes.data[classId] = isNaN(change) ? 0 : change;
	}
	avarageData.AL3_NAME = dataSet.name;
	avarageData.AL3_ID = dataSet.key;
	LULCStructureDataset.push(avarageData);
	
	changes.AL3_NAME = dataSet.name;
	changes.AL3_ID = dataSet.key;

	for(const [key, value] of Object.entries(changes.data)){
		changes.sum += Math.abs(value);
	}

	changesStructure.push(changes);
});

const pathLULCStructureYSourcePath = [];
for (const [classId, className] of Object.entries(classes)) {
	const valuePath = `data.${classId}`;
	pathLULCStructureYSourcePath.push({
		path: valuePath,
		name: className,
		color: colors[classId],
	})
}

const pathchangesStructureYSourcePath = [];
for (const [classId, className] of Object.entries(classes)) {
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
								title="Land Cover Land Use Changes Intensity"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">
									<HoverHandler>
										<ColumnChart 
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
									<ColumnChart 
										key="diverging-bars"
										
										data={changesStructure}
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
								title="Land Cover Land Use Changes Structure"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
										{/* <SankeyChart
											hoverValueSourcePath="valueSize"
											key="sankey-overall-flows"
											// data={sample_1}
											data={this.state.cityOne.overallFlows}

											nodeColorSourcePath="color"
											keySourcePath="key"
											nameSourcePath="name"
											valueSourcePath="value"

											width={50}
											height={100}
											yOptions={{
												// name: 'Node title',
												unit: 'm2'
											}}
										/> */}
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
					</Fade>
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


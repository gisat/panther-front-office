import React from 'react';
import Fade from "react-reveal/Fade";
import {Header, Visualization} from "../Page";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import SankeyChart from "../../../../components/common/charts/SankeyChart/SankeyChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import Select from "../../../../components/common/atoms/Select/Select";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";
import conversions from "../../data/conversions";
import {getMergedDataset, clearEmptyNodes, urbanFabricL3classes, getVectorLayer, getL4CoverageValueKey} from '../../data/data';
import './styles/style.scss';
import greenSatelliteImage from './assets/Image.png';

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
	}
};

const greenLayer = {
	name: 'Data layer',
	key: 'slums',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params:{
			layers: 'scudeo_lulc_green',
			styles: '',
		},
	}
};

// LULC Level IV
const L4_GREEN_AREAS_CLASSES = ["14100", "14110"];

const filterGreenAreaFlows = (dataset) => {
	const links = dataset.links.filter(l => {
		const sourceId = l.source.id || l.source;
		const targetId = l.source.id || l.target;
		const sourceFromDISCONTINUOUS = L4_GREEN_AREAS_CLASSES.includes(sourceId.split("_")[0]);
		const targetToCONTINUOUS = L4_GREEN_AREAS_CLASSES.includes(targetId.split("_")[0]);
		return sourceFromDISCONTINUOUS || targetToCONTINUOUS;
	})
	const nodes = [...dataset.nodes];
	const nonEmptyNodes = clearEmptyNodes(nodes, links);
	return {
		nodes: nonEmptyNodes ,
		links,
	};
}

const getUrbanGreenAreasData = (properties, firstYear, lastYear) => {
	const years = [firstYear, lastYear];
	return years.map((year) => ({
		value: conversions.toSquareKm(conversions.sum([properties], L4_GREEN_AREAS_CLASSES.map((c) => getL4CoverageValueKey(c, year)))),
		name: year
	}));
}

const transformDataset = (dataset) => {
	return dataset.map((dataSet) => {
		const area = conversions.toSquareKm(dataSet.data.features[0].properties.area);
		const urban_fabric_coverage = conversions.toSquareKm(conversions.sum(dataSet.data.features, urbanFabricL3classes.map(c => `properties.lulc_l3_${dataSet.lastYear}_${c}_coverage`)));
		const urban_fabric_share = urban_fabric_coverage / (area / 100);
		const urban_coverage = conversions.toSquareKm(dataSet.data.features[0].properties[`urban_${dataSet.lastYear}_coverage`]);
		const urban_share = dataSet.data.features[0].properties[`urban_${dataSet.lastYear}_percentage`];
		const green_coverage = conversions.toSquareKm(dataSet.data.features[0].properties[`green_${dataSet.lastYear}_coverage`]);
		const green_share = dataSet.data.features[0].properties[`green_${dataSet.lastYear}_percentage`];
		const sport_leisure_facilities_share = dataSet.data.features[0].properties[`lulc_l4_${dataSet.lastYear}_14200_percentage`];
		const sport_leisure_facilities_area = conversions.toSquareKm(dataSet.data.features[0].properties[`lulc_l4_${dataSet.lastYear}_14200_coverage`]);
		const green_areas_share = green_coverage / (area / 100);
		const green_fabricarea_share = green_coverage / (urban_fabric_coverage / 100);
		
		
		return {
			sport_leisure_facilities_share,
			sport_leisure_facilities_area,
			area,
			urban_coverage,
			urban_share,
			urban_fabric_coverage,
			urban_fabric_share,
			green_coverage,
			green_share,
			green_areas_share,
			green_fabricarea_share,
			key: dataSet.key,
			name: dataSet.name,
			population: dataSet.population
		}
	});
}

class GreenAreas extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			greenAreasData: null,
			city: null,
			loading: null,
			dataset: null,
		};
	}

	componentDidMount() {
		getMergedDataset().then((dataset) => {
			const vectorLayer = getVectorLayer(dataset);
			const greenAreasData = transformDataset(dataset);
			this.setState({
				greenAreasData,
				dataset,
				loading: false,
				city: dataset[0],
				vectorLayer,
			});
		})
	}

	onCityChange(data) {
		this.setState({
			city: data
		});
	}

	render() {

		let layers = null;
		let sankeyGreenData = null;
		let sankeyGreenDataEmpty = null;
		let urbanGreenAres = null;

		if(this.state.city) {
			layers = [greenLayer, this.state.vectorLayer];
			sankeyGreenData = filterGreenAreaFlows(this.state.city.l4OverallFlowsCoverage);
			sankeyGreenDataEmpty = sankeyGreenData.nodes.length === 0 && sankeyGreenData.links.length === 0

			urbanGreenAres = getUrbanGreenAreasData(this.state.city.data.features[0].properties, this.state.city.firstYear, this.state.city.lastYear);
		}

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Mapping and monitoring of urban green areas"
					intro="How green, open and public spaces are defined – opportunities and limitations." 
					abstract="EO4SD-Urban provides a range of tailored products derived by advanced analysis of recent very high resolution satellite imagery to describe distribution of urban green areas in the city, their structure and typology and evolution over the time. This presentation brings simple but powerful examples of mapping and statistical outputs derived directly from EO4SD-Urban’s Urban Green baseline products, which provide means for high level comparative analysis between different cities."
					/>

				
					{
						this.state.city ? 
						<div className="scudeoStories19-content">
							<section key="section-1">
								<div>
									<p>
										When dealing with “Public open spaces”, urban planner will most likely come out from definition provided by UN-HABITAT (2015), defining it as sum of streets and boulevards and the areas devoted to public parks, squares, recreational green areas, public playgrounds and open areas of public facilities. This definition does not include areas devoted to public facilities that are not open to the general public —e.g. schools, stadiums, hospitals, airports, waterworks, or military bases – or open spaces that are in private ownership or vacant lands in private ownership.
									</p>
								</div>
								{/* <img src={greenSatelliteImage} className={'image-showcase'}/> */}
								<div>
									<p>
										In contrary, Urban Atlas (2012) definition of “Artificial non-agricultural vegetated areas“ is widely used in Remote Sensing community, because it puts an emphasis on definition from land use point of view in a way as it can be interpreted from satellite (or aerial) imagery, mostly related to presence of urban green. Artificial non-agriculture vegetated areas are divided into two classes: 1) Urban green areas - consisting from public green areas for predominantly recreational use such as gardens, zoos, parks, castle parks and cemeteries, predominantly covered by vegetation planted and regularly influenced by humans; and 2) Sport and leisure facilities - public or commercial functional units including associated land, independent whether being sealed, non-sealed or built-up. Private gardens within housing areas, buildings within parks (such as museums, governmental areas), patches of natural or agricultural vegetation enclosed by built-ups without being managed as green urban areas are not included. 
									</p>
								</div>
								<div>
									<p>
										EO4SD-Urban’s “Urban Green Areas” baseline product is based on Urban Atlas specification. Examples in this demo were derived accordingly. Advantage of application of the Urban Atlas nomenclature is spatial complementarity and conceptual compliance with other land use / land cover classes utilizing the same framework. Furthermore, product supports city-wide assessment at city-wide level and comparison of derived metrics between different cities. On the other hand, product doesn’t reflect tiny nuances applicable in the local context, stemming e.g. from national or city-specific urban green class specifications, and as a consequence it doesn’t provide means to apply custom nomenclature. This deficiency is, however, overcome by EO4SD-Urban’s optional product “Open and Green Spaces” utilizing in mich wider extent the concept of public open spaces by UN-HABITAT.
									</p>
								</div>

								<Fade left distance="50px">
									<Visualization
										title="Total Green Areas per city (km2)"
										description="Graph shows overall area of urban green in the 7 GPSC cities. Please note: as opposed to other cities, area of interest of mapping in Lima covered only part of the city agglomeration.">
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<HoverHandler>
													<ColumnChart
														key="green-areas-stacked-chart"

														data={this.state.greenAreasData}
														keySourcePath="key"
														nameSourcePath="name"
														xSourcePath="name"
														ySourcePath="green_coverage"
														defaultColor="#42982e"
														highlightColor="#39782b"
														xValuesSize={4}

														yLabel
														yOptions={{
															name: "Area",
															unit: "km2"
														}}
													/>
												</HoverHandler>
											</div>
										</Fade>
									</Visualization>
								</Fade>


								<Fade left distance="50px">
									<Visualization
										title="Green Areas Share (%)"
										description="Graph shows comparison of relative metric: share of artificial urban green areas on total area of artificial urban areas (urban fabric)."
									>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<HoverHandler>
													<ColumnChart
														key="green-areas-stacked-chart"

														data={this.state.greenAreasData}
														keySourcePath="key"
														nameSourcePath="name"
														xSourcePath="name"
														// ySourcePath="green_areas_share"
														ySourcePath={[
															{
																path: 'green_fabricarea_share',
																name: 'Urban green',
																color: '#42982e',
															},
															{
																path: 'sport_leisure_facilities_share',
																name: 'Sport & leisure areas',
																color: '#8cdc00',
															}
														]}
														// defaultColor="#42982e"
														// highlightColor="#39782b"
														xValuesSize={4}

														yLabel
														yOptions={{
															name: "Share",
															unit: "%"
														}}

														stacked
													/>
												</HoverHandler>
											</div>
										</Fade>
									</Visualization>
								</Fade>

								<Fade left distance="50px">
									<Visualization
										title="Green Areas vs. City Total Area"
										description="Scatter plot facilitates identification of clusters depending on relationship between total size of the cities and total area of their green areas. The bubble size represents population as of 2015 (source: WorldBank 2015)."
									>
										<Fade cascade className="aaaa">
											<div className="scudeoStories19-chart-container">
												<HoverHandler>
													<ScatterChart
														key="scatter-chart-1"

														data={this.state.greenAreasData}
														keySourcePath="key"
														nameSourcePath="name"
														xSourcePath="urban_coverage"
														ySourcePath="area"
														zSourcePath="population"

														yLabel
														yValuesSize={3.5}
														yOptions={{
															name: "City area",
															unit: "km2"
														}}
														xLabel
														xValuesSize={3}
														xOptions={{
															name: "Green area",
															unit: "km2"
														}}

														zOptions={{
															name: "Population",
															unit: "inh."
														}}

														innerPaddingRight={0}
														innerPaddingTop={0}
														innerPaddingLeft={0}
													/>
												</HoverHandler>
											</div>
										</Fade>
									</Visualization>
								</Fade>
								<Fade left distance="50px">
									<Visualization
										title="Green Areas vs. Urban fabric area"
										description="Scatter plot facilitates identification of clusters depending on the relationship between shares of green areas and urban fabric areas on overall city area."
									>
										<Fade cascade className="aaaa">
											<div className="scudeoStories19-chart-container">
												<HoverHandler>
													<ScatterChart
														key="scatter-chart-1"

														data={this.state.greenAreasData}
														keySourcePath="key"
														nameSourcePath="name"
														xSourcePath="green_share"
														ySourcePath="urban_fabric_share"

														yLabel
														yValuesSize={3.5}
														yOptions={{
															name: "Urban fabric area",
															unit: "%"
														}}
														xLabel
														xValuesSize={3}
														xOptions={{
															name: "Green area",
															unit: "%"
														}}

														innerPaddingRight={0}
														innerPaddingTop={0}
														innerPaddingLeft={0}
													/>
												</HoverHandler>
											</div>
										</Fade>
									</Visualization>
								</Fade>
							</section>



							<section key="section-2">
								<Select
									className={"scudeoStories19-city-select"}
									onChange={this.onCityChange.bind(this)}
									options={this.state.dataset}
									optionLabel="name"
									optionValue="key"
									value={this.state.city}
									menuPortalTarget={this.props.pageKey}
								/>
								<p>Distribution of artificial green areas (consisting of two classes) in the current year  is presented in the map format. Pick the city from pull-down menu in the top-left corner to display the map for respective city. Status in former time horizon (as mapped using archived imagery) and changes between the two horizons can be presented in the same manner to show spatially explicit patterns of areas subject to transition: either uptake (formation) of former green areas by other classes or their consumption e.g. by urban sprawl or infilling.</p>

								<Fade left distance="50px">
									<Visualization
										title="Green Areas Distribution"
										description="Distribution of the two Artificial urban green classes in the cities (or its parts) as mapped from current very high resolution imagery is shown in the map."
										legend={
											<div className="scudeoStories19-visualization-legend">
												<div className="legend-field">
													<div className="legend-color" style={{background: "#00E800"}}></div>
													<div className="legend-value">14100 - Green Urban Areas</div>
												</div>
												<div className="legend-field">
													<div className="legend-color" style={{background: "#00FFC5"}}></div>
													<div className="legend-value">14200 - Recreation Facilities (Sport Facilities, Stadiums, Golf Courses, etc.)</div>
												</div>
												<div className="legend-field">
													<div className="legend-color" style={{background: "#A34963"}}></div>
													<div className="legend-value">14300 - Cemeteries</div>
												</div>
											</div>
										}
									>
										<div className="scudeoStories19-map-container">
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.city.data}>
												<PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-greenAreas-map-1"
															scrollWheelZoom="afterClick"
															backgroundLayer={backgroundLayer}
															layers={layers}
															scale
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														{this.state.city.lastYear}
													</div>
													<div className="scudeoStories19-map-attribution ptr-dark">
														© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attribution/#basemaps" target="_blank">CARTO</a>
													</div>
												</PresentationMapWithControls>
											</AdjustViewOnResizeLeafletWrapper>
										</div>
									</Visualization>
								</Fade>

								
								<Fade left distance="50px">
									<Visualization
										title="Urban Green Area (km2)"
										subtitle={`${this.state.city.name} ${this.state.city.firstYear}/${this.state.city.lastYear}`}
										description="Graph shows overall area of urban green in two time horizons."
									>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<HoverHandler>
													<ColumnChart
														key="green-areas-stacked-chart"

														data={urbanGreenAres}
														keySourcePath="name"
														nameSourcePath="name"
														xSourcePath="name"
														ySourcePath={'value'}
														defaultColor="#42982e"
														highlightColor="#39782b"

														xValuesSize={3}

														yLabel
														yOptions={{
															name: "Area",
															unit: "km2"
														}}

													/>
												</HoverHandler>
											</div>
										</Fade>
									</Visualization>
								</Fade>

								{ !sankeyGreenDataEmpty ?
									<Fade left distance="50px">
										<Visualization
											title="Green Area Flows"
											description="Sankey diagram helps to understand quantity and proportion changes (their structure, respectively)  as identified by mapping from very high resolution satellite imagery between two time horizonts. Left side of the diagram represents status in former horizont, while right part represent status in current (later horizont). Width of ribbon represents quantity of transition. Diagram shows clearly which classes contributed to formation of new green areas and which other classes consumed green areas that disappeared over the course of reference time period. Diagram quantifies amount of changes at aggregated level. Structure of changes can be further quantified at more detail level of nomenclature - for individual urban green classes."
											subtitle={`${this.state.city.name} ${this.state.city.firstYear}/${this.state.city.lastYear}`}
										>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">

												<HoverHandler>
													<SankeyChart
														hoverValueSourcePath="valueSize"
														key="sankey-green-area-flows"
														data={sankeyGreenData}
														keySourcePath="key"

														nodeNameSourcePath="name"
														nodeValueSourcePath="value"
														nodeColorSourcePath="color"
														
														linkNameSourcePath="name"
														hoverValueSourcePath="value"

														maxWidth = {50}
														width={50}
														height={40}
														yOptions={{
															unit: 'km2'
														}}
													/>
												</HoverHandler>
											</div>
										</Fade> 
									</Visualization>
								</Fade> : null }
							</section>
							<section>
								<h2>Green Areas methodology</h2>
								<p>
									Urban green areas refer to land within and on the edges of a city that is partly or completely covered with grass, trees, shrubs, or other vegetation. This includes public parks, private gardens, cemeteries, forested areas as well as trees, river alignments, hedges etc. The product delivered within EO4SD-Urban project thus provides accurate information (1 m resolution) on the spatial location and extent of the green areas located within the Urban Extent derived from the baseline LULC information product.
								</p>
								<p>
									Detecting and monitoring urban green coverage needs VHR EO data, which explains the product generation over the Core Urban Area of AOI only. The same images have been logically used as for generating the LULC information product. Consequently, the usual preliminary quality check and pre-processing tasks were already implemented. Urban Green Areas have been detected using a combination of semi-automated object-based image analysis and expert visual interpretation of satellite imagery. This processing method is applied for each reference date for which the product is required. Then, change information layer is basically derived from the geometric intersection of the historic and current Urban Green Areas layers by means of GIS operation. This resulting product finally provides information about permanent vegetation, loss of urban green areas and new ones. Quality control and accuracy assessment tasks are performed by means of visual interpretation and considering the LULC dataset.
								</p>
								<h3>More resources</h3>
								<ul>
									<li><a href="#" target="_blank">Dhaka Use Case – EO green areas to city liveability improvement</a></li>
									<li><a href="#" target="_blank">UN-Habitat (United Nations Human Settlement Programme). 2015. Global Public Space Toolkit: From Global Principles to Local Policies and Practice. Nairobi, Kenya: UN-Habitat.</a></li>
									<li><a href="https://land.copernicus.eu/local/urban-atlas" target="_blank">Urban Atlas website</a></li>
								</ul>
							</section>
						</div>
					: null }
			</>
		);
	}
}

export default GreenAreas;


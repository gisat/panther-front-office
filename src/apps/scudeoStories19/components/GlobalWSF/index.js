import React from 'react';
import Fade from 'react-reveal/Fade';
import fetch from "isomorphic-fetch";
import _ from 'lodash';
import {Visualization, Header} from '../Page';
import {cloneDeep} from 'lodash';

import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Select from "../../../../components/common/atoms/Select/Select";
import Deprecated_PresentationMapWithControls from "../../../../components/common/maps/Deprecated_PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import {getMergedDataset} from '../../data/wsf/data';
import conversions from '../../data/conversions';
import {getVectorLayer} from '../../data/data';
import "./styles/style.scss";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

import request from '../../../../state/_common/request';

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
	}
};

const wsfLayer = {
	name: 'Data layer',
	key: 'slums',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params:{
			layers: 'scudeo_wsf',
			styles: '',
		},
	}
};

const getRelativeAnnualPercentageGrowth = (properties, year, years) => {
	const yearCoverageKey = `${year}_coverage`;
	
	if(properties.hasOwnProperty(yearCoverageKey)) {
		const coverage = conversions.toSquareKm(properties[yearCoverageKey]);
		
		let n = 1;
		let prevYearCoverageKey = `${years[years.indexOf(year) - n]}_coverage`;
		let prevCoverage = null;
		while (!properties.hasOwnProperty(prevYearCoverageKey)) {
			n++
			const prevYearIndex = years.indexOf(year) - n;
			prevYearCoverageKey = `${years[prevYearIndex]}_coverage`;

			if(prevYearIndex < 0) {
				break;
			}
		}

		if(properties.hasOwnProperty(prevYearCoverageKey)) {
			prevCoverage = conversions.toSquareKm(properties[prevYearCoverageKey]);
		}

		if(prevCoverage) {
			const coverageGrowth = coverage - prevCoverage;
			return (coverageGrowth / (prevCoverage/100)) / n;
		} else {
			return null;
		}
	} else {
		return null
	}
}

const getAnnualCoverageGrowth = (properties, year, years) => {
	const yearCoverageKey = `${year}_coverage`;
	
	if(properties.hasOwnProperty(yearCoverageKey)) {
		const coverage = conversions.toSquareKm(properties[yearCoverageKey]);
		
		let n = 1;
		let prevYearCoverageKey = `${years[years.indexOf(year) - n]}_coverage`;
		let prevCoverage = null;
		while (!properties.hasOwnProperty(prevYearCoverageKey)) {
			n++
			const prevYearIndex = years.indexOf(year) - n;
			prevYearCoverageKey = `${years[prevYearIndex]}_coverage`;

			if(prevYearIndex < 0) {
				break;
			}
		}

		if(properties.hasOwnProperty(prevYearCoverageKey)) {
			prevCoverage = conversions.toSquareKm(properties[prevYearCoverageKey]);
		}

		if(prevCoverage) {
			const coverageGrowth = coverage - prevCoverage;
			return coverageGrowth;
		} else {
			return null;
		}
	} else {
		return null
	}
}

const years = [1985, 1990, 1995, 2000, 2005, 2010, 2015];
const allYears = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015];
const getSerialData = (properties) => {
	const serialData = [];
	for (const [index, year] of allYears.entries()) {
		const yearCoverageKey = `${year}_coverage`;
		
		if(properties.hasOwnProperty(yearCoverageKey)) {
			const coverage = conversions.toSquareKm(properties[yearCoverageKey]);
			const relativeAnnualPercentageGrowth = getRelativeAnnualPercentageGrowth(properties, year, allYears);
			let annualCoverageGrowth = getAnnualCoverageGrowth(properties, year, allYears);;
			let annualPercentagePopulationGrowth = null;
			let urbanExpansionCoefficient = null;
			//omit first year
			if(index > 0) {
				// population for Urban Expansion Coefficient
				if(years.includes(year)) {
					const yearPopulationKey = `${year}_population`;
					const prevYearPopulationKey = `${years[years.indexOf(year)-1]}_population`;
					const population = properties[yearPopulationKey];
					const prevPopulation = properties[prevYearPopulationKey];
					const prevYearCoverageKey = `${years[years.indexOf(year)-1]}_coverage`;
					const prevCoverage = conversions.toSquareKm(properties[prevYearCoverageKey]);
					const coverageGrowth = coverage - prevCoverage;
					const populationGrowth = population && prevPopulation && population - prevPopulation;
					
					if(populationGrowth) {
						annualPercentagePopulationGrowth = populationGrowth / (prevPopulation/100);
						const lastFiveYearsRelativeAnnualPercentageGrowth = getRelativeAnnualPercentageGrowth(properties, year, years);
						urbanExpansionCoefficient = lastFiveYearsRelativeAnnualPercentageGrowth / annualPercentagePopulationGrowth
					}
				}
			}

			serialData.push({
				coverage,
				relativeAnnualPercentageGrowth,
				annualCoverageGrowth,
				annualPercentagePopulationGrowth,
				urbanExpansionCoefficient,
				year,
				name: `${year - 5} - ${year}`
			})
		}
	}
	return serialData;
}


const transformDataset = (dataset) => {
	return dataset.map((d) => {
		const feature = d.features[0];
		return {
			...feature,
			key: d.key,
			name: d.name,
			color: d.color,
			properties: {
				...feature.properties,
				sampleSerialData:  getSerialData(feature.properties)
			}
		}
	})
};

class GlobalWSF extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			dataset: null,
			loading: null,
			cityOne: null,
			cityTwo: null,
			mapLegendData: null,
			selectedOption: {
				value: null,
				id: 'unlimited',
			},
			growRateOption: {
				value: null,
				id: 'unlimited',
			},
		};

		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.handleGrowRateOptionChange = this.handleGrowRateOptionChange.bind(this);
	}

	componentDidMount() {
		getMergedDataset().then((dataset) => {
			const wsfData = transformDataset(dataset);
			const vectorLayer = getVectorLayer(dataset.map(d => ({data:d})));
			
			this.setState({
				wsfData,
				dataset,
				loading: false,
				cityOne: wsfData[23],
				cityTwo: wsfData[1],
				vectorLayer,
			});
		});

		// Get legend for map
		fetch(wsfLayer.options.url + 'service=WMS&request=GetLegendGraphic&layer=' + wsfLayer.options.params.layers + '&FORMAT=application/json', {
			method: 'GET'
		}).then(response => {
			let contentType = response.headers.get('Content-type');
			if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
				response.json().then(data => {
					let mapLegendData = _.get(data, 'Legend[0].rules[0].symbolizers[0].Raster.colormap.entries');
					if (mapLegendData) {
						let finalData = [];
						let noData = null;
						mapLegendData.forEach(item => {
							if (item.label !== 'NoData') {
								finalData.push(item);
							} else {
								noData = {
									label: 'No data',
									color: item.color
								};
							}
						});

						if (noData) {
							finalData.push(noData);
						}

						this.setState({mapLegendData: finalData});
					}
				});
			} else {
				console.warn('Legend request error');
			}
		});
	}

	onCityChange(city, data) {
		this.setState({
			[city]: data
		});
	}

	renderMapLegend() {
		return this.state.mapLegendData.map((item, index) => {
			return (
				<div className="legend-field" key={index}>
					<div className="legend-color" style={{background: item.color}}></div>
					<div className="legend-value">{item.label}</div>
				</div>
			);
		});
	}

	handleOptionChange(changeEvent) {
		this.setState({
		  selectedOption: {
			  value: changeEvent.target.value === 'unlimited' ? null : parseInt(changeEvent.target.value),
			  id: changeEvent.target.value,
			}
		});
	}

	handleGrowRateOptionChange(changeEvent) {
		this.setState({
			growRateOption: {
			  value: changeEvent.target.value === 'unlimited' ? null : parseInt(changeEvent.target.value),
			  id: changeEvent.target.value,
			}
		});
	}

	render() {

		const layers = [wsfLayer, this.state.vectorLayer];

		const settlementAreaExpansionCoverageData = this.state.wsfData ? cloneDeep(this.state.wsfData) : null;
		const settlementAreaExpansionData = this.state.wsfData ? cloneDeep(this.state.wsfData) : null;
		const urbanExpansionCoefficientData = this.state.wsfData ? cloneDeep(this.state.wsfData) : null;
		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Global Urban Growth Dynamics Monitoring"
					intro="EO data can now provide unprecedent insight into long term trends of urban growth dynamics"
					abstract="The urbanized World is our playground. Facing a global massive urbanization trends in climate change context, urban expansion needs to be monitored to ensure it proceeds on a sustainable basis, does not impair or overexploit environmental resources, nor worsen the quality and life and safety of urban population. Nowadays, superb EO based global products are available for urban studies in rich spatial-temporal context, quickly and accurately."
				/>


				{
					this.state.cityOne ? 

					<div className="scudeoStories19-content">
						<section key="section-1">
							<div>
								<p>
									Booming cities accommodate already more than half the world’s population and concentrate our current challenges and opportunities, problems, threads, but also potential solutions. Cities or better urbanized areas are now on the front line of the management of rapid changes and play a leading role in the global sustainable development agenda. It is only through cities that global missions in poverty reduction, social cohesion, sustainable economic growth, environmental responsiveness and climate change adaptation may be addressed together. Beside retrofitting, redevelopment or greening of existing mature cities, we need to prepare emerging cities in Asia, Africa and South America for their inevitable expansion while it happens. Through good governance and effective partnerships, cities can help eliminate poverty and reduce inequality. Their challenge is to function not only as engines of economic growth but also as agents of change for greater social justice and environmental sustainability. Our today’s decisions will be harvested as our future successes or failures.
								</p>
							</div>
							<div>
								<p>
									Reliably monitoring global urbanization is of key importance to accurately estimate the distribution of the continually expanding population, along with its effects on the use of resources (e.g. soil, energy, water), infrastructure and transport needs, socioeconomic development, human health, food security, etc. In this context, while in the last few years several global layers mapping the actual settlement extent have been presented in the literature, so far only few datasets outline the settlement growth over time, which is fundamental for modelling ongoing trends and implementing dedicated suitable planning strategies. Furthermore, the existing products are mostly available for a limited number of time steps in the past and their quality – yet by simple qualitative assessment against e.g. Google Earth historical HR and VHR imagery – appears rather poor. To overcome this limitation, the German Aerospace Center (DLR) in collaboration with the Google Earth Engine (GEE) team has designed and implemented a novel dataset WSF (World Settlement Footprint) Evolution aimed at outlining the settlement extent globally and on a yearly basis from 1985 to 2015. It is a revolutionary global product in support to a variety of end users in the framework of several thematic applications.
								</p>
							</div>



							<Fade left distance="50px">
								<Visualization
									title="Settlement Area Expansion (1985-2015)"
									description="The WSF Evolution data outlines the growth of settlement extent globally at 30m spatial resolution and high temporal frequency (yearly) from 1985 to 2015. Spatial temporal patterns can be easily observed and compared for different cities to understand urban growth dynamics in time as seen above."
									legend={
										<div className="scudeoStories19-visualization-legend">
											{this.state.mapLegendData ? this.renderMapLegend() : null}
										</div>
									}
								>
									<div className="scudeoStories19-map-container">
										<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
											<Deprecated_PresentationMapWithControls
												map={
													<LeafletMap
														mapKey="scudeoStories19-urbanExtent-map-1"
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
													<Select
														onChange={this.onCityChange.bind(this, 'cityOne')}
														options={this.state.wsfData}
														optionLabel="name"
														optionValue="key"
														value={this.state.cityOne}
														menuPortalTarget={this.props.pageKey}
													/>
												</div>
												<div className="scudeoStories19-map-attribution ptr-dark">
													© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attribution/#basemaps" target="_blank">CARTO</a>
												</div>
											</Deprecated_PresentationMapWithControls>
										</AdjustViewOnResizeLeafletWrapper>
										<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityTwo.geometry}>
											<Deprecated_PresentationMapWithControls
												map={
													<LeafletMap
														mapKey="scudeoStories19-urbanExtent-map-2"
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
													<Select
														onChange={this.onCityChange.bind(this, 'cityTwo')}
														options={this.state.wsfData}
														optionLabel="name"
														optionValue="key"
														value={this.state.cityTwo}
														menuPortalTarget={this.props.pageKey}
													/>
												</div>
												<div className="scudeoStories19-map-attribution ptr-dark">
													© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attribution/#basemaps" target="_blank">CARTO</a>
												</div>
											</Deprecated_PresentationMapWithControls>
										</AdjustViewOnResizeLeafletWrapper>
									</div>
								</Visualization>
							</Fade>

							<HoverHandler
								selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
							>
								<Fade left distance="50px">
									<Visualization
										title="Settlement Area Expansion (area growth in km2)"
										description="The documentation of urban expansion over time can reveal different phases of urbanisation over time as illustrated above - early growth period, slow or rapid expansion, acceleration or saturation. Information about expansion phase and its dynamics are important to cluster cities with similar evolution path and lesson-learned exchange between individual cities. "
									>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<LineChart
													key="line-chart-1"

													data={settlementAreaExpansionCoverageData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="coverage"
													colorSourcePath="color"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														max: this.state.selectedOption.value,
														name: "Settlement area",
														unit: "km2"
													}}

													height={30}

													legend
												/>
												<div className="scudeoStories19-inline-radio">
													<span className={"label"}>
														Maximum settlement are (km2):
													</span>
													<div className="radio">
														<label>
															<input type={'radio'} value={'unlimited'} checked={this.state.selectedOption.id === 'unlimited'} onChange={this.handleOptionChange}/>
															<span>
																Full range
															</span>
														</label>
													</div>
													<div className="radio">
														<label>
															<input type={'radio'} value={2000} checked={this.state.selectedOption.id === '2000'} onChange={this.handleOptionChange}/>
															<span>
																2000 km2
															</span>
														</label>
													</div>
													<div className="radio">
														<label>
															<input type={'radio'} value={500} checked={this.state.selectedOption.id === '500'} onChange={this.handleOptionChange}/>
															<span>
																500 km2
															</span>
														</label>
													</div>
												</div>
											</div>
										</Fade>
									</Visualization>
								</Fade>
							</HoverHandler>

							<HoverHandler
								selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
							>
								<Fade left distance="50px">
									<Visualization
										title="Settlement Area Expansion (annual growth rate in %)"
										description="Similarly, urban expansion rate over time can be also compared between different cities as illustrated above to explore development trajectories in the context of urban policy framework in particular city and time."
									>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<LineChart
													key="line-chart-2"

													data={settlementAreaExpansionData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="relativeAnnualPercentageGrowth"
													colorSourcePath="color"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														max: this.state.growRateOption.value,
														name: "Settlement growth",
														unit: "%"
													}}

													height={22}
													legend
												/>
											<div className="scudeoStories19-inline-radio">
													<span className={"label"}>
													Maximum settlement area growth rate (%):
													</span>
													<div className="radio">
														<label>
															<input type={'radio'} value={'unlimited'} checked={this.state.growRateOption.id === 'unlimited'} onChange={this.handleGrowRateOptionChange}/>
															<span>
																Full range
															</span>
														</label>
													</div>
													<div className="radio">
														<label>
															<input type={'radio'} value={15} checked={this.state.growRateOption.id === '15'} onChange={this.handleGrowRateOptionChange}/>
															<span>
																15%
															</span>
														</label>
													</div>
													<div className="radio">
														<label>
															<input type={'radio'} value={5} checked={this.state.growRateOption.id === '5'} onChange={this.handleGrowRateOptionChange}/>
															<span>
																5%
															</span>
														</label>
													</div>
												</div>
											</div>
										</Fade>
									</Visualization>
								</Fade>
							</HoverHandler>

							<HoverHandler
								selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
							>
								<Fade left distance="50px">
									<Visualization
										title="Urban Expansion Coefficient"
										description="To better understand the pattern of urban growth end its efficiency the urban expansion coefficient (UEC) is presented. Level of urban growth efficiency is given by the ratio between the settlement area growth and urban population growth. UEC values above 1 indicate the prevailing expansion while values below 1 indicate prevailing densification. Densification is  is supposed to be more effective growth pattern as less non-urban area is consumed per capita. Figure presents the evolution of the UEC in each city in 5 year intervals between 2000 - 2015 following the availability of population estimates within WorldPop global dataset. Source data: WSF © DLR 2019, © WorldPop 2019"
									>
										<Fade cascade>
											<div className="scudeoStories19-chart-container">
												<LineChart
													key="line-chart-3"

													data={urbanExpansionCoefficientData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="urbanExpansionCoefficient"
													pointNameSourcePath="name"
													colorSourcePath="color"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Urban Expansion Coefficient"
													}}

													height={22}
													legend
												/>
											</div>
										</Fade>
									</Visualization>
								</Fade>
							</HoverHandler>

							<p>Data are a key enabler for city innovation - fuel on which cities run – and spatial aspect plays a major role in understanding complex spatial-temporal relations in cities, supporting daily management of city assets as well as strategic planning for cities sustainable future. Current Earth Observation (EO) capacity represents a major contribution here as a large (and rapidly growing) number of satellite constellations, acquiring in different spatial, spectral and temporal resolution, are currently available for integration with other types of data (e.g. open data, sensors, citizen science data) for the benefit of various urban domains. The WSF Evolution dataset satisfy a growing need for global harmonised data urban expansion allowing holistic view on global planetary urbanisation issue and identification of future development potential in different world regions. </p>

							<h2>About WSF Evolution</h2>
							<p>WSF Evolution is a revolutionary global product leveraging previous DLR experiences with GUF and WSF2015 products. First, under the assumption that pixels categorized as non-settlement at a later time cannot be marked as settlement at an earlier time, all areas excluded from the World Settlement Footprint (WSF2015) (i.e., the currently existing most updated and accurate mask outlining the 2015 global settlement extent) are discarded a priori from the analysis. Next, for each target year in the past all available Landsat scenes acquired with cloud cover lower than 60% over the investigated area of interest are gathered and cloud masking is performed. Key temporal statistics (i.e., temporal mean, minimum, maximum, etc.) are then extracted for different spectral indices including the normalized difference built-up index (NDBI), the normalized difference vegetation index (NDVI) and the modified normalized difference water index (MNDWI). Going backwards in time, training samples for the given target year are iteratively extracted by applying morphological filtering to the settlement mask derived for the previous time step as well as excluding potentially mis-labelled samples by adaptive thresholding on the temporal mean NDBI, MNDWI and NDVI. Finally, random forest classification in performed.</p>
							<p>Extensive experimental analyses over several challenging test sites distributed over the five continents assessed the high effectiveness of the methodology. Accordingly, in the light of it great robustness, the technique has been employed within the GEE environment for generating the WSF Evolution, i.e. a novel dataset aimed at outlining the settlement extent globally and on a yearly basis from 1985 to 2015. The WSF Evolution was completed by the end of 2018 and is envisaged to be made available open and free (after accurate post-processing and accuracy assessment) during 2019. In particular, the dataset is expected to become a global urban product of unprecedent in support to a variety of end users in the framework of several thematic applications, helping to understand as never before how urbanization took place over three decades while capturing specific temporal trends.</p>

							{/*TODO tady Tomáš nedodal linky*/}
							{/*<h3>More resources</h3>*/}
							{/*<ul>*/}
								{/*<li><a href="#" target="_blank">WSF Evolution description</a></li>*/}
								{/*<li><a href="#" target="_blank">Quality Assessment document</a></li>*/}
								{/*<li><a href="#" target="_blank">Link to UTEP with WSF Evolution data?</a></li>*/}
							{/*</ul>*/}
						</section>
					</div> : null }
			</>
		);
	}
}

export default GlobalWSF;


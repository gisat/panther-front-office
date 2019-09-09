import React from 'react';
import Fade from 'react-reveal/Fade';
import {Visualization, Header} from '../Page';
import {cloneDeep} from 'lodash';

import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Select from "../../../../components/common/atoms/Select/Select";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import {getMergedDataset} from '../../data/wsf/data';
import conversions from '../../data/conversions';
import {getVectorLayer} from '../../data/data';
import "./styles/style.scss";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

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

const getAnnualPercentageGrowth = (properties, year, years) => {
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
			const relativeCoverageGrowth = getRelativeAnnualPercentageGrowth(properties, year, allYears);
			let annualPercentageGrowth = getAnnualPercentageGrowth(properties, year, allYears);;
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
						urbanExpansionCoefficient = annualPercentageGrowth / annualPercentagePopulationGrowth
					}
				}
			}

			serialData.push({
				coverage,
				relativeCoverageGrowth,
				annualPercentageGrowth,
				annualPercentagePopulationGrowth,
				urbanExpansionCoefficient,
				year,
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
		};
	}

	componentDidMount() {
		getMergedDataset().then((dataset) => {
			const wsfData = transformDataset(dataset);
			const vectorLayer = getVectorLayer(dataset.map(d => ({data:d})));
			
			this.setState({
				wsfData,
				dataset,
				loading: false,
				cityOne: wsfData[0],
				cityTwo: wsfData[1],
				vectorLayer,
			});
		})
	}

	onCityChange(city, data) {
		this.setState({
			[city]: data
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
					title="EO data can provide insight into long term trends of urban growth dynamics"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
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
								>
									<div className="scudeoStories19-map-container">
										<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
											<PresentationMapWithControls
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
											</PresentationMapWithControls>
										</AdjustViewOnResizeLeafletWrapper>
										<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityTwo.geometry}>
											<PresentationMapWithControls
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
											</PresentationMapWithControls>
										</AdjustViewOnResizeLeafletWrapper>
									</div>
								</Visualization>
							</Fade>

							<Fade left distance="50px">
								<Visualization
									title="Settlement Area Expansion (area growth in km2)"
									description="The documentation of urban expansion over time can reveal different phases of urbanisation over time as illustrated above - early growth period, slow or rapid expansion, acceleration or saturation."
								>
									<Fade cascade>
										<div className="scudeoStories19-chart-container">
											<HoverHandler
												selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
											>
												<LineChart
													key="line-chart-1"

													data={settlementAreaExpansionCoverageData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="coverage"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Settlement area",
														unit: "km2"
													}}

													height={22}

													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>
							
							<Fade left distance="50px">
								<Visualization
									title="Settlement Area Expansion (annual growth rate in %)"
									description="Similarly, urban expansion rate over time can be also compared between different cities as illustrated above."
								>
									<Fade cascade>
										<div className="scudeoStories19-chart-container">
											<HoverHandler
												selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
											>
												<LineChart
													key="line-chart-2"

													data={settlementAreaExpansionData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="annualPercentageGrowth"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Settlement growth",
														unit: "%"
													}}

													height={22}
													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>

							<Fade left distance="50px">
								<Visualization
									title="Urban Expansion Coefficient (2000-2005, 2005-2010, 2010-2015)"
									description="To better understand the pattern of urban growth end its efficiency the urban expansion coefficient (UEC) is presented. Level of urban growth efficiency is given by the ratio between the settlement area growth and urban population growth. UEC values above 1 indicate the prevailing expansion while values below 1 indicate prevailing densification. Densification is  is supposed to be more effective growth pattern as less non-urban area is consumed per capita. Figure presents the evolution of the UEC in each city in 5 year intervals between 2000 - 2015 following the availability of population estimates within WorldPop global dataset. Source data: WSF © DLR 2019, © WorldPop 2019"
								>
									<Fade cascade>
										<div className="scudeoStories19-chart-container">
											<HoverHandler
												selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
											>
												<LineChart
													key="line-chart-3"

													data={urbanExpansionCoefficientData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="urbanExpansionCoefficient"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Urban Expansion Coefficient",
														unit: "k%"
													}}

													height={22}
													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>

							<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
							<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

							<h3>More resources</h3>
							<ul>
								<li><a href="#" target="_blank">Link A ullamcorper urna</a></li>
								<li><a href="#" target="_blank">Link B libero ac leo</a></li>
								<li><a href="#" target="_blank">Link C Curabitur volutpat lacus at eros luctus</a></li>
							</ul>
						</section>
					</div> : null }
			</>
		);
	}
}

export default GlobalWSF;


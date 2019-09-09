import React from 'react';
import Fade from 'react-reveal/Fade';
import {Visualization, Header} from '../Page';

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
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
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

const years = [1985, 1990, 1995, 2000, 2005, 2010, 2015];
const getSerialData = (properties) => {
	const serialData = [];
	for (const [index, year] of years.entries()) {
		const yearCoverageKey = `${year}_coverage`;
		const firstYearCoverageKey = `${1985}_coverage`;
		if(properties.hasOwnProperty(yearCoverageKey)) {
			const coverage = conversions.toSquareKm(properties[yearCoverageKey]);
			const relativeCoverageGrowth = coverage - conversions.toSquareKm(properties[firstYearCoverageKey]);
			let annualPercentageGrowth = 0;
			let annualPercentagePopulationGrowth = null;
			let urbanExpansionCoefficient = null;
			//omit first year
			if(index > 0) {
				const yearPopulationKey = `${year}_population`;
				const prevYearPopulationKey = `${years[index-1]}_population`;
				const population = properties[yearPopulationKey];
				const prevPopulation = properties[prevYearPopulationKey];
				const prevYearCoverageKey = `${years[index-1]}_coverage`;
				const prevCoverage = conversions.toSquareKm(properties[prevYearCoverageKey]);
				const coverageGrowth = coverage - prevCoverage;
				const populationGrowth = population && prevPopulation && population - prevPopulation;
				annualPercentageGrowth = coverageGrowth / (prevCoverage/100);
				if(populationGrowth) {
					annualPercentagePopulationGrowth = populationGrowth / (prevPopulation/100);
					urbanExpansionCoefficient = annualPercentageGrowth / annualPercentagePopulationGrowth
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

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Global urban growth dynamic monitoring"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>


				{
					this.state.cityOne ? 

					<div className="scudeoStories19-content">
						<section key="section-1">
							<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>


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
												<div className="scudeoStories19-map-attribution">
													Add <a href="#" target="_blank">attribution</a> according to used background map. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus.
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
											</PresentationMapWithControls>
										</AdjustViewOnResizeLeafletWrapper>
									</div>
								</Visualization>
							</Fade>

							<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

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

													data={this.state.wsfData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="relativeCoverageGrowth"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Settlement area",
														unit: "km2"
													}}

													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>
							
							<Fade left distance="50px">
								<Visualization
									title="Settlement Area Expansion (annual growth rate in %, base = 1985)"
									description="Similarly, urban expansion rate over time can be also compared between different cities as illustrated above."
								>
									<Fade cascade>
										<div className="scudeoStories19-chart-container">
											<HoverHandler
												selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
											>
												<LineChart
													key="line-chart-1"

													data={this.state.wsfData}
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

													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>

							<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

							<Fade left distance="50px">
								<Visualization
									title="Urban Expansion Coefficient"
									description="The documentation of urban expansion over time can reveal different phases of urbanisation over time as illustrated above - early growth period, slow or rapid expansion, acceleration or saturation."
								>
									<Fade cascade>
										<div className="scudeoStories19-chart-container">
											<HoverHandler
												selectedItems={[this.state.cityOne.key, this.state.cityTwo.key]}
											>
												<LineChart
													key="line-chart-1"

													data={this.state.wsfData}
													keySourcePath="key"
													nameSourcePath="name"
													serieDataSourcePath="properties.sampleSerialData"
													xSourcePath="year"
													ySourcePath="urbanExpansionCoefficient"

													xValuesSize={2.5}

													yLabel
													yOptions={{
														name: "Settlement area",
														unit: "km2"
													}}

													legend
												/>
											</HoverHandler>
										</div>
									</Fade>
								</Visualization>
							</Fade>

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


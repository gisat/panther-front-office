import React from 'react';
import Fade from 'react-reveal/Fade';
import {Visualization, Header} from '../Page';

import mockData from '../../mockData';
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Select from "../../../../components/common/atoms/Select/Select";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";

import "./styles/style.scss";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

const data = mockData;

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
	}
};

let vectorLayers = [{
	key: 'aoi-vector',
	name: 'AOI',
	type: 'vector',
	options: {
		keyProperty: 'key',
		nameProperty: 'name',
		features: data
	}
}];


class GlobalWSF extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			cityOne: data[2],
			cityTwo: data[3]
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
					title="Global urban growth dynamic monitoring"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section key="section-1">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>


						<Fade left distance="50px">
							<Visualization
								title="Settlement Area Expansion (1985-2015)"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<div className="scudeoStories19-map-container">
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
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
													options={data}
													optionLabel="properties.name"
													optionValue="properties.key"
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
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
											<div className="scudeoStories19-map-label">
												<Select
													onChange={this.onCityChange.bind(this, 'cityTwo')}
													options={data}
													optionLabel="properties.name"
													optionValue="properties.key"
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
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler
											selectedItems={[this.state.cityOne.properties.key, this.state.cityTwo.properties.key]}
										>
											<LineChart
												key="line-chart-1"

												data={data}
												keySourcePath="properties.key"
												nameSourcePath="properties.name"
												serieDataSourcePath="properties.sampleSerialData"
												xSourcePath="period"
												ySourcePath="someStrangeValue"

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
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler
											selectedItems={[this.state.cityOne.properties.key, this.state.cityTwo.properties.key]}
										>
											<LineChart
												key="line-chart-1"

												data={data}
												keySourcePath="properties.key"
												nameSourcePath="properties.name"
												serieDataSourcePath="properties.sampleSerialData"
												xSourcePath="period"
												ySourcePath="someStrangeValue"

												xValuesSize={2.5}

												yLabel
												yOptions={{
													name: "Settlement are growth",
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
								title="Settlement Area (km2) vs. Population (100k inhabitants) (2015)"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler
											selectedItems={[this.state.cityOne.properties.key, this.state.cityTwo.properties.key]}
										>
											<ScatterChart
												key="scatter-chart-1"

												data={data}
												keySourcePath="properties.key"
												nameSourcePath="properties.name"
												xSourcePath="properties.sampleSerialData[0].someStrangeValue"
												ySourcePath="properties.population"

												yLabel
												yValuesSize={3.5}
												yOptions={{
													name: "Area",
													unit: "unit"
												}}
												xLabel
												xValuesSize={2}
												xOptions={{
													name: "Population",
													unit: "100k"
												}}

												legend
												defaultSchemePointColors
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
				</div>
			</>
		);
	}
}

export default GlobalWSF;


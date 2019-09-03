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
import {getMergedDataset, clearEmptyNodes} from '../../data/data';
import './styles/style.scss';

const mergedDataset = getMergedDataset();

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
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

const slumAreasVsCityTotalAreas = mergedDataset.map((dataSet) => {
	const area = conversions.sum(dataSet.data.features, 'properties.area') / 1000000;
	// urban_2017_coverage
	const urban_coverage = conversions.sum(dataSet.data.features, `properties.urban_${dataSet.lastYear}_coverage`) / 1000000;
	// green_2017_coverage
	const green_coverage = conversions.sum(dataSet.data.features, `properties.green_${dataSet.lastYear}_coverage`) / 1000000;
	const green_areas_share = area / green_coverage;
	return {
		area,
		urban_coverage,
		green_coverage,
		green_areas_share,
		key: dataSet.key,
		name: dataSet.name,
	}
});


class GreenAreas extends React.PureComponent {
	static propTypes = {

	};


	constructor(props) {
		super(props);
		this.state = {
			city: mergedDataset[1]
		};
	}

	onCityChange(data) {
		this.setState({
			city: data
		});
	}

	render() {
		const vectorLayers = [{
			key: 'aoi-vector',
			name: 'AOI',
			type: 'vector',
			options: {
				keyProperty: 'AL3_ID',
				nameProperty: 'AL3_NAME',
				features: this.state.city.data
			}
		}];

		const densificationsData = filterGreenAreaFlows(this.state.city.l4OverallFlows);

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Green, open and public spaces monitoring"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section key="section-1">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

						<Fade left distance="50px">
							<Visualization
								title="Green Areas Share (%)"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ColumnChart
												key="green-areas-stacked-chart"

												data={slumAreasVsCityTotalAreas}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="name"
												ySourcePath="green_areas_share"
												defaultColor="#42982e"
												highlightColor="#39782b"
												xValuesSize={5.5}

												yLabel
												yOptions={{
													name: "Share",
													unit: "%"
												}}
											/>
										</HoverHandler>
									</div>
								</Fade>
							</Visualization>
						</Fade>

						<Fade left distance="50px">
							<Visualization
								title="Green Areas vs. Urban Areas"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade className="aaaa">
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ScatterChart
												key="scatter-chart-1"

												data={slumAreasVsCityTotalAreas}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="green_coverage"
												ySourcePath="urban_coverage"

												yLabel
												yValuesSize={3.5}
												yOptions={{
													name: "Urban area",
													unit: "km2"
												}}
												xLabel
												xValuesSize={3}
												xOptions={{
													name: "Green area",
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
								title="Green Areas vs. City Total Area"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade className="aaaa">
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ScatterChart
												key="scatter-chart-1"

												data={slumAreasVsCityTotalAreas}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="urban_coverage"
												ySourcePath="area"

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
											/>
										</HoverHandler>
									</div>
								</Fade>
							</Visualization>
						</Fade>
					</section>



					<section key="section-2">
						<h2>Green Areas Distribution</h2>
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

						<Fade left distance="50px">
							<Visualization
								title="Green Areas Distribution"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<div className="scudeoStories19-map-container">
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.city.data}>
										<PresentationMapWithControls
											map={
												<LeafletMap
													mapKey="scudeoStories19-greenAreas-map-1"
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
													onChange={this.onCityChange.bind(this)}
													options={mergedDataset}
													optionLabel="name"
													optionValue="key"
													value={this.state.city}
													menuPortalTarget={this.props.pageKey}
												/>
											</div>
											<div className="scudeoStories19-map-attribution">
												Add <a href="#" target="_blank">attribution</a> according to used background map. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus.
											</div>
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
								</div>
							</Visualization>
						</Fade>
						<Fade left distance="50px">
							<Visualization
								title="Green Area Flows"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

									<HoverHandler>
										<SankeyChart
											hoverValueSourcePath="valueSize"
											key="sankey-green-area-flows"
											data={densificationsData}
											keySourcePath="key"

											nodeNameSourcePath="name"
											nodeValueSourcePath="value"
											nodeColorSourcePath="color"
											
											linkNameSourcePath="name"
											hoverValueSourcePath="value"

											maxWidth = {50}
											width={50}
											height={50}
											yOptions={{
												unit: '%'
											}}
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

export default GreenAreas;


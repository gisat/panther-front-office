import React from 'react';
import Fade from "react-reveal/Fade";
import {Header, Visualization} from "../Page";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";

import conversions from "../../data/conversions";
import LayerSelect from "../LayerSelect/index";

import './styles/style.scss';
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import Select from "../../../../components/common/atoms/Select/Select";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

//Data
import dhakaDataset from './data/dhaka.json';
import otherDataset from './data/dhaka.json';

const mergedDataset = [
	{
		data: dhakaDataset,
		name: 'Dhaka',
		key: 1,
	},
	{
		data: otherDataset,
		name: 'Dillí',
		key: 2,
	},
]

const OSM = {
	name: 'OSM',
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
	}
};

const wildAreas = {
	name: 'Wild Areas',
	key: 'wildAreas',
	type: 'wms',
	options: {
		url: 'https://sedac.ciesin.columbia.edu/geoserver/wms',
		params:{
			layers: 'wildareas-v2:wildareas-v2-human-footprint-geographic',
			styles: '',
		},
	}
};

const backgroundLayers = [
	OSM,
	wildAreas
]

const slumsAreaShare = mergedDataset.map((dataSet) => (
	{
		value: conversions.avarage(dataSet.data.features, 'properties.informal_percentage'),
		key: dataSet.key,
		name: dataSet.name,
	})
);

const slumAreasVsUrbanAreas = mergedDataset.map((dataSet) => (
	{
		slumAreas: conversions.avarage(dataSet.data.features, 'properties.informal_coverage'),
		urbanAreas: conversions.avarage(dataSet.data.features, 'properties.urban_coverage'),
		key: dataSet.key,
		name: dataSet.name,
	})
);

const slumAreasVsCityTotalAreas = mergedDataset.map((dataSet) => (
	{
		slumAreas: conversions.avarage(dataSet.data.features, 'properties.informal_coverage'),
		cityArea: conversions.sum(dataSet.data.features, 'properties.urban_coverage'),
		key: dataSet.key,
		name: dataSet.name,
	})
);


class SlumsMonitoring extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			city: mergedDataset[0],
			backgroundLayer: backgroundLayers[0]
		};
	}

	onCityChange(data) {
		this.setState({
			city: data
		});
	}

	onBackgroundLayerChange(data) {
		this.setState({
			backgroundLayer: data
		});
	}

	render() {

		let vectorLayers = [{
			key: 'aoi-vector',
			name: 'AOI',
			type: 'vector',
			options: {
				keyProperty: 'AL3_ID',
				nameProperty: 'AL3_NAME',
				features: this.state.city.data
			}
		}];

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Slums Monitoring"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section key="section-1">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
						<Fade left distance="50px">
							<Visualization
								title="Slum Areas Share  (%)"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ColumnChart
												key="green-areas-stacked-chart"

												data={slumsAreaShare}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="name"
												ySourcePath="value"


												yLabel
												yOptions={{
													name: "Percentage",
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
								title="Slum Areas vs. Urban Areas"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade className="aaaa">
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ScatterChart
												key="scatter-chart-1"

												data={slumAreasVsUrbanAreas}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="slumAreas"
												ySourcePath="urbanAreas"

												yLabel
												yValuesSize={3.5}
												yOptions={{
													name: "Urban area",
													unit: "km2"
												}}
												xLabel
												xValuesSize={3}
												xOptions={{
													name: "Slum area",
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
								title="Slum Areas vs. City total Area"
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
												xSourcePath="slumAreas"
												ySourcePath="cityArea"

												yLabel
												yValuesSize={8}
												yOptions={{
													name: "City area",
													unit: "km2"
												}}
												xLabel
												xValuesSize={8}
												xOptions={{
													name: "Slum area",
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
						<h2>City example</h2>
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
													backgroundLayer={this.state.backgroundLayer}
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
											<div className="scudeoStories19-map-label scudeoStories19-map-layers">
												<LayerSelect
													onChange={this.onBackgroundLayerChange.bind(this)}
													options={backgroundLayers}
													optionLabel="name"
													optionValue="key"
													value={this.state.backgroundLayer}
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

export default SlumsMonitoring;


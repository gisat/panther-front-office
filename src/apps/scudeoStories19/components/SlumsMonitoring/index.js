import React from 'react';
import Fade from "react-reveal/Fade";
import {Header, Visualization} from "../Page";
import {HoverHandler} from "@gisatcz/ptr-core";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";

import conversions from "../../data/conversions";
import LayerSelect from "../LayerSelect/index";

import './styles/style.scss';
import Deprecated_PresentationMapWithControls from "../../../../components/common/maps/Deprecated_PresentationMapWithControls";
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import MapControls from "../../../../components/common/maps/controls/MapControls/presentation";
import Select from "../../../../components/common/atoms/Select/Select";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";
import {getMergedDataset, getVectorLayer} from '../../data/data';

const wantedDatasources = ['Arusha','Dhaka','Dodoma','Kigoma','Mbeya','Mtwara','Mwanza'];

const empty = {
	name: 'No overlay',
	key: 'empty',
};

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

const dataLayer = {
	name: 'Data layer',
	key: 'slums',
	type: 'wms',
	options: {
		url: 'https://urban-tep.eu/puma/geoserver/wms?',
		params:{
			layers: 'scudeo_slums',
			styles: '',
		},
	}
};

const overlayLayers = [
	empty,
	wildAreas
];


let slumsAreaShare = null;
let slumAreasVsUrbanAreas = null;
let slumAreasVsCityTotalAreas = null;


const prepareData = (dataset) => {
	slumsAreaShare = dataset.map((dataSet) => {
		return {
			value: dataSet.data.features[0].properties[`informal_${dataSet.informalYear}_percentage`],
			key: dataSet.key,
			name: dataSet.name,
		}
	});
	
	slumAreasVsUrbanAreas = dataset.map((dataSet) => (
		{
			slumAreas:  dataSet.data.features[0].properties[`informal_${dataSet.informalYear}_coverage`]/ 1000000,
			urbanAreas:  dataSet.data.features[0].properties[`urban_${dataSet.lastYear}_coverage`]/ 1000000,
			key: dataSet.key,
			name: dataSet.name,
		})
	);
	
	slumAreasVsCityTotalAreas = dataset.map((dataSet) => (
		{
			slumAreas:  dataSet.data.features[0].properties[`informal_${dataSet.informalYear}_coverage`]/ 1000000,
			cityArea:  dataSet.data.features[0].properties.area/ 1000000,
			key: dataSet.key,
			name: dataSet.name,
		})
	);
}


class SlumsMonitoring extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			city: null,
			overlayLayer: overlayLayers[0],
			backgroundLayer: OSM,
			vectorLayer: null,
			dataset: null,
			loading: null,
		};
	}

	componentDidMount() {
		getMergedDataset(wantedDatasources).then((dataset) => {
			const vectorLayer = getVectorLayer(dataset);
			prepareData(dataset);
			this.setState({
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

	onOverlayChange(data) {
		this.setState({
			overlayLayer: data
		});
	}

	render() {
		const overlayLayer = this.state.overlayLayer.type ? [this.state.overlayLayer] : [];

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Slum Areas"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>

				{
					this.state.city ?
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
														defaultColor="#ce6763"
														highlightColor="#a24744"
														data={slumsAreaShare}
														keySourcePath="key"
														nameSourcePath="name"
														xSourcePath="name"
														ySourcePath="value"
														xValuesSize={4}

														yLabel
														yOptions={{
															name: "Slum area",
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
										<Fade cascade className="">
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
														xValuesSize={4}
														yValuesSize={6}
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
														xValuesSize={4}
														yValuesSize={6}
														yOptions={{
															name: "City area",
															unit: "km2"
														}}
														xLabel
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
								<h2>Slum Areas Distribution</h2>
								<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

								<Fade left distance="50px">
									<Visualization
										title="Green Areas Distribution"
										description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
									>
										<div className="scudeoStories19-map-container">
											<AdjustViewOnResizeLeafletWrapper geometry={this.state.city.data}>
												<Deprecated_PresentationMapWithControls
													map={
														<LeafletMap
															mapKey="scudeoStories19-greenAreas-map-1"
															scrollWheelZoom="afterClick"
															backgroundLayer={this.state.backgroundLayer}
															layers={[this.state.vectorLayer, dataLayer, ...overlayLayer]}
														/>
													}
													controls={
														<MapControls zoomOnly levelsBased/>
													}
												>
													<div className="scudeoStories19-map-label">
														<Select
															onChange={this.onCityChange.bind(this)}
															options={this.state.dataset}
															optionLabel="name"
															optionValue="key"
															value={this.state.city}
															menuPortalTarget={this.props.pageKey}
														/>
													</div>
													<div className="scudeoStories19-map-label scudeoStories19-map-layers">
														<LayerSelect
															onChange={this.onOverlayChange.bind(this)}
															options={overlayLayers}
															optionLabel="name"
															optionValue="key"
															value={this.state.overlayLayer}
															menuPortalTarget={this.props.pageKey}
														/>
													</div>
													<div className="scudeoStories19-map-attribution">
														Add <a href="#" target="_blank">attribution</a> according to used background map. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus.
													</div>
												</Deprecated_PresentationMapWithControls>
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
						</div> : null }
			</>
		);
	}
}

export default SlumsMonitoring;


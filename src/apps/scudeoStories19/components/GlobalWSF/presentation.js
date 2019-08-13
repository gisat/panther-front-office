import React from 'react';
import Helmet from "react-helmet";
import PropTypes from 'prop-types';
import mapUtils from '../../../../utils/map';
import {Visualization} from '../Page';

import mockData from './mockData';
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import Select from "../../../../components/common/atoms/Select/Select";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";

const BASE_MAP_SIZE = 1400; // size of map container in px, for which the view is calibrated
const data = mockData;

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
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

		this.mapRef = React.createRef();

		this.state = {
			mapSizeRatio: 1,
			cityOne: data[2],
			cityTwo: data[3]
		};
	}

	componentDidMount() {
		if (window) window.addEventListener('resize', this.resize.bind(this), {passive: true});
		this.resize();
	}

	resize() {
		if (this.mapRef && this.mapRef.current) {
			let width = this.mapRef.current.clientWidth;
			let height = this.mapRef.current.clientHeight;
			let minSize = Math.min(width, height);
			this.setState({mapSizeRatio: BASE_MAP_SIZE/minSize});
		}
	}

	onCityChange(city, data) {
		this.setState({
			[city]: data
		});
	}

	getView(city, reflectLatitude, isLeaflet) {
		let view = mapUtils.getViewFromGeometry(city.geometry, reflectLatitude);

		// TODO leaflet map doesn't adapt box range to map container size, solve it in LeafletMap component
		if (isLeaflet) {
			view.boxRange *= this.state.mapSizeRatio;
		}

		return view;
	}

	render() {
		return (
			<>
				<Helmet><title>Global WSF</title></Helmet>
				<div className="scudeoStories19-page">
					<h1>Global urban growth dynamic monitoring</h1>
					<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>



					<Visualization
						title="Settlement Area Expansion (1985-2015)"
						description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
					>
						<div className="scudeoStories19-map-container">
							<div ref={this.mapRef}>
								<PresentationMapWithControls
									map={
										<LeafletMap
											mapKey="scudeoStories19-urbanExtent-map-1"
											scrollWheelZoom="afterClick"
											view={this.getView(this.state.cityOne, true, true)}
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
										/>
									</div>
								</PresentationMapWithControls>
							</div>
							<div>
								<PresentationMapWithControls
									map={
										<LeafletMap
											mapKey="scudeoStories19-urbanExtent-map-2"
											scrollWheelZoom="afterClick"
											view={this.getView(this.state.cityTwo, true, true)}
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
										/>
									</div>
								</PresentationMapWithControls>
							</div>
						</div>
					</Visualization>


					<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

					<Visualization
						title="Settlement Area Expansion (area growth in km2)"
						description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
					>
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
										name: "Attribut name",
										unit: "unit"
									}}

									legend
								/>
							</HoverHandler>
						</div>
					</Visualization>



					<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
				</div>
			</>
		);
	}
}

export default GlobalWSF;


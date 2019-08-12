import React from 'react';
import PropTypes from 'prop-types';
import mapUtils from '../../../../utils/map';

import mockData from './mockData';
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import Select from "../../../../components/common/atoms/Select/Select";

const data = mockData;
const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
	}
};

class GlobalWSF extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			mapSizeRatio: 1,
			selectedCity: data[0]
		};

		this.mapRef = React.createRef();

		this.resize = this.resize.bind(this);
		this.onCityChange = this.onCityChange.bind(this);
	}

	componentDidMount() {
		if (window) window.addEventListener('resize', this.resize, {passive: true});
		this.resize();
	}

	onCityChange(selectedCity) {
		this.setState({selectedCity});
	}

	resize() {
		if (this.mapRef && this.mapRef.current) {
			this.setState({mapSizeRatio: this.mapRef.current.clientWidth/this.mapRef.current.clientHeight});
		}
	}

	render() {
		let view = mapUtils.getViewFromGeometry(this.state.selectedCity.geometry, true);
		view.boxRange *= this.state.mapSizeRatio;

		return (
			<div>
				<Select
					onChange={this.onCityChange}
					options={data}
					optionLabel="properties.name"
					optionValue="properties.key"
					value={this.state.selectedCity}
				/>
				<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
				<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
				<div style={{height: '30rem', marginTop: '5rem'}}>
					<div ref={this.mapRef} style={{height: '100%'}}>
						<LeafletMap
							mapKey="city-1"
							view={view}
							backgroundLayer={backgroundLayer}
							layers={[
								{
									key: 'aoi-vector',
									name: 'AOI',
									type: 'vector',
									options: {
										features: [this.state.selectedCity],
										keyProperty: 'key',
										nameProperty: 'name'
									}
								}
							]}

							scrollWheelZoom="afterClick"
						/>
					</div>
				</div>
				<HoverHandler
					selectedItems={[this.state.selectedCity.properties.key]}
				>
					<LineChart
						key="line-chart-1"

						data={data}
						keySourcePath="properties.key"
						nameSourcePath="properties.name"
						serieDataSourcePath="properties.sampleSerialData"
						xSourcePath="period"
						ySourcePath="someStrangeValue"
					/>
				</HoverHandler>
				<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
			</div>
		);
	}
}

export default GlobalWSF;


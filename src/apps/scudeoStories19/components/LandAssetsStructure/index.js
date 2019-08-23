import React from 'react';
import Fade from "react-reveal/Fade";

import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Select from "../../../../components/common/atoms/Select/Select";
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import AdjustViewOnResizeLeafletWrapper from "../AdjustViewOnResizeLeafletWrapper";

import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import * as dodoma_au_level_3 from '../../data/EO4SD_DODOMA_AL3.json';
import mockData from '../../mockData';
import conversions from "../../data/conversions";

import Helmet from "react-helmet";
import {Footer, Visualization} from '../Page';
import {Header} from "../Page";


import './styles/style.scss';

const au_3_data = dodoma_au_level_3.features;

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

class LandAssetsStructure extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			cityOne: data[2],
		};
	}


	onCityChange(city, data) {
		this.setState({
			[city]: data
		});
	}


	render() {

		const au_3_serial_as_object = conversions.featuresToSerialDataAsObject(au_3_data);

		const au_2_lulc_1_changes = conversions.getAttributeChanges(au_3_data, 'AL3_ID', [
			{key: 'as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
			{key: 'as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
			{key: 'as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
		], 2006, 2016);

		const changes = []
		for(const[key, value] of Object.entries(au_2_lulc_1_changes)) {
			const entry = au_3_data.find(a => a.properties['AL3_ID'] == key);
			const name = entry.properties.AL3_NAME;
			const positive = value.reduce((acc, val) => {

				
				acc += val.relative !== Infinity && val.relative > 0 ? val.relative : 0;
				return Math.round(acc)
			}, 0)
			const negative = value.reduce((acc, val) => {
				 acc += val.relative < 0 ? val.relative : 0;
				 return Math.round(acc)
			}, 0)
			changes.push({key, name, positive, negative, ...value})

		}
		

		const changesPerCategory = []
		for(const[key, value] of Object.entries(au_2_lulc_1_changes)) {
			const entry = au_3_data.find(a => a.properties['AL3_ID'] == key);
			const name = entry.properties.AL3_NAME;

			const values = value.reduce((acc, val) => {
				acc[`${val.key}_a`] = isNaN(val.absolute) || !isFinite(val.absolute) ? 0 : val.absolute;
				acc[`${val.key}_r`] = isNaN(val.relative)  || !isFinite(val.relative) ? 0 : val.relative;
				acc[`${val.key}_color`] = val.color;
				acc[`${val.key}_name`] = val.name;
				return acc;
			}, {});

			changesPerCategory.push({
				key,
				name,
				...values
			})
		}

		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="City Land Assets Structure and Evolution"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section>
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Structure"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">

								<HoverHandler>
									<ColumnChart
											key="lulc-structure"

											data={au_3_serial_as_object}
											keySourcePath="AL3_ID"
											nameSourcePath="AL3_NAME"
											xSourcePath="AL3_NAME"
											ySourcePath={[
												{path: 'data.2016.as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
												{path: 'data.2016.as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
												{path: 'data.2016.as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
												{path: 'data.2016.as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
												{path: 'data.2016.as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}
											]}

											height={20}
											xValuesSize={6}

											yLabel
											yOptions={{
												name: "Land cover",
												unit: "sqm"
											}}
											yValuesSize={3}

											stacked="relative"
										/>
									</HoverHandler>
								</div>
							</Fade>
						</Visualization>
					</Fade>

					<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Changes Intensity"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
							<Fade cascade>
								<div className="scudeoStories19-chart-container">
									<HoverHandler>
										<ColumnChart 
												key="diverging-bars"
												
												data={changes}
												keySourcePath="key"
												nameSourcePath="name"
												xSourcePath="name"
												ySourcePath={["positive","negative"]}
												diverging="double"
												xGridlines
												yLabel
												yOptions={{
													name: "Change",
													unit: "%"
												}}
												xValuesSize={6}
											/>
										</HoverHandler>
									</div>
							</Fade>
						</Visualization>
					</Fade>
					<Fade left distance="50px">
						<Visualization
							title="Land Cover Land Use Changes Structure"
							description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
						>
						<Fade cascade>
							<div className="scudeoStories19-chart-container">

								<HoverHandler>
									<ColumnChart 
										key="stacked-diverging-chart"
										
										data={changesPerCategory}
										keySourcePath="key"
										nameSourcePath="name"
										xSourcePath="name"
										


										ySourcePath={[
											{path: 'as_611001000_attr_61110000_r', name: 'Artificial Surfaces', color: '#ae0214'},
											{path: 'as_611001000_attr_61120000_r', name: 'Agricultural Area', color: '#ffdc9b'},
											{path: 'as_611001000_attr_61130000_r', name: 'Natural and Semi-natural Areas', color: '#59b642'},
											{path: 'as_611001000_attr_61140000_r', name: 'Wetlands', color: '#a6a6ff'},
											{path: 'as_611001000_attr_61150000_r', name: 'Water', color: '#56c8ee'}
										]}

										xGridlines

										yOptions={{ 
											name: "Random attribute"
										}}

										stacked
										diverging="double"
										yLabel
										yOptions={{
											name: "Change",
											unit: "%"
										}}
										xValuesSize={6}
									/>
								</HoverHandler>
							</div>
						</Fade>
					</Visualization>
					</Fade>
					</section>
					<section key="section-2">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>


						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Structure (2006 / 2016)"
								description="Footer maps description. Lorem ipsum dolor sit amet, causae incorrupte ut nec, eu vix iuvaret tacimates lobortis. In tollit
								suscipit pertinacia eum, delenit perpetua splendide ei eum. Ut menandri intellegam eam, augue repudiare ei pro."
							>
								<div className="scudeoStories19-map-container">
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
										{/* //year 2016 */}
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
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
										{/* //year 2006 */}
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
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
								</div>
							</Visualization>
						</Fade>
						<Fade left distance="50px">
							<Visualization
								title="Land Cover Land Use Change Structure (2006 / 2016)"
								description="Footer maps description. Lorem ipsum dolor sit amet, causae incorrupte ut nec, eu vix iuvaret tacimates lobortis. In tollit
								suscipit pertinacia eum, delenit perpetua splendide ei eum. Ut menandri intellegam eam, augue repudiare ei pro."
							>
								<div className="scudeoStories19-map-container">
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
										{/* //year 2016 */}
										<PresentationMapWithControls
											map={
												<LeafletMap
													mapKey="scudeoStories19-urbanExtent-map-3"
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
									<AdjustViewOnResizeLeafletWrapper geometry={this.state.cityOne.geometry}>
										{/* //year 2006 */}
										<PresentationMapWithControls
											map={
												<LeafletMap
													mapKey="scudeoStories19-urbanExtent-map-4"
													scrollWheelZoom="afterClick"
													backgroundLayer={backgroundLayer}
													layers={vectorLayers}
												/>
											}
											controls={
												<MapControls zoomOnly levelsBased/>
											}
										>
										</PresentationMapWithControls>
									</AdjustViewOnResizeLeafletWrapper>
								</div>
							</Visualization>
						</Fade>
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

export default LandAssetsStructure;


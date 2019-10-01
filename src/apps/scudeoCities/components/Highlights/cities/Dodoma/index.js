import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import conversions from "../../../../data/conversions";
import Select from "../../../../../../components/common/atoms/Select/Select";

import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import Deprecated_PresentationMapWithControls from "../../../../../../components/common/maps/Deprecated_PresentationMapWithControls";
import LeafletMap from "../../../../../../components/common/maps/LeafletMap/presentation";
import MapControls from "../../../../../../components/common/maps/MapControls/presentation";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";
import MapSet, {PresentationMap} from "../../../../../../components/common/maps/MapSet/presentation";

let au_2_data = null;
let au_3_data = null;

let au_2_attributes_serial = null;
let au_2_serial_as_object = null;
let au_3_serial_as_object = null;
let au_2_lulc_1_changes = null;
let dodomaAuLevel3 = null;

const prepareData = () => {
	au_2_attributes_serial = conversions.featuresToAttributesSerial(au_2_data, 'AL2_ID', [
		{key: 'as_612002000_attr_612110000', name: 'Urban Fabric', color: '#9f1313'},
		{key: ['as_641001000_attr_641000070', 'as_641001000_attr_641000060'], name: 'Informal Settlements', color: '#866899'},
	], 100000000);
	
	au_2_serial_as_object = conversions.featuresToSerialDataAsObject(au_2_data)[1];
	au_3_serial_as_object = conversions.featuresToSerialDataAsObject(au_3_data);
	
	au_2_lulc_1_changes = conversions.getAttributeChanges(au_2_data, 'AL2_ID', [
		{key: 'as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
		{key: 'as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
		{key: 'as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
		{key: 'as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
		{key: 'as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}
	], 2006, 2016);
	
	dodomaAuLevel3 = {
		key: 'dodomaAuLevel3',
		name: 'Analytical units 3',
		type: 'vector',
		options: {
			features: au_3_data,
			keyProperty: 'AL3_ID',
			nameProperty: 'AL3_NAME'
		}
	};
}

const dataLoader = () => {
	const dodoma_au_level_2_loader = import(/* webpackChunkName: "scudeoCities_data_EO4SD_DODOMA_AL2" */ '../../../../data/EO4SD_DODOMA_AL2.json').then(({default: dodoma_au_level_2}) => {
		au_2_data = dodoma_au_level_2.features;
	});
	const dodoma_au_level_3_loader = import(/* webpackChunkName: "scudeoCities_data_EO4SD_DODOMA_AL3" */ '../../../../data/EO4SD_DODOMA_AL3.json').then(({default: dodoma_au_level_3}) => {
		au_3_data = dodoma_au_level_3.features;
	});
	
	return Promise.all([dodoma_au_level_2_loader, dodoma_au_level_3_loader]).then(() => {
		prepareData();
	})
}



const dodomaView = {
	center: {
		lat: -6.15,
		lon: 35.75
	},
	boxRange: 50000
};

const dodomaViewDetailed = {
	center: {
		lat: -6.15,
		lon: 35.75
	},
	boxRange: 30000
};

const stamenLite = {
	key: 'stamen-lite',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
	}
};

const stamenTerrain = {
	key: 'stamen-lite',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'
	}
};

const osm = {
	key: 'osm',
	type: 'wmts',
	options: {url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
};

const esriWorld = {
	key: 'esri',
	type: 'wmts',
	options: {
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
	}
};

const lulc_1_2016 = {
	key: 'lulc-vhr-level-1',
	name: 'LULC (VHR) - Level 1',
	type: 'wms',
	opacity: 0.8,
	options: {
		url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
		params: {
			layers: 'geonode:i258_scudeo_cities_dodoma_lulc_16',
			styles: 'EO4SD_LULC_Level_1'
		}
	}
};

const lulc_1_2006 = {
	key: 'lulc-vhr-level-1',
	name: 'LULC (VHR) - Level 1',
	type: 'wms',
	opacity: 0.8,
	options: {
		url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
		params: {
			layers: 'geonode:i257_scudeo_cities_dodoma_lulc_06',
			styles: 'EO4SD_LULC_Level_1'
		}
	}
};

const informal_2006 = {
	key: 'informal-2006',
	name: 'Informal settlements 2006',
	type: 'wms',
	opacity: 0.8,
	options: {
		url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
		params: {
			layers: 'geonode:i255_scudeo_cities_dodoma_informal_06',
			styles: 'EO4SD2_INFORMALS'
		}
	}
};

const informal_2016 = {
	key: 'informal-2016',
	name: 'Informal settlements 2016',
	type: 'wms',
	opacity: 0.8,
	options: {
		url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
		params: {
			layers: 'geonode:i256_scudeo_cities_dodoma_informal_16',
			styles: 'EO4SD2_INFORMALS'
		}
	}
};

const layers_lulc_2016 = [lulc_1_2016, dodomaAuLevel3];

class Dodoma extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			dataLoaded: false,
		}
	}

	componentDidMount() {
		dataLoader().then(() => {
			this.setState({
				dataLoaded: true,
			})
		})
	}

	render() {
		return (
			<>
			{this.state.dataLoaded ? 
				(<HoverHandler>
					<div className="scudeoCities-highlights-page">
						<h2>Land Use / Land Cover structure</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at cursus enim. Morbi et odio eget tortor hendrerit euismod lacinia a metus. Integer enim sapien, efficitur nec est id, fermentum suscipit tortor. Curabitur eget est vitae purus faucibus maximus id nec nulla. Etiam sit amet nulla eu turpis commodo venenatis. Mauris eu imperdiet ante. Nunc ut volutpat ligula. Maecenas porttitor vehicula magna et finibus. Phasellus sed nisi vel eros luctus tincidunt. Ut sagittis dolor a ipsum feugiat consequat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
						</p>

						<div className="scudeoCities-highlights-charts-wrapper">
							<div className="scudeoCities-highlights-chart-title">Core city Land Cover structure</div>
							<div style={{maxWidth: '27rem', display: 'flex', alignItems: 'center'}}>
								<div style={{width: '15rem'}}>
									<ColumnChart
										key="lulc-aoi-2006"

										data={[au_2_serial_as_object]}
										keySourcePath="AL2_ID"
										nameSourcePath="AL2_NAME"
										xSourcePath="AL2_NAME"
										ySourcePath={[{path: 'data.2006.as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
											{path: 'data.2006.as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
											{path: 'data.2006.as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
											{path: 'data.2006.as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
											{path: 'data.2006.as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}]}

										maxWidth={15}
										height={13}

										yLabel
										yOptions={{
											name: "Land cover",
											unit: "sqm"
										}}
										yValuesSize={2.5}

										xLabel
										xValues={false}
										xOptions={{
											name: "2006"
										}}

										stacked="relative"
									/>
								</div>


								<div style={{width: '15rem', marginLeft: '-3rem'}}>
									<ColumnChart
										key="lulc-aoi"

										data={[au_2_serial_as_object]}
										keySourcePath="AL2_ID"
										nameSourcePath="AL2_NAME"
										xSourcePath="AL2_NAME"
										ySourcePath={[{path: 'data.2016.as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
											{path: 'data.2016.as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
											{path: 'data.2016.as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
											{path: 'data.2016.as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
											{path: 'data.2016.as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}]}

										maxWidth={12}
										height={13}

										yValues={false}

										xLabel
										xValues={false}
										xOptions={{
											name: "2016"
										}}

										stacked="relative"
									/>
								</div>
							</div>
						</div>

						<p>
							Mauris posuere nisi vitae mauris aliquam, sit amet aliquet lectus ultricies. Aenean sollicitudin velit ac nisl consectetur hendrerit. Sed mi lacus, faucibus non ullamcorper a, gravida vel tellus. Praesent viverra feugiat arcu ut pharetra. Integer ultrices ipsum eu augue molestie, et varius lorem faucibus. Aliquam efficitur, orci ut suscipit pellentesque, nisi nibh semper ante, at vestibulum est ex vel ligula. Integer iaculis varius mauris, eget varius felis vehicula vel.
						</p>

						<div className="scudeoCities-highlights-charts-wrapper">
							<div className="scudeoCities-highlights-chart-title">Core city LULC relative change between 2006 and 2016</div>
							<div className="scudeoCities-highlights-chart">
								<ColumnChart
									key="lulc-aoi-change"

									data={au_2_lulc_1_changes["1"]}
									keySourcePath="key"
									nameSourcePath="name"
									xSourcePath="name"
									ySourcePath="relative"
									colorSourcePath="color"

									yLabel
									yOptions={{
										name: "Land cover change",
										unit: "%",
										min: -50,
										max: 80
									}}
									yValuesSize={2.5}
									xValuesSize={7}

									height={20}

									diverging
								/>
							</div>
						</div>

						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at cursus enim. Morbi et odio eget tortor hendrerit euismod lacinia a metus. Integer enim sapien, efficitur nec est id, fermentum suscipit tortor. Curabitur eget est vitae purus faucibus maximus id nec nulla. Etiam sit amet nulla eu turpis commodo venenatis. Mauris eu imperdiet ante. Nunc ut volutpat ligula. Maecenas porttitor vehicula magna et finibus. Phasellus sed nisi vel eros luctus tincidunt. Ut sagittis dolor a ipsum feugiat consequat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
						</p>

						<div className="scudeoCities-highlights-maps-wrapper">
							<div className="scudeoCities-highlights-map-set-wrapper">
								<MapSet
									activeMapKey='map-2'
									mapComponent={LeafletMap}
									view={dodomaView}
									sync={{
										boxRange: true,
										center: true
									}}
									backgroundLayer={esriWorld}
								>
									<PresentationMap
										mapKey='lulc-map-1'
										layers={[lulc_1_2006, dodomaAuLevel3]}
									/>
									<PresentationMap
										mapKey='lulc-map-2'
										layers={[lulc_1_2016, dodomaAuLevel3]}
									/>
									<MapControls zoomOnly levelsBased/>
								</MapSet>
							</div>
							<div className="scudeoCities-highlights-map-legend">
								<div className="item">
									<div className="color" style={{background: "#ae0214"}}></div>
									<div className="title">Artificial Surfaces</div>
								</div>
								<div className="item">
									<div className="color" style={{background: "#ffdc9b"}}></div>
									<div className="title">Agricultural Area</div>
								</div>
								<div className="item">
									<div className="color" style={{background: "#59b642"}}></div>
									<div className="title">Natural and Semi-natural Areas</div>
								</div>
								<div className="item">
									<div className="color" style={{background: "#a6a6ff"}}></div>
									<div className="title">Wetlands</div>
								</div>
								<div className="item">
									<div className="color" style={{background: "#56c8ee"}}></div>
									<div className="title">Water</div>
								</div>
							</div>
						</div>

						<div className="scudeoCities-highlights-charts-wrapper" style={{width: "100%", maxWidth: "80rem", marginTop: 0}}>
							<div className="scudeoCities-highlights-chart-title">Districts Land Cover structure in 2016</div>
							<div className="scudeoCities-highlights-chart">
								<ColumnChart
									key="lulc-districts"

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
							</div>
						</div>



						<h2>Informal settlements expansion</h2>
						<p>
							Mauris posuere nisi vitae mauris aliquam, sit amet aliquet lectus ultricies. Aenean sollicitudin velit ac nisl consectetur hendrerit. Sed mi lacus, faucibus non ullamcorper a, gravida vel tellus. Praesent viverra feugiat arcu ut pharetra. Integer ultrices ipsum eu augue molestie, et varius lorem faucibus. Aliquam efficitur, orci ut suscipit pellentesque, nisi nibh semper ante, at vestibulum est ex vel ligula. Integer iaculis varius mauris, eget varius felis vehicula vel.
						</p>

						<div className="scudeoCities-highlights-charts-wrapper">
							<div className="scudeoCities-highlights-chart-title">Informal settlements expansion between 2006 and 2016</div>
							<div className="scudeoCities-highlights-chart">
								<LineChart
									key="urban-expansion"

									data={au_2_attributes_serial["1"]}
									keySourcePath="key"
									nameSourcePath="name"
									serieDataSourcePath="data"
									colorSourcePath="color"
									xSourcePath="key"
									ySourcePath="value"

									sorting={[["name", "asc"]]}

									xValuesSize={2.5}

									yLabel
									yValuesSize={2.5}
									yOptions={{
										min: 0,
										unit: "sqkm",
										name: "Area"
									}}

									legend
								/>
							</div>
						</div>

						<p>
							Mauris posuere nisi vitae mauris aliquam, sit amet aliquet lectus ultricies. Aenean sollicitudin velit ac nisl consectetur hendrerit. Sed mi lacus, faucibus non ullamcorper a, gravida vel tellus. Praesent viverra feugiat arcu ut pharetra. Integer ultrices ipsum eu augue molestie, et varius lorem faucibus. Aliquam efficitur, orci ut suscipit pellentesque, nisi nibh semper ante, at vestibulum est ex vel ligula. Integer iaculis varius mauris, eget varius felis vehicula vel.
						</p>

						<div className="scudeoCities-highlights-maps-wrapper">
							<div className="scudeoCities-highlights-map-set-wrapper">
								<MapSet
									activeMapKey='map-2'
									mapComponent={LeafletMap}
									view={dodomaView}
									sync={{
										boxRange: true,
										center: true
									}}
									backgroundLayer={{
										key: 'osm',
										type: 'wmts',
										options: {url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'}
									}}
								>
									<PresentationMap
										mapKey='map-1'
										layers={[informal_2006, dodomaAuLevel3]}
									/>
									<PresentationMap
										mapKey='map-2'
										layers={[informal_2016, dodomaAuLevel3]}
									/>
									<MapControls zoomOnly levelsBased/>
								</MapSet>
							</div>
							<div className="scudeoCities-highlights-map-legend">
								<div className="item">
									<div className="color" style={{background: "#4c4cff"}}></div>
									<div className="title">Planned</div>
								</div>
								<div className="item">
									<div className="color" style={{background: "#808080"}}></div>
									<div className="title">Unplanned</div>
								</div>
							</div>
						</div>
					</div>
				</HoverHandler>) : null}
			</>
		);
	}
}

export default Dodoma;


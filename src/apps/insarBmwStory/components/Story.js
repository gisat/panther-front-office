import React from 'react';

import vuhu from '../data/vuhu';
import vuhu0 from '../data/vuhu0';
import bmw_zones from '../data/bmw_zones_7';

import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../components/common/charts/LineChart/LineChart";
import PresentationMapWithControls from "../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../components/common/maps/MapControls/presentation";
import LeafletMap from "../../../components/common/maps/LeafletMap/presentation";
import central_europe from "../../demo/data/central_europe";

// const backgroundLayer = {
// 	key: 'background-osm',
// 	type: 'wmts',
// 	options: {
// 		url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
// 	}
// };

const backgroundLayer = {
	key: 'cuzk_ortofoto',
	name: 'CUZK Ortofoto',
	type: 'wms',
	options: {
		url: 'http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?',
		params: {
			layers: 'GR_ORTFOTORGB'
		}
	}
};

const zones = {
	key: 'zones',
	name: 'BMW Zones',
	type: 'vector',
	options: {
		features: bmw_zones.features,
		keyProperty: 'group_key',
		nameProperty: 'group_key'
	}
};

const layers = [zones];

const view = {
	center: {
		lat: 50.233,
		lon: 12.635
	},
	boxRange: 20000
};

class Story extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="insarBmwStory">
				<HoverHandler>
					<div className="insarBmwStory-visualizations">
						<div className="insarBmwStory-map">
							<PresentationMapWithControls
								map={
									<LeafletMap
										mapKey="insarBmwStory-map1"
										backgroundLayer={backgroundLayer}
										layers={layers}
										view={view}
									/>
								}
								controls={
									<MapControls zoomOnly levelsBased/>
								}
							>
								<div className="insarBmwStory-map-attribution">
									Background: © <a href="https://geoportal.cuzk.cz/Dokumenty/Podminky.html" target="_blank">ČÚZK</a>
								</div>
							</PresentationMapWithControls>
						</div>

						<div className="insarBmwStory-charts">
							<div>
								<LineChart
									key="vuhu"

									data={vuhu}
									keySourcePath="id"
									nameSourcePath="id"
									serieDataSourcePath="data"
									xSourcePath="period"
									ySourcePath="value"

									aggregationThreshold={200}

									diverging

									yOptions={{
										max: 300,
										min: -100
									}}

									sorting={[["period", "asc"]]}
								/>
							</div>

							<div>
								<LineChart
									key="vuhu0"

									data={vuhu0}
									keySourcePath="id"
									nameSourcePath="id"
									serieDataSourcePath="data"
									xSourcePath="period"
									ySourcePath="value"

									aggregationThreshold={200}

									diverging

									sorting={[["period", "asc"]]}
								/>
							</div>

							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et nibh tristique, varius sapien tincidunt, tristique velit. Etiam nec ultricies mi, nec feugiat nunc. Phasellus vitae nulla eu ante rutrum interdum et volutpat metus. Sed nibh quam, varius ut pulvinar id, auctor sed ipsum. Aliquam erat volutpat. Morbi suscipit tincidunt lectus, sit amet ultrices ipsum. Cras quis nunc scelerisque, semper nibh congue, ultricies massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et nibh tristique, varius sapien tincidunt, tristique velit. Etiam nec ultricies mi, nec feugiat nunc.
							</p>

							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et nibh tristique, varius sapien tincidunt, tristique velit. Etiam nec ultricies mi, nec feugiat nunc. Phasellus vitae nulla eu ante rutrum interdum et volutpat metus. Sed nibh quam, varius ut pulvinar id, auctor sed ipsum. Aliquam erat volutpat. Morbi suscipit tincidunt lectus, sit amet ultrices ipsum. Cras quis nunc scelerisque, semper nibh congue, ultricies massa. Nulla id orci mattis nunc semper varius id sed orci. Mauris mauris risus, iaculis in sodales sed, sollicitudin non massa.
							</p>
						</div>
					</div>
				</HoverHandler>
			</div>
		);
	}
}

export default Story;


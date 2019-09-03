import React from 'react';

import vuhu from '../data/vuhu';
import vuhu0 from '../data/vuhu0';
import bmw_zones from '../data/bmw_zones';

import LineChart from "../../../components/common/charts/LineChart/LineChart";
import PresentationMapWithControls from "../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../components/common/maps/MapControls/presentation";
import LeafletMap from "../../../components/common/maps/LeafletMap/presentation";
import SelectHandler from "./SelectHandler";
import ZoneInfo from "./ZoneInfo";

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
		lat: 50.225,
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
				<SelectHandler
					selectedItems={['A_3300']}
				>
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
								<ZoneInfo data={bmw_zones.features}/>
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
									height={20}

									diverging

									yLabel
									yOptions={{
										min: -100,
										name: "Restrospective projection/prognosis",
										unit: "cm"
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
									height={20}

									diverging

									sorting={[["period", "asc"]]}

									yLabel
									yOptions={{
										name: "Overall subsidence projection",
										unit: "cm"
									}}
								/>
							</div>
						</div>
					</div>
				</SelectHandler>
			</div>
		);
	}
}

export default Story;


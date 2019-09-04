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
import ChartWrapper from "./ChartWrapper";

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
	boxRange: 10000
};

class App extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="insarBmwStory">
				<SelectHandler
					selectedItems={['E_4046']}
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
							<div className="insarBmwStory-chart-container">
								<div className="insarBmwStory-chart-title">Restrospective subsidence projection / Subsidence prognosis</div>
								<ChartWrapper
									data={vuhu}
								>
									<LineChart
										key="vuhu"

										data={vuhu}
										keySourcePath="id"
										nameSourcePath="id"
										serieDataSourcePath="data"
										xSourcePath="period"
										ySourcePath="value"

										aggregationThreshold={200}
										height={18}

										diverging

										yLabel
										yOptions={{
											min: -100,
											name: "Subsidence",
											unit: "cm"
										}}

										xValuesSize={2.5}
										xOptions={{
											startingTick: 2,
											tickStep: 5
										}}

										sorting={[["period", "asc"]]}
									/>
								</ChartWrapper>
							</div>

							<div className="insarBmwStory-chart-container">
								<div className="insarBmwStory-chart-title">Overall subsidence projection</div>
								<ChartWrapper
									data={vuhu0}
								>
									<LineChart
										key="vuhu0"

										keySourcePath="id"
										nameSourcePath="id"
										serieDataSourcePath="data"
										xSourcePath="period"
										ySourcePath="value"

										aggregationThreshold={200}
										height={18}

										diverging

										sorting={[["period", "asc"]]}

										yLabel
										yOptions={{
											name: "Subsidence",
											unit: "cm"
										}}

										xValuesSize={2.5}
										xOptions={{
											startingTick: 2,
											tickStep: 5
										}}
									/>
								</ChartWrapper>
							</div>
						</div>
					</div>
				</SelectHandler>
			</div>
		);
	}
}

export default App;


import React from 'react';
import Fade from 'react-reveal/Fade';

// import vuhu from '../data/vuhu';
// import vuhu0 from '../data/vuhu0';
// import bmw_zones from '../data/bmw_zones';

import LineChart from "../../../components/common/charts/LineChart/LineChart";
import PresentationMapWithControls from "../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../components/common/maps/MapControls/presentation";
import LeafletMap from "../../../components/common/maps/LeafletMap/presentation";
import SelectHandler from "./SelectHandler";
import ZoneInfo from "./ZoneInfo";
import ChartWrapper from "./ChartWrapper";

const bmwZonesLoader = import(/* webpackChunkName: "bmwZones" */ '../data/bmw_zones.json');
const vuhuLoader = import(/* webpackChunkName: "vuhu" */ '../data/vuhu.json');
const vuhu0Loader = import(/* webpackChunkName: "vuhu0" */ '../data/vuhu0.json');

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

const view = {
	center: {
		lat: 50.224,
		lon: 12.635
	},
	boxRange: 10000
};

function getColor(d) {
	if (d <= -12) {
		return '#bd0026';
	} else if (d <= -9) {
		return '#f03b20';
	} else if (d <= -6) {
		return '#fd8d3c';
	} else if (d <= -3) {
		return '#fecc5c';
	} else if (d) {
		return '#ffffb2';
	} else {
		return '#cccccc';
	}
}

class App extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			features: [],
			vuhu: null,
			vuhu0: null,
			zones: true
		};

		this.changeZones = this.changeZones.bind(this);
	}

	componentDidMount() {
		let self = this;

		Promise.all([bmwZonesLoader, vuhuLoader, vuhu0Loader]).then((data) => {
			self.setState({
				features: data[0].features,
				vuhu: data[1],
				vuhu0: data[2]
			});
		});
	}

	changeZones() {
		this.setState({
			zones: !this.state.zones
		})
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
										layers={this.state.zones ? [{
											key: 'zones',
											name: 'BMW Zones',
											type: 'vector',
											options: {
												features: this.state.features,
												style: {
													fillColor: getColor,
													fillOpacity: 1,
													strokeColor: "#fff",
													strokeWidth: 1,
												},
												keyProperty: 'group_key',
												nameProperty: 'group_key',
												valueProperty: 'wmean_vel_'
											}
										}] : null}
										view={view}
									/>
								}
								controls={
									<MapControls zoomOnly levelsBased/>
								}
							>
								<div className="insarBmwStory-map-tools">
									<div className="insarBmwStory-map-attribution">
										Background: © <a href="https://geoportal.cuzk.cz/Dokumenty/Podminky.html" target="_blank">ČÚZK</a>
									</div>
									<div className="insarBmwStory-map-legend">
										<div className="insarBmwStory-layer-switch" onClick={this.changeZones}>
											<input type="checkbox" checked={this.state.zones}/>
											<div>Zones</div>
										</div>
										<div className="legend-title">
											Weighted mean subsidence (mm/year)
										</div>
										<div className="legend-content">
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#bd0026'}}></div>
												<div className="legend-value">&lt; -12</div>
											</div>
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#f03b20'}}></div>
												<div className="legend-value">-12 to -9 </div>
											</div>
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#fd8d3c'}}></div>
												<div className="legend-value">-9 to -6</div>
											</div>
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#fecc5c'}}></div>
												<div className="legend-value">-6 to -3</div>
											</div>
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#ffffb2'}}></div>
												<div className="legend-value">&gt; -3</div>
											</div>
											<div className="legend-field">
												<div className="legend-color" style={{backgroundColor: '#cccccc'}}></div>
												<div className="legend-value">No data</div>
											</div>
										</div>
									</div>
								</div>
								<ZoneInfo data={this.state.features}/>
							</PresentationMapWithControls>
						</div>

						<div className="insarBmwStory-charts">
							<div className="insarBmwStory-chart-container">
								{this.state.vuhu ? (
									<Fade right distance="30px">
										<div className="insarBmwStory-chart-title">Restrospective subsidence projection / Subsidence prognosis</div>
										<ChartWrapper
											data={this.state.vuhu}
										>
											<LineChart
												key="vuhu"

												data={this.state.vuhu}
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
												xScale="yearBased"

												sorting={[["period", "asc"]]}
											/>
										</ChartWrapper>
									</Fade>
								) : null}
							</div>

							<div className="insarBmwStory-chart-container">
								{this.state.vuhu0 ? (
									<Fade right distance="30px">
										<div className="insarBmwStory-chart-title">Overall subsidence projection</div>
										<ChartWrapper
											data={this.state.vuhu0}
										>
											<LineChart
												key="vuhu0"

												data={this.state.vuhu0}
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
												xScale="yearBased"
											/>
										</ChartWrapper>
									</Fade>
								) : null}
							</div>
						</div>
					</div>
				</SelectHandler>
			</div>
		);
	}
}

export default App;


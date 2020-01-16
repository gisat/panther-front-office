import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import moment from "moment";
import LineChart from "../../../../../components/common/charts/LineChart/LineChart";
import HoverHandler from "../../../../../components/common/HoverHandler/HoverHandler";

import "./style.scss";
import MapSetPresentation, {PresentationMap} from "../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../../components/common/maps/controls/MapControls/presentation";
import MapResources from "../../../constants/MapResources";
import mapUtils from "../../../../../utils/map";

// TODO styles to config

const style = {
	"key":"test",
	"data":{
		"nameDisplay":"",
		"source":"definition",
		"definition":{
			"rules":[
				{
					"styles":[
						{
							"attributeKey": "VYMERA",
							"attributeScale": {
								"fill": {
									"inputInterval": [0,20,100],
									"outputInterval": ["yellow", "lightgreen", "008ae5"]
								}
							}
						}
					]
				}
			]
		}
	}
};

class Biofyzika extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		place: PropTypes.object,
		scope: PropTypes.object,
		activePeriodKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpb: props.data && props.data[0],
			mapView: {
				boxRange: 1000
			}
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.data) {
			let exists = _.find(props.data, (feature) => feature === this.state.activeDpb);
			if (!exists) {
				this.setState({
					activeDpb: props.data[0]
				});
			}
		}

		if (prevProps.place !== this.props.place) {
			if (this.props.place.data.bbox) {
				const mapView = mapUtils.getViewFromBoundingBox(this.props.place.data.bbox, true);
				this.setState({mapView});
			}
		}
	}

	onMapViewChange(view) {
		this.setState({
			mapView: view
		})
	}

	render() {
		const props = this.props;

		let dataForCharts = null;
		let mapLayers = [];

		if (this.state.activeDpb) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			mapLayers = [
				{
					key: "test",
					type: "vector",
					opacity: 0.7,

					options: {
						features: props.data,
						style: style.data.definition
					}
				}
			];
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<h1>{props.scope && props.scope.data.nameDisplay}</h1>
					<h2>Obsah chlorofylu</h2>
					{this.renderMapSet('map-set-1', mapLayers)}
					{dataForCharts && dataForCharts.chlorophyll ? this.renderChlorophyllChart(dataForCharts) : null}
					<h2>Obsah vody</h2>
					{this.renderMapSet('map-set-2')}
					{dataForCharts && dataForCharts.water ? this.renderWaterChart(dataForCharts) : null}
					<h2>Index listové plochy</h2>
					{this.renderMapSet('map-set-3')}
					{dataForCharts && dataForCharts.leafs ? this.renderLeafsChart(dataForCharts) : null}
				</div>
			</>
		);
	}

	renderMapSet(key, layers) {
		return (
			<div style={{height: 500, width: "100%", marginBottom: "3rem"}}>
				<MapSetPresentation
					activeMapKey={key+'map-1'}
					mapComponent={WorldWindMap}
					view={this.state.mapView}
					onViewChange={this.onMapViewChange}
					sync={{
						boxRange: true,
						center: true,
						tilt: true,
						heading: true,
						roll: true
					}}
					layers={layers}
					backgroundLayer={MapResources.cartoDbVoyagerLight}
				>
					<PresentationMap
						mapKey={key+'map-1'}
					/>
					<PresentationMap
						mapKey={key+'map-2'}
					/>
					<MapControlsPresentation zoomOnly/>
				</MapSetPresentation>
			</div>
		);
	}

	renderChlorophyllChart(data) {
		return (
			<HoverHandler>
				<LineChart
					key="chlorophyll"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="chlorophyll"
					xSourcePath="date"
					ySourcePath="value"

					isSerie
					pointRadius={3}

					xScaleType="time"
					xValuesSize={4}
					xOptions={{
						name: "Time",
						axisValueFormat: "MMMM",
						popupValueFormat: "D. MMMM YYYY",
						min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
						max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
					}}

					yLabel
					yValuesSize={3}
					yOptions={{
						unit: "μg/cm2",
						name: "Obsah chlorofylu"
					}}
					withoutYbaseline={false}

				/>
			</HoverHandler>
		);
	}

	renderWaterChart(data) {
		return (
			<HoverHandler>
				<LineChart
					key="water"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="water"
					xSourcePath="date"
					ySourcePath="value"

					isSerie
					pointRadius={3}

					xScaleType="time"
					xValuesSize={4}
					xOptions={{
						name: "Time",
						axisValueFormat: "MMMM",
						popupValueFormat: "D. MMMM YYYY",
						min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
						max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
					}}

					yLabel
					yValuesSize={3}
					yOptions={{
						unit: "cm",
						name: "Obsah vody"
					}}
					withoutYbaseline={false}

				/>
			</HoverHandler>
		);
	}

	renderLeafsChart(data) {
		return (
			<HoverHandler>
				<LineChart
					key="leafs"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="leafs"
					xSourcePath="date"
					ySourcePath="value"

					isSerie
					pointRadius={3}

					xScaleType="time"
					xValuesSize={4}
					xOptions={{
						name: "Time",
						axisValueFormat: "MMMM",
						popupValueFormat: "D. MMMM YYYY",
						min: `${this.props.activePeriodKey}-02-28T00:00:00.000Z`,
						max: `${this.props.activePeriodKey}-11-01T00:00:00.000Z`,
					}}

					yLabel
					yValuesSize={3}
					yOptions={{
						unit: "m2/m2",
						name: "Index listové plochy"
					}}
					withoutYbaseline={false}

				/>
			</HoverHandler>
		);
	}

	prepareDataForCharts() {
		let chlorophyll = [];
		let water = [];
		let leafs = [];
		_.forIn(this.state.activeDpb.properties, (value, key) => {
			let attribute = key.split("_")[0];

			if (attribute.length === 5) {
				const attributeCode = attribute.substring(0,1);
				const dateCode = attribute.substring(1,5);
				const dateCodeNumber = Number(attribute.substring(1,5));

				if (!_.isNaN(dateCodeNumber)) {
					const day = dateCode.substring(2,4);
					const month = dateCode.substring(0,2);
					const date = moment(`${this.props.activePeriodKey}-${month}-${day}`).toISOString();
					const record = {date, value};

					if (value) {
						if (attributeCode === "C") {
							chlorophyll.push(record);
						} else if (attributeCode === "W") {
							water.push(record);
						} else if (attributeCode === "L") {
							leafs.push(record);
						}
					}
				}
			}
		});

		return {...this.state.activeDpb.properties, chlorophyll, water, leafs};
	}
}

export default Biofyzika;
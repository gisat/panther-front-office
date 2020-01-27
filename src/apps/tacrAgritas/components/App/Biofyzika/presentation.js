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

import utils, {hoveredStyleDefinition, selectedStyleDefinition} from "../../../utils";
import {fidColumnName} from "../../../constants/MapResources";
import {LineChartPopup} from "../../LineChartPopup";

const chlorophyllOutlinesStyle = utils.fillStyleTemplate(
	{
		"outlineWidth": 2,
		"outlineColor": "#888888",
		"fillOpacity": 0
	}
);

const chlorophyllChoroplethStyle = utils.fillStyleTemplate(
	{
		"attributeKey": "VYMERA",
		"attributeScale": {
			"fill": {
				"inputInterval": [0,20,100],
				"outputInterval": ["yellow", "lightgreen", "008ae5"]
			}
		}
	}
);

class Biofyzika extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		placeView: PropTypes.object,
		scope: PropTypes.object,
		activePeriodKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpbKey: props.data && props.data[0].properties[fidColumnName],
			mapView: props.activePlaceView
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
	}

	componentDidMount() {
		if (this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.data) {
			let exists = _.find(props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
			if (!exists) {
				this.setState({
					activeDpbKey: props.data && props.data[0] && props.data[0].properties[fidColumnName]
				});
			}
		}

		if (!this.state.mapView && this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	onMapViewChange(view) {
		this.setState({
			mapView: view
		})
	}

	onMapClick(mapKey, layerKey, fids) {
		this.setState({
			activeDpbKey: fids[0]
		})
	}

	render() {
		const props = this.props;

		let dataForCharts = null;
		let chlorophyllFirstMapLayers, chlorophyllSecondMapLayers = [];

		if (this.state.activeDpbKey) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			chlorophyllFirstMapLayers = this.getMapLayers(chlorophyllOutlinesStyle);
			chlorophyllSecondMapLayers = this.getMapLayers(chlorophyllChoroplethStyle);
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<div>
						<h1>{props.scope && props.scope.data.nameDisplay}</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Obsah chlorofylu</h2>
						{this.renderMapSet('map-set-1', chlorophyllFirstMapLayers, chlorophyllSecondMapLayers)}
						{dataForCharts && dataForCharts.chlorophyll ? this.renderChlorophyllChart(dataForCharts) : null}
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Obsah vody</h2>
						{this.renderMapSet('map-set-2')}
						{dataForCharts && dataForCharts.water ? this.renderWaterChart(dataForCharts) : null}
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Index listové plochy</h2>
						{this.renderMapSet('map-set-3')}
						{dataForCharts && dataForCharts.leafs ? this.renderLeafsChart(dataForCharts) : null}
					</div>
				</div>
			</>
		);
	}

	renderMapSet(key, firstMapLayers, secondMapLayers) {
		return (
			<div className="tacrAgritas-map-set-container">
				<HoverHandler>
					<MapSetPresentation
						activeMapKey={key}
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
						backgroundLayer={MapResources.cartoDbVoyagerLight}
					>
						<PresentationMap
							mapKey={key+'-map-1'}
							layers={firstMapLayers}
							onLayerClick={this.onMapClick}
						/>
						<PresentationMap
							mapKey={key+'-map-2'}
							layers={secondMapLayers}
							onLayerClick={this.onMapClick}
						/>
						<MapControlsPresentation zoomOnly/>
					</MapSetPresentation>
				</HoverHandler>
			</div>
		);
	}

	renderChlorophyllChart(data) {
		return (
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<LineChart
					key="chlorophyll"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="chlorophyll"
					xSourcePath="date"
					ySourcePath="value"
					colorSourcePath="color"

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
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<LineChart
					key="water"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="water"
					xSourcePath="date"
					ySourcePath="value"
					colorSourcePath="color"

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
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<LineChart
					key="leafs"

					data={[data]}
					keySourcePath="ID_DPB"
					nameSourcePath="NKOD_DPB"
					serieDataSourcePath="leafs"
					xSourcePath="date"
					ySourcePath="value"
					colorSourcePath="color"

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

	getMapLayers(style) {
		return [
			{
				key: "test",
				layerKey: "test",
				type: "vector",
				opacity: 0.7,

				options: {
					features: this.props.data,
					style: style.data.definition,
					hovered: {
						style: hoveredStyleDefinition
					},
					selected: {
						'test': {
							style: selectedStyleDefinition,
							keys: [this.state.activeDpbKey],
						}
					},
					fidColumnName
				}
			}
		]
	}

	prepareDataForCharts() {
		let chlorophyll = [];
		let water = [];
		let leafs = [];

		let feature = _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);

		if (feature) {
			_.forIn(feature.properties, (value, key) => {
				let attributeParts = key.split("_");
				let attribute = attributeParts[0];

				if (attribute.length === 5) {
					const attributeCode = attribute.substring(0,1);
					const dateCode = attribute.substring(1,5);
					const dateCodeNumber = Number(attribute.substring(1,5));

					if (!_.isNaN(dateCodeNumber)) {
						const day = dateCode.substring(2,4);
						const month = dateCode.substring(0,2);
						const date = moment(`${this.props.activePeriodKey}-${month}-${day}`).toISOString();

						const dateEndCode = attributeParts[1];
						const dayEnd = dateEndCode.substring(2,4);
						const monthEnd = dateEndCode.substring(0,2);
						const dateEnd = moment(`${this.props.activePeriodKey}-${monthEnd}-${dayEnd}`).toISOString();

						const record = {date, dateEnd, value};

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

			return {...feature.properties, chlorophyll, water, leafs, color: "#ffa842"};
		} else {
			return null;
		}
	}
}

export default Biofyzika;
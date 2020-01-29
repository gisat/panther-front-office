import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import MapResources, {
	climRegionColumnName,
	cropColumnName,
	fidColumnName,
	mapPeriodOptionsHistorie,
	nameColumnName, outlinesStyle
} from "../../constants/MapResources";
import {MapLegend} from "../MapLegend";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import {MapPopup} from "../MapPopup";
import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import {MapInfo} from "../MapInfo";
import Select from "../../../../components/common/atoms/Select/Select";
import utils, {hoveredStyleDefinition, selectedStyleDefinition} from "../../utils";
import moment from "moment";
import {LineChartPopup} from "../LineChartPopup";
import LineChart from "../../../../components/common/charts/LineChart/LineChart";
import Fade from "react-reveal/Fade";


const getChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,50],
					"intervalBounds": [false, false],
					"fill": "#d73027"
				},
				{
					"interval": [50,80],
					"intervalBounds": [true, false],
					"fill": "#fc8d59"
				},
				{
					"interval": [80,100],
					"intervalBounds": [true, false],
					"fill": "#fee090"
				},
				{
					"interval": [100,120],
					"intervalBounds": [true, false],
					"fill": "#e0f3f8"
				},
				{
					"interval": [120,150],
					"intervalBounds": [true, false],
					"fill": "#91bfdb"
				},
				{
					"interval": [150,300],
					"intervalBounds": [true, false],
					"fill": "#4575b4"
				}
			]
		}
	)
};

class Historie extends React.PureComponent {
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
			mapView: props.activePlaceView,
			selectedMapPeriod: mapPeriodOptionsHistorie[3]
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onMapPeriodChange = this.onMapPeriodChange.bind(this);
	}

	componentDidMount() {
		if (this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.data) {
			let exists = this.getSelectedAreaData();
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

	onMapPeriodChange(option) {
		this.setState({
			selectedMapPeriod: option
		});
	}

	render() {
		const props = this.props;

		let dataForCharts = null;

		let attribute = "P" + this.state.selectedMapPeriod.key;
		let mapChoroplethStyle = getChoroplethStyle(attribute);


		let mapLayers = [];

		if (this.state.activeDpbKey) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			mapLayers = this.getMapLayers(mapChoroplethStyle);
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<div>
						<h1>{props.scope && props.scope.data.nameDisplay}</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>

						{this.renderMapSet('map-set-historie', mapLayers, attribute, "%")}
						<MapLegend
							style={mapChoroplethStyle}
							name={"Aktuální hodnota vs. dlouhodobý normál"}
							unit={"%"}
							noData
						/>
						{dataForCharts ? this.renderChart(dataForCharts) : null}
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
			</>
		);
	}

	renderMapSet(key, layers, valueColumnName, unit) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<Fade left distance="50px">
				<div className="tacrAgritas-map-set-container">
					<HoverHandler
						popupContentComponent={
							<MapPopup
								valueColumnName={valueColumnName}
								unit={unit}
							/>
						}>
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
								layers={layers}
								onLayerClick={this.onMapClick}
							/>
							<MapControlsPresentation zoomOnly/>
							<MapInfo
								cropName={selectedArea && selectedArea.properties[cropColumnName]}
								selectedAreaName={selectedArea && selectedArea.properties[nameColumnName]}
								selectedAreaClimRegion={selectedArea && selectedArea.properties[climRegionColumnName]}
							/>
							<Select
								className="tacrAgritas-map-label"
								value={this.state.selectedMapPeriod}
								optionLabel="label"
								optionValue="key"
								options={mapPeriodOptionsHistorie}
								onChange={this.onMapPeriodChange}
							/>
						</MapSetPresentation>
					</HoverHandler>
				</div>
			</Fade>
		);
	}

	renderChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
				<LineChart
					key="history"

					data={data}
					keySourcePath="key"
					nameSourcePath="name"
					serieDataSourcePath="data"
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
						unit: "???",
						name: "???"
					}}
					withoutYbaseline={false}
					legend
				/>
			</HoverHandler>
		);
	}

	getSelectedAreaData() {
		return _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
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
		let history = [];
		let current = [];

		let feature = this.getSelectedAreaData();

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
							if (attributeCode === "R") {
								history.push(record);
							} else if (attributeCode === "C") {
								current.push(record);
							}
						}
					}
				}
			});

			return [
				{
					...feature.properties,
					key: "history",
					name: "Dlouhodobý normál",
					data: history,
					color: "#aaaaaa"

				},{
					...feature.properties,
					key: "current",
					name: "Aktuální hodnota",
					data: current,
					color: "#ff00ff"

				}
			];
		} else {
			return null;
		}
	}
}

export default Historie;
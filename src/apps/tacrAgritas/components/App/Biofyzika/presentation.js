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
import MapResources, {cropColumnName, fidColumnName, nameColumnName, climRegionColumnName} from "../../../constants/MapResources";

import utils, {hoveredStyleDefinition, selectedStyleDefinition} from "../../../utils";
import {LineChartPopup} from "../../LineChartPopup";
import {MapInfo} from "../../MapInfo";
import {MapLegend} from "../../MapLegend";
import {MapPopup} from "../../MapPopup";
import Select from "../../../../../components/common/atoms/Select/Select";

const mapPeriodOptions = [
	{
		key: "0301_0310",
		label: "1. - 10. března"
	}, {
		key: "0311_0320",
		label: "11. - 20. března"
	}, {
		key: "0321_0331",
		label: "21. - 31. března"
	}, {
		key: "0401_0410",
		label: "1. - 10. dubna"
	}, {
		key: "0411_0420",
		label: "11. - 20. dubna"
	}, {
		key: "0421_0430",
		label: "21. - 30. dubna"
	}, {
		key: "0501_0510",
		label: "1. - 10. května"
	}, {
		key: "0511_0520",
		label: "11. - 20. května"
	}, {
		key: "0521_0531",
		label: "21. - 31. května"
	}, {
		key: "0601_0610",
		label: "1. - 10. června"
	}, {
		key: "0611_0620",
		label: "11. - 20. června"
	}, {
		key: "0621_0630",
		label: "21. - 30. června"
	}, {
		key: "0701_0710",
		label: "1. - 10. července"
	}, {
		key: "0711_0720",
		label: "11. - 20. července"
	}, {
		key: "0721_0731",
		label: "21. - 31. července"
	}, {
		key: "0801_0810",
		label: "1. - 10. srpna"
	}, {
		key: "0811_0820",
		label: "11. - 20. srpna"
	}, {
		key: "0821_0831",
		label: "21. - 31. srpna"
	}, {
		key: "0901_0910",
		label: "1. - 10. září"
	}, {
		key: "0911_0920",
		label: "11. - 20. září"
	}, {
		key: "0921_0930",
		label: "21. - 30. září"
	}, {
		key: "1001_1010",
		label: "1. - 10. října"
	}, {
		key: "1011_1020",
		label: "11. - 20. října"
	}, {
		key: "1021_1031",
		label: "21. - 31. října"
	}
];

const outlinesStyle = utils.fillStyleTemplate(
	{
		"outlineWidth": 2,
		"outlineColor": "#888888",
		"fillOpacity": 0
	}
);

const getChlorophyllChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
	{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,15],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [15,30],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [30,45],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [45,60],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [60,100],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

const getWaterChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,0.015],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [0.015,0.030],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [0.030,0.045],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [0.045,0.060],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [0.060,0.1],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

const getLeafsChoroplethStyle = (attributeKey) => {
	return utils.fillStyleTemplate(
		{
			attributeKey,
			"attributeClasses":[
				{
					"interval": [0,2],
					"intervalBounds": [false, false],
					"fill": "#ffdab1"
				},
				{
					"interval": [2,4],
					"intervalBounds": [true, false],
					"fill": "#ffb561"
				},
				{
					"interval": [4,6],
					"intervalBounds": [true, false],
					"fill": "#d48422"
				},
				{
					"interval": [6,8],
					"intervalBounds": [true, false],
					"fill": "#89571c"
				},
				{
					"interval": [8,15],
					"intervalBounds": [true, false],
					"fill": "#513515"
				}
			]
		}
	)
};

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
			mapView: props.activePlaceView,
			selectedMapPeriod: mapPeriodOptions[3]
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

		let chlorophyllAttribute = "C" + this.state.selectedMapPeriod.key;
		let chlorophyllStyle = getChlorophyllChoroplethStyle(chlorophyllAttribute);

		let waterAttribute = "W" + this.state.selectedMapPeriod.key;
		let waterStyle = getWaterChoroplethStyle(waterAttribute);

		let leafsAttribute = "L" + this.state.selectedMapPeriod.key;
		let leafsStyle = getLeafsChoroplethStyle(leafsAttribute);

		let chlorophyllFirstMapLayers, chlorophyllSecondMapLayers = [];
		let waterFirstMapLayers, waterSecondMapLayers = [];
		let leafsFirstMapLayers, leafsSecondMapLayers = [];

		if (this.state.activeDpbKey) {
			dataForCharts = this.prepareDataForCharts();
		}

		if (this.props.data) {
			chlorophyllFirstMapLayers = this.getMapLayers(chlorophyllStyle);
			chlorophyllSecondMapLayers = this.getMapLayers(outlinesStyle);

			waterFirstMapLayers = this.getMapLayers(waterStyle);
			waterSecondMapLayers = this.getMapLayers(outlinesStyle);

			leafsFirstMapLayers = this.getMapLayers(leafsStyle);
			leafsSecondMapLayers = this.getMapLayers(outlinesStyle);
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
						{this.renderMapSet('map-set-1', chlorophyllFirstMapLayers, chlorophyllSecondMapLayers, chlorophyllAttribute, "μg/cm2")}
						<MapLegend
							style={chlorophyllStyle}
							name={"Obsah chlorofylu"}
							unit={"μg/cm2"}
							noData
						/>
						{dataForCharts && dataForCharts.chlorophyll ? this.renderChlorophyllChart(dataForCharts) : null}
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Obsah vody</h2>
						{this.renderMapSet('map-set-2', waterFirstMapLayers, waterSecondMapLayers, waterAttribute, "cm")}
						<MapLegend
							style={waterStyle}
							name={"Obsah vody"}
							unit={"cm"}
							noData
						/>
						{dataForCharts && dataForCharts.water ? this.renderWaterChart(dataForCharts) : null}
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-section">
					<div>
						<h2>Index listové plochy</h2>
						{this.renderMapSet('map-set-3', leafsFirstMapLayers, leafsSecondMapLayers, leafsAttribute, "m2/m2")}
						<MapLegend
							style={leafsStyle}
							name={"Index listové plochy"}
							unit={"m2/m2"}
							noData
						/>
						{dataForCharts && dataForCharts.leafs ? this.renderLeafsChart(dataForCharts) : null}
					</div>
				</div>
			</>
		);
	}

	renderMapSet(key, firstMapLayers, secondMapLayers, valueColumnName, unit) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<div className="tacrAgritas-map-set-container">
				<HoverHandler
					popupContentComponent={
						<MapPopup
							valueColumnName={valueColumnName}
							unit={unit}
						/>
					}
				>
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
							options={mapPeriodOptions}
							onChange={this.onMapPeriodChange}
						/>
					</MapSetPresentation>
				</HoverHandler>
			</div>
		);
	}

	renderChlorophyllChart(data) {
		const selectedArea = this.getSelectedAreaData();

		return (
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
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
		const selectedArea = this.getSelectedAreaData();

		return (
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
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
		const selectedArea = this.getSelectedAreaData();

		return (
			<HoverHandler
				popupContentComponent={LineChartPopup}
			>
				<div className="tacrAgritas-chart-title">Půdní blok<em> {selectedArea && selectedArea.properties[nameColumnName]}</em></div>
				<LineChart
					key="leafs"

					data={[data]}
					keySourcePath={fidColumnName}
					nameSourcePath={nameColumnName}
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

			return {...feature.properties, chlorophyll, water, leafs, color: "#ff00ff"};
		} else {
			return null;
		}
	}

	getSelectedAreaData() {
		return _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
	}
}

export default Biofyzika;
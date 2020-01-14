import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import moment from "moment";
import LineChart from "../../../../../components/common/charts/LineChart/LineChart";
import HoverHandler from "../../../../../components/common/HoverHandler/HoverHandler";

import "./style.scss";

class Biofyzika extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		activePeriodKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpb: props.data && props.data[0]
		}
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
	}

	render() {
		const props = this.props;
		let dataForCharts = null;

		if (this.state.activeDpb) {
			dataForCharts = this.prepareDataForCharts();
		}

		return (
			<>
				<div className="tacrAgritas-section">
					<h1>{props.scope && props.scope.data.nameDisplay}</h1>
					<h2>Obsah chlorofylu</h2>
					{dataForCharts && dataForCharts.chlorophyll ? this.renderChlorophyllChart(dataForCharts) : null}
					<h2>Obsah vody</h2>
					{dataForCharts && dataForCharts.water ? this.renderWaterChart(dataForCharts) : null}
					<h2>Index listové plochy</h2>
					{dataForCharts && dataForCharts.leafs ? this.renderLeafsChart(dataForCharts) : null}
				</div>
			</>
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
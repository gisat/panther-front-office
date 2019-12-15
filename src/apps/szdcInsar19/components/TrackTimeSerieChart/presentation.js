import React from 'react';
import _ from 'lodash';
import moment from "moment";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";

class TrackTimeSerieChart extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		const selection = this.props.activeSelection;
		if (this.props.activeSelection !== prevProps.activeSelection) {
			let keys = selection && selection.data && selection.data.featureKeysFilter && selection.data.featureKeysFilter.keys;
			if (keys && this.props.onPointsChange) {
				this.props.onPointsChange(keys);
			}
		}
	}

	render() {
		let axisValueFormat = "MMM YY";
		let attributeName = null;
		let attributeDescription = null;
		let attributeUnit = null;

		if (this.props.activePeriod) {
			const start = this.props.activePeriod.data && this.props.activePeriod.data.start;
			const end = this.props.activePeriod.data && this.props.activePeriod.data.end;
			if (start && end) {
				const differenceInDays = moment(end).diff(moment(start),'days');
				if (differenceInDays < 100) {
					axisValueFormat = "D MMM YY"
				}
			}
		}

		if (this.props.currentAttribute) {
			const data = this.props.currentAttribute.data;
			if (data.nameDisplay) {
				attributeName = data.nameDisplay;
			}
			if (data.unit) {
				attributeUnit = data.unit;
			}
			if (data.description) {
				attributeDescription = data.description;
			}
		}

		return (
			this.props.data ? (
				<>
						<HoverHandler>
							<div style={{margin: '2rem'}}>
								<h3>{this.props.data[0].name}</h3>
								{attributeDescription ? <p>{attributeDescription}</p> : null}
								<ScatterChart
									key="time-scale-scatter"

									height={15}

									data={this.props.data}
									keySourcePath="key"
									nameSourcePath="name"
									serieDataSourcePath="data"
									xSourcePath="period"
									ySourcePath="value"

									isSerie
									pointRadius={5}

									xScaleType="time"
									xOptions={{
										axisValueFormat,
										popupValueFormat: "D MMMM YYYY",
										timeValueLanguage: 'cs',
										name: 'Datum pořízení'
									}}
									xValuesSize={5}
									xTicks={false}

									yOptions={{
										name: attributeName || "Poloha bodu",
										unit: attributeUnit || "mm",
										min: -65,
										max: 40
									}}
									yLabel
									yValuesSize={3}

									withoutYbaseline={false}
									diverging

									pointSymbol="plus"
								/>
							</div>
						</HoverHandler>
				</>
			) : null
		);
	}
}

export default TrackTimeSerieChart;
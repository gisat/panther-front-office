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

		if (this.props.currentAttributeKey !== prevProps.currentAttributeKey) {
			this.props.onAttributeKeysChange([this.props.currentAttributeKey]);
		}
	}

	render() {
		let axisValueFormat = "MMMM YY";
		let attributeName = null;
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
		}

		return (
			this.props.data ? (
				<>
					<h3 style={{textAlign: 'center'}}>{this.props.data[0].name}</h3>
						<HoverHandler>
							<div style={{margin: '2rem'}}>
								<ScatterChart
									key="time-scale-scatter"

									height={20}

									data={this.props.data}
									keySourcePath="key"
									nameSourcePath="name"
									serieDataSourcePath="data"
									xSourcePath="period"
									ySourcePath="value"

									isSerie
									pointRadius={3}

									xScaleType="time"
									xOptions={{
										axisValueFormat,
										popupValueFormat: "D MMMM YYYY",
										timeValueLanguage: 'cs',
										name: 'Datum pořízení'
									}}
									xValuesSize={5}

									yOptions={{
										name: attributeName,
										unit: attributeUnit
									}}
									yLabel
									yTicks={false}

									withoutYbaseline={false}
									diverging
								/>
							</div>
						</HoverHandler>
				</>
			) : null
		);
	}
}

export default TrackTimeSerieChart;
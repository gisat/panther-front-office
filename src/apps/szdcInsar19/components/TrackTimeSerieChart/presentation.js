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
		let axisValueFormat = "MMMM YY";
		if (this.props.activePeriod) {
			const start = this.props.activePeriod.data && this.props.activePeriod.data.start;
			const end = this.props.activePeriod.data && this.props.activePeriod.data.end;
			//TODO

		}

		return (
			this.props.data ? (
				<>
					<h3 style={{textAlign: 'center'}}>{this.props.data[0].name}</h3>
					<div style={{height: '20rem', margin: '1rem'}}>
						<HoverHandler>
							<ScatterChart
								key="time-scale-scatter"

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
									name: "Time"
								}}
								xValuesSize={5}

								yOptions={{
									name: "Attribute"
								}}
								yLabel
								yTicks={false}

								withoutYbaseline={false}
								diverging
							/>
						</HoverHandler>
					</div>
				</>
			) : null
		);
	}
}

export default TrackTimeSerieChart;
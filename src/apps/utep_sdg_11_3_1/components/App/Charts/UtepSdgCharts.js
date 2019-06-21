import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../../components/common/charts/ScatterChart/ScatterChart";
import data from "../../../data/attributeData";

class UtepSdgCharts extends React.PureComponent {
	static propTypes = {

	};

	render() {
		return (
			<div className="utep_sdg_11_3_1-right-panel">
				<ChartWrapper
					key={"scatter-chart-wrapper"}
					title="Scatter chart"
					subtitle="Example of scatter chart"
				>
					<ScatterChart
						key="scatter-chart"
						data={data}
						isSerie

						serieDataSourcePath="properties"
						nameSourcePath="name"
						// colorSourcePath="data.color"
						keySourcePath="gid"

						xSourcePath="Population change" // in context of serie
						xOptions={{
							name: "Population change"
						}}
						ySourcePath="Urban area change" // in context of serie
						yOptions={{
							name: "Urban area change"
						}}
						itemNameSourcePath="period" // in context of serie

						xGridlines
						xCaptions
						xTicks

						yGridlines
						yCaptions
						yTicks
						withoutYbaseline
					/>
				</ChartWrapper>
				<ChartWrapper
					key={"line-chart-wrapper"}
					title="Total population progress"
					subtitle="Progress of total population between years 1985 and 2015"
				>
					<LineChart
						key="line-chart"
						data={data}

						serieKeySourcePath="gid"
						serieNameSourcePath="name"
						serieDataSourcePath="properties"
						xSourcePath="period" // in context of serie
						ySourcePath="Total population" // in context of serie
						yOptions={{
							name: "Total population"
						}}

						xTicks
						xGridlines
						xCaptions
						yTicks
						yGridlines
						yCaptions
						withoutYbaseline

						sorting={[["period", "asc"]]}
						yCaptionsSize={80}

						withPoints
					/>
				</ChartWrapper>
			</div>
		);
	}
}

export default UtepSdgCharts;


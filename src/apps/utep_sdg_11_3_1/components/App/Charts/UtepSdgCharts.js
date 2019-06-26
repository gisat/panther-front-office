import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../../components/common/charts/ScatterChart/ScatterChart";
import data from "../../../data/attributeData";

function getGniData(period) {
	return _.map(data, country => {
		const {properties, ...countryData} = country;
		countryData.properties = _.find(properties, {period});
		return countryData;
	});
}

function getUrbanPopulationRatioData() {
	return _.map(data, country => {
		country.properties = _.map(country.properties, property => {
			return {
				...property, "UA_POP_change_ratio": property["Urban area change"]/property["Population change"]
			}
		});
		return country;
	});
}

class UtepSdgCharts extends React.PureComponent {
	constructor(props) {
		super(props);

		this.data = getUrbanPopulationRatioData();
		this.gniData = getGniData(2015);
	}

	render() {
		return (
			<div className="utep_sdg_11_3_1-right-panel">
				<div className="utep_sdg_11_3_1-charts">
					<ChartWrapper
						key={"line-chart-ratio-wrapper"}
						title="Urban area/Population change ratio"
						subtitle="Ratio of Urban area change and Population change between years 1985 and 2015"
					>
						<LineChart
							key="line-chart-ratio"
							data={this.data}

							serieKeySourcePath="gid"
							serieNameSourcePath="name"
							serieDataSourcePath="properties"
							xSourcePath="period" // in context of serie
							ySourcePath="UA_POP_change_ratio" // in context of serie

							height={200}
							minAspectRatio={1.7}

							yCaptionsSize={40}
							xCaptionsSize={40}

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							yLabel
							yOptions={{
								name: "Change ratio",
								max: 3.1
							}}
							withoutYbaseline

							sorting={[["period", "asc"]]}

							withPoints
							// legend
						/>
					</ChartWrapper>
					<ChartWrapper
						key={"scatter-chart-wrapper"}
						title="Urban area change vs. Population change"
						subtitle="Between years 1985 and 2015"
					>
						<ScatterChart
							key="scatter-chart"
							data={this.data}
							isSerie

							serieDataSourcePath="properties"
							nameSourcePath="name"
							// colorSourcePath="data.color"
							keySourcePath="gid"

							xSourcePath="Population change" // in context of serie
							ySourcePath="Urban area change" // in context of serie

							itemNameSourcePath="period" // in context of serie

							height={200}
							minAspectRatio={1.7}

							xGridlines
							xCaptions
							xCaptionsSize={35}
							xTicks
							xLabel
							xOptions={{
								name: "Population change",
								unit: "%"
							}}

							yGridlines
							yCaptions
							yTicks
							yLabel
							yOptions={{
								name: "Urban area change",
								unit: "%",
								max: 620
							}}

							withoutYbaseline

							legend
						/>
					</ChartWrapper>
					<ChartWrapper
						key={"line-chart-wrapper"}
						title="Total population progress"
						subtitle="Progress of total population between years 1985 and 2015"
					>
						<LineChart
							key="line-chart"
							data={this.data}

							serieKeySourcePath="gid"
							serieNameSourcePath="name"
							serieDataSourcePath="properties"
							xSourcePath="period" // in context of serie
							ySourcePath="Total population" // in context of serie

							height={200}
							minAspectRatio={1.7}

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							yLabel
							yOptions={{
								name: "Total population",
								min: -1,
								unit: "inh."
							}}
							withoutYbaseline

							sorting={[["period", "asc"]]}
							yCaptionsSize={80}
							xCaptionsSize={40}

							withPoints
							// legend
						/>
					</ChartWrapper>
					<ChartWrapper
						key={"column-chart-wrapper"}
						title="GNI in 2015"
						subtitle="GNI per capita, Atlas method (current US$)"
					>
						<ColumnChart
							key="column-chart"
							data={this.gniData}
							keySourcePath="gid"
							xSourcePath="name"
							ySourcePath="properties.GNI"
							sorting={[["properties.GNI", "desc"]]}

							height={200}
							minAspectRatio={1.7}

							xCaptions
							yCaptions
							yCaptionsSize={50}
							xCaptionsSize={60}
							xTicks
							yGridlines
							yLabel
							withoutYbaseline

							yOptions={{
								min: -1,
								// max: 105000,
								name: "GNI",
								unit: "current US$"
							}}

							colored
						/>
					</ChartWrapper>
				</div>
			</div>
		);
	}
}

export default UtepSdgCharts;


import React from 'react';
import _ from 'lodash';
import {ColumnChart, LineChart, ScatterChart, ChartWrapper} from '@gisatcz/ptr-charts';
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
			<div className="utep_sdg_11_3_1-charts">
				<ChartWrapper
					key={"line-chart-ratio-wrapper"}
					title="Urban area/Population change ratio"
					subtitle="Ratio of Urban area change and Population change between years 1985 and 2015"
				>
					<LineChart
						key="line-chart-ratio"
						data={this.data}

						keySourcePath="gid"
						nameSourcePath="name"
						serieDataSourcePath="properties"
						colorSourcePath="color"
						xSourcePath="period" // in context of serie
						ySourcePath="UA_POP_change_ratio" // in context of serie

						height={12}
						minWidth={10}
						minAspectRatio={1.7}

						yValuesSize={3}
						xValuesSize={3}

						xTicks
						xGridlines
						xValues
						yTicks
						yGridlines
						yValues
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
						colorSourcePath="color"
						keySourcePath="gid"

						xSourcePath="Population change" // in context of serie
						ySourcePath="Urban area change" // in context of serie

						itemNameSourcePath="period" // in context of serie

						height={12}
						minWidth={10}
						minAspectRatio={1.7}

						xGridlines
						xValues
						xValuesSize={2}
						xTicks
						xLabel
						xOptions={{
							name: "Population change",
							unit: "%"
						}}

						yGridlines
						yValues
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

						keySourcePath="gid"
						nameSourcePath="name"
						serieDataSourcePath="properties"
						colorSourcePath="color"
						xSourcePath="period" // in context of serie
						ySourcePath="Total population" // in context of serie

						height={12}
						minWidth={10}
						minAspectRatio={1.7}

						xTicks
						xGridlines
						xValues
						yTicks
						yGridlines
						yValues
						yLabel
						yOptions={{
							name: "Total population",
							min: -1,
							unit: "inh."
						}}
						withoutYbaseline

						sorting={[["period", "asc"]]}
						yValuesSize={5}
						xValuesSize={3}

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
						nameSourcePath="name"
						xSourcePath="name"
						ySourcePath="properties.GNI"
						sorting={[["properties.GNI", "desc"]]}

						height={12}
						minWidth={10}
						minAspectRatio={1.7}

						xValues
						yValues
						yValuesSize={3}
						xValuesSize={4}
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

						colorSourcePath="color"
					/>
				</ChartWrapper>
			</div>
		);
	}
}

export default UtepSdgCharts;


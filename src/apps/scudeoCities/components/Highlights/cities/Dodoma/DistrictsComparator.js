import React from 'react';
import PropTypes from 'prop-types';
import conversions from "../../../../data/conversions";
import Select from "../../../../../../components/common/atoms/Select/Select";

import * as dodoma_au_level_3 from '../../../../data/EO4SD_DODOMA_AL3.json';
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";

const au_3_data = dodoma_au_level_3.features;

const au_3_attributes_lulc_1_normalized = conversions.featuresToAttributes(au_3_data, 'AL3_ID', '2006',[
	{key: 'as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
	{key: 'as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
	{key: 'as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
	{key: 'as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
	{key: 'as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}
],'AL3_AREA');

const chartTypeOptions = [{
	key: 'aster-chart',
	name: 'Structure chart'
}, {
	key: 'column-chart',
	name: 'Bar chart'
}];

class DistrictsComparator extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			firstDistrictValue: au_3_data[3],
			secondDistrictValue: au_3_data[4],
			chartType: chartTypeOptions[0]
		};

		this.onFirstDistrictChange = this.onFirstDistrictChange.bind(this);
		this.onSecondDistrictChange = this.onSecondDistrictChange.bind(this);
		this.onChartTypeChange = this.onChartTypeChange.bind(this);
	}

	onChartTypeChange(chartType) {
		this.setState({chartType})
	}

	onFirstDistrictChange(value) {
		this.setState({firstDistrictValue: value})
	}

	onSecondDistrictChange(value) {
		this.setState({secondDistrictValue: value})
	}

	render() {
		const state = this.state;

		let firstDistrictDataNormalized = au_3_attributes_lulc_1_normalized[state.firstDistrictValue["properties"]["AL3_ID"]];
		let secondDistrictDataNormalized = au_3_attributes_lulc_1_normalized[state.secondDistrictValue["properties"]["AL3_ID"]];

		return (
			<div className="scudeoCities-districts-comparator">
				<Select
					onChange={this.onChartTypeChange}
					options={chartTypeOptions}
					optionLabel="name"
					optionValue="key"
					value={this.state.chartType}
				/>
				<div className="scudeoCities-districts-comparator-columns">
					<div className="scudeoCities-districts-comparator-column">
						{this.renderDistrictSelect(state.firstDistrictValue, this.onFirstDistrictChange)}
						<div className="scudeoCities-districts-comparator-chart">
							<HoverHandler>
								{this.state.chartType.key === 'aster-chart' ?
									this.renderAsterChart('scudeoCities-comparator-chart-1', firstDistrictDataNormalized) :
									this.renderColumnChart('scudeoCities-comparator-column-chart-1', firstDistrictDataNormalized)}
							</HoverHandler>
						</div>
					</div>
					<div className="scudeoCities-districts-comparator-column">
						{this.renderDistrictSelect(state.secondDistrictValue, this.onSecondDistrictChange)}
						<div className="scudeoCities-districts-comparator-chart">
							<HoverHandler>
								{this.state.chartType.key === 'aster-chart' ?
									this.renderAsterChart('scudeoCities-comparator-chart-2', secondDistrictDataNormalized) :
									this.renderColumnChart('scudeoCities-comparator-column-chart-2', secondDistrictDataNormalized)}
							</HoverHandler>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderDistrictSelect(value, onChange) {
		return (
			<Select
				onChange={onChange}
				options={au_3_data}
				optionLabel="properties.AL3_NAME"
				optionValue="properties.AL3_ID"
				value={value}
			/>
		);
	}

	renderAsterChart(key, data) {
		return (
			<AsterChart
				key={key}
				data={data}
				keySourcePath="key"
				nameSourcePath="name"
				valueSourcePath="value"
				colorSourcePath="color"
				relative
				forceMinimum={0}
				forceMaximum={100}
				maxWidth={15}
				padding={0.5}
				gridStepsMax={5}

				legend
			/>
		);
	}

	renderColumnChart(key, data) {
		return (
			<ColumnChart
				key={key}
				data={data}
				keySourcePath="key"
				nameSourcePath="name"
				xSourcePath="name"
				ySourcePath="value"
				colorSourcePath="color"

				xValuesSize={6}
				yValuesSize={3}
				yLabel
				yOptions={{
					max: 105,
					unit: '%',
					name: 'Part of total area'
				}}
			/>
		);
	}
}

export default DistrictsComparator;


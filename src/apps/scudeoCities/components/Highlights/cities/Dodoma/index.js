import React from 'react';
import PropTypes from 'prop-types';
import conversions from "../../../../data/conversions";
import Select from "../../../../../../components/common/atoms/Select/Select";

import * as dodoma_au_level_1 from '../../../../data/EO4SD_DODOMA_AL1.json';
import * as dodoma_au_level_2 from '../../../../data/EO4SD_DODOMA_AL2.json';
import * as dodoma_au_level_3 from '../../../../data/EO4SD_DODOMA_AL3.json';
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../../../../components/common/charts/ScatterChart/ScatterChart";
import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";
import DistrictsComparator from "./DistrictsComparator";

const au_1_data = dodoma_au_level_1.features;
const au_2_data = dodoma_au_level_2.features;
const au_3_data = dodoma_au_level_3.features;

const au_1_serial = conversions.featuresToSerialData(au_1_data);
const au_2_serial = conversions.featuresToSerialData(au_2_data);
const au_3_serial = conversions.featuresToSerialData(au_3_data);

const au_3_serial_normalized_by_total_area = conversions.featuresToSerialData(au_3_data, 'AL3_AREA');

let au_2_attributes_lulc_1_normalized = conversions.featuresToAttributes(au_2_data, 'AL2_ID', '2016',[
	{key: 'as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
	{key: 'as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
	{key: 'as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
	{key: 'as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
	{key: 'as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}
],'AL2_AREA');

const aggregationOptions = [{
	key: 'aggregated',
	name: 'Aggregated'
}, {
	key: 'districts',
	name: 'Districts'
}];

class Dodoma extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			aggregationValue: aggregationOptions[1]
		};

		this.onAggregationChange = this.onAggregationChange.bind(this);
	}

	onAggregationChange(value) {
		this.setState({aggregationValue: value})
	}

	render() {
		const state = this.state;

		return (
			<>
				<h2>Land Use / Land Cover - Overview (City core)</h2>
				<h3>Land cover structure</h3>
				<div>
					<HoverHandler>
						<AsterChart
							key="overview-lulc-structure"
							data={au_2_attributes_lulc_1_normalized["1"]}
							keySourcePath="key"
							nameSourcePath="name"
							valueSourcePath="value"
							colorSourcePath="color"
							relative
							forceMinimum={0}
							forceMaximum={40}
							maxWidth={25}
							padding={0.5}
							gridStepsMax={4}

							legend
						/>
					</HoverHandler>
				</div>


				<h2>Land Use / Land Cover - City districts</h2>
				<h3>Land cover structure - Districts comparison</h3>
				<DistrictsComparator/>

				<h3>Artificial land vs. Natural Areas (normalized) in 2006 and 2016</h3>
				<div>
					<HoverHandler>
						<div style={{display: 'flex'}}>
						<ScatterChart
							key="districts-comparison"

							data={au_3_serial_normalized_by_total_area}
							keySourcePath="AL3_ID"
							nameSourcePath="AL3_NAME"
							xSourcePath="data[0].as_611001000_attr_61110000"
							ySourcePath="data[0].as_611001000_attr_61130000"

							height={20}
							width={20}

							innerPaddingLeft={0}

							xLabel
							yLabel

							xOptions={{
								min: 0,
								max: 103,
								name: "Artificial land",
								unit: "%"
							}}

							yOptions={{
								min: 0,
								max: 103,
								name: "Natural areas",
								unit: "%"
							}}
						/>
						<ScatterChart

							data={au_3_serial_normalized_by_total_area}
							keySourcePath="AL3_ID"
							nameSourcePath="AL3_NAME"
							xSourcePath="data[1].as_611001000_attr_61110000"
							ySourcePath="data[1].as_611001000_attr_61130000"

							height={20}
							width={20}

							innerPaddingLeft={0}

							xLabel
							yLabel

							xOptions={{
								min: 0,
								max: 103,
								name: "Artificial land",
								unit: "%"
							}}

							yOptions={{
								min: 0,
								max: 103,
								name: "Natural areas",
								unit: "%"
							}}
						/>
						</div>
					</HoverHandler>
				</div>

				<h3>Agricultural area (normalized) progress</h3>
				<div style={{maxWidth: '50rem'}}>
					<Select
						onChange={this.onAggregationChange}
						options={aggregationOptions}
						optionLabel="name"
						optionValue="key"
						value={this.state.aggregationValue}
					/>
					<br/>
					<HoverHandler>
						<LineChart
							key="agricultural-area-dodoma"

							data={au_3_serial_normalized_by_total_area}
							keySourcePath="AL3_ID"
							nameSourcePath="AL3_NAME"
							serieDataSourcePath="data"
							xSourcePath="period"
							ySourcePath="as_611001000_attr_61120000"

							sorting={[["period", "asc"]]}
							forceMode={this.state.aggregationValue.key === "aggregated" ? "aggregated" : false}

							innerPaddingTop={0}
							innerPaddingLeft={0}
							innerPaddingRight={0}
							height={20}
							yValuesSize={4}
							yLabel
							yOptions={{
								name: "Agricultural area",
								unit: "%",
								max: 103
							}}
						/>
					</HoverHandler>
				</div>
			</>
		);
	}
}

export default Dodoma;


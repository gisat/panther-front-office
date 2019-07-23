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

const au_3_attributes_lulc_1_normalized = conversions.featuresToAttributes(au_3_data, 'AL3_ID', '2006',[
	{key: 'as_611001000_attr_61110000', name: 'Artificial Surfaces', color: '#ae0214'},
	{key: 'as_611001000_attr_61120000', name: 'Agricultural Area', color: '#ffdc9b'},
	{key: 'as_611001000_attr_61130000', name: 'Natural and Semi-natural Areas', color: '#59b642'},
	{key: 'as_611001000_attr_61140000', name: 'Wetlands', color: '#a6a6ff'},
	{key: 'as_611001000_attr_61150000', name: 'Water', color: '#56c8ee'}
],'AL3_AREA');

class Dodoma extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			districtValue: au_3_data[0]
		}
	}

	onChange(value) {
		this.setState({districtValue: value})
	}

	render() {
		const state = this.state;

		let data = au_3_attributes_lulc_1_normalized[state.districtValue["properties"]["AL3_ID"]];
		return (
			<>
				<h2>Land Use / Land Cover - Overview</h2>
				<p>TODO</p>

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
				<p>TODO: Switch all districts/average</p>
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
						forceMode="aggregated"

						innerPaddingTop={0}
						innerPaddingLeft={0}
						innerPaddingRight={0}
						height={20}
						width={40}
						yValuesSize={4}
						yLabel
						yOptions={{
							name: "Agricultural area",
							unit: "%",
							max: 103
						}}
					/>
				</HoverHandler>
			</>
		);
	}
}

export default Dodoma;


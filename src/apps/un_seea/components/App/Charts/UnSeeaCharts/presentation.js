import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverContext from "../../../../../../components/common/HoverHandler/context";
import Icon from "../../../../../../components/common/atoms/Icon";
import chroma from "chroma-js";

const observedValues = [
	{
		name: 'Agriculture low vegetation',
		color: '#03369c'
	},
	{
		name: 'Area of Borough',
		color: '#2a4fa9'
	},
	{
		name: 'Area of City',
		color: '#3e67b6'
	},
	{
		name: 'Builtup Area',
		color: '#4e80c3'
	},
	{
		name: 'Open land',
		color: '#5c9cd0'
	},
	{
		name: 'Population Census 2008',
		color: '#69b6dd'
	},
	{
		name: 'Tree canopy',
		color: '#00f'
	},
	{
		name: 'Water',
		color: '#74d2ea'
	}
];

class EsponFuoreChart extends React.PureComponent {
	static contextType = HoverContext;
	
	static propTypes = {
		data: PropTypes.array,
		selectedArea: PropTypes.string,
	};

	transformDataForAsterChart(data) {
		const transformedData = [];
		for (const [key, value] of Object.entries(data)) {
			const observedValue = observedValues.find(ov => ov.name === key);
			if(observedValue) {
				transformedData.push({
					key: `${data.gid}-${value}`,
					value,
					name: key,
					color: observedValue.color
				})
			}
		}

		return {
			key: data.gid,
			data: transformedData
		}
	}
	

	render() {
		const {data} = this.props;

		let hoveredData;
		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			hoveredData = data.find((d) => d.gid === this.context.hoveredItems[0])
		}
		
		let selectedAreaData;
		if (this.props.selectedArea) {
			selectedAreaData = data.find((d) => d.gid === this.props.selectedArea);
		}

		let hoverAsterData;
		if(hoveredData) {
			hoverAsterData = this.transformDataForAsterChart(hoveredData);
		}

		let selectAsterData;
		if(selectedAreaData) {
			selectAsterData = this.transformDataForAsterChart(selectedAreaData);
		}

		const title = "Aster chart"
		const description = "description"
		const loading = false
			return (
				<>
					<ChartWrapper
					key={selectAsterData.key + "-wrapper"}
					title={title}
					subtitle={description}
					loading={loading}
					>
					
						<AsterChart
							key={`${selectAsterData.key}-aster-doc-basic`}
							data={selectAsterData.data}
							// width={this.state.width}
							width={200}
							maxWidth={500}

							keySourcePath="key"
							nameSourcePath="name"
							valueSourcePath="value"
							colorSourcePath="color"
							forceMaximum={1000000}
							// forceMinimum={1000}
							// sorting={[["value", "desc"]]}
							grid
							legend
						/>
					</ChartWrapper>
					{
						hoverAsterData ? <ChartWrapper
						key={this.props.chartKey + "-wrapper"}
						title={title}
						subtitle={description}
						loading={loading}
						>
						
							<AsterChart
								key="aster-doc-basic"
								data={hoverAsterData.data}
								// width={this.state.width}
								width={200}
								maxWidth={500}
	
								keySourcePath="key"
								nameSourcePath="name"
								valueSourcePath="value"
								colorSourcePath="color"
								forceMaximum={1000000}
								// forceMinimum={1000}
								// sorting={[["value", "desc"]]}
								grid
								legend
							/>
						</ChartWrapper>: null

					}
				</>
				
				)
	}
}

export default EsponFuoreChart;


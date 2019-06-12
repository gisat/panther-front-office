import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverContext from "../../../../../../components/common/HoverHandler/context";
import Icon from "../../../../../../components/common/atoms/Icon";
import chroma from "chroma-js";

class EsponFuoreChart extends React.PureComponent {
	static contextType = HoverContext;
	
	static propTypes = {
		data: PropTypes.array,
	};


	render() {
		const {data} = this.props;

		let hoveredData;
		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			hoveredData = data.find((d) => d.gid ===this.context.hoveredItems[0])
			// this.context.hoveredItems
			// highlightedFromContext = _.includes(this.context.hoveredItems, this.props.itemKey);

			// if (this.props.siblings && !!_.intersection(this.context.hoveredItems, this.props.siblings).length) {
			// 	suppressed = !highlightedFromContext;
			// }

			// if (highlightedFromContext) {
			// 	color = this.props.highlightedColor ? this.props.highlightedColor : null;
			// }
		}
		let transformedData = [];
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

		let asterData;
		if(hoveredData) {

			for (const [key, value] of Object.entries(hoveredData)) {
				const observedValue = observedValues.find(ov => ov.name === key);
				if(observedValue) {
					transformedData.push({
						key: `${hoveredData.gid}-${value}`,
						value,
						name: key,
						color: observedValue.color
					})
				}
			}

			asterData = {
				key: hoveredData.gid,
				data: transformedData
			}
		}
console.log(asterData);

		const title = "Aster chart"
		const description = "description"
		const loading = false
			return (
				<ChartWrapper
				key={this.props.chartKey + "-wrapper"}
				title={title}
				subtitle={description}
				loading={loading}
			>
				
				<AsterChart
					key="aster-doc-basic"
					data={transformedData}
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
			</ChartWrapper>)
	}
}

export default EsponFuoreChart;


import React from 'react';
import PropTypes from 'prop-types';
import {ColumnChart, ChartWrapper} from '@gisatcz/ptr-charts';
import observedValues from './observed';

import {Context} from "@gisatcz/ptr-core";
import './style.css';
const HoverContext = Context.getContext('HoverContext');

class ChartPanel extends React.PureComponent {
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
					key: `${data[this.props.spatialIdKey]}-${key}-${value.relative}`,
					value: {
						absolute: value.absolute,
						tooltipValue: typeof observedValue.getTooltip === 'function' ? observedValue.getTooltip(value.absolute) : value.absolute
					},
					name: observedValue.title,
					color: observedValue.color
				})
			}
		}

		return {
			key: data[this.props.spatialIdKey],
			data: transformedData
		}
	}
	

	render() {
		const {data} = this.props;

		let hoveredData;
		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			hoveredData = data.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0])
		}

		let hoverAsterData;
		if(hoveredData) {
			hoverAsterData = this.transformDataForAsterChart(hoveredData);
		}

		let selectedAreaData;
		if (this.props.selectedArea) {
			selectedAreaData = data.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea);
		}

		let selectAsterData;
		if(selectedAreaData) {
			selectAsterData = this.transformDataForAsterChart(selectedAreaData);
		}

		const description = "Mean ecosystem values normalised by population per district."
		const commonChartsProps = {
			keySourcePath:"key",
			nameSourcePath:"name",
			valueSourcePath:"value.absolute",

			xSourcePath:"name",
			ySourcePath:"value.absolute",
			xValues: true,
			yValues: true,

			yGridlines: true,
			withoutYbaseline: true,
			width: 15,
			maxWidth: 22,
			height: 22,

			xValuesSize: 10,
			yValuesSize: 4.5,

			yOptions:{
				min: -1,
				max: 15000000,
			}
		};

			return (
					<div className="ptr-unseea-chart-panel">
						<div className="ptr-unseea-chart-column">
						{
							hoverAsterData ? 
								<ChartWrapper
									key={hoverAsterData.key + "-wrapper"}
									title={hoveredData.name}
									subtitle={description}
								>
									<ColumnChart
										key="column-districts-second-hover"
										data={hoverAsterData.data}
										animateChangeData={false}
										{...commonChartsProps}
									/>
							</ChartWrapper> : 
							(
								<div className="ptr-chart-wrapper-content">
									<p>
										What is the value of urban nature in the Oslo area? URBAN EEA maps and values ecosystem services in the Oslo Region, and tests methods for ecosystem accounting at the municipal level.
									</p>
									<p>
										The URBAN EEA project conducts research on ecosystem services from urban ecosystems in the Oslo Region, both green spaces in the built area and peri-urban nature areas. The project contributes to research and development on the UNs Experimental Ecosystem Accounting (EEA) and its application to urban areas. URBAN EEA aims to develop ecosystem accounts for the Oslo area providing lessons for other Norwegian municipalities.
									</p>
									<p>
										Read more: <a href="https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA">https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA</a>
									</p>
								</div>
								)
						}
						</div>
						<div className="ptr-unseea-chart-column">
							<ChartWrapper
							key={selectAsterData.key + "-wrapper"}
							title={selectedAreaData.name}
							subtitle={description}
							>
								<ColumnChart
									key="district-second"
									data={selectAsterData.data}
									hoverValueSourcePath="value.tooltipValue"
									{...commonChartsProps}
								/>
							</ChartWrapper>
						</div>
					</div>
				)
	}
}

export default ChartPanel;


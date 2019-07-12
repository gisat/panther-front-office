import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverContext from "../../../../../../components/common/HoverHandler/context";
import observedValues from './observed';

import './style.css';

class ChartPanel extends React.PureComponent {
	static contextType = HoverContext;
	
	static propTypes = {
		data: PropTypes.array,
		spatialIdKey: PropTypes.string
	};

	transformDataForAsterChart(data) {
		const transformedData = [];
		for (const [key, value] of Object.entries(data)) {
			const observedValue = observedValues.find(ov => ov.name === key);
			if(observedValue) {
				transformedData.push({
					key: `${data[this.props.spatialIdKey]}-${key}-${value.relative}`,
					value: {
						relative: value.relative,
						absolute: typeof observedValue.getTooltip === 'function' ? observedValue.getTooltip(value.absolute) : value.absolute
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
			hoveredData = data.find((d) => d[this.props.spatialIdKey] == this.context.hoveredItems[0])
		}

		let hoverAsterData;
		if(hoveredData) {
			hoverAsterData = this.transformDataForAsterChart(hoveredData);
		}

		let selectedAreaData;
		if (this.props.selectedArea) {
			selectedAreaData = data.find((d) => d[this.props.spatialIdKey] == this.props.selectedArea);
		}

		let selectAsterData;
		if(selectedAreaData) {
			selectAsterData = this.transformDataForAsterChart(selectedAreaData);
		}

		const description = "Ecosystem values"

			return (
					<div className="ptr-unseea-chart-panel">
						<div className="ptr-unseea-chart-column">
						{
							hoverAsterData ? 
								<ChartWrapper
									key={this.props.chartKey + "-wrapper"}
									title={`Tree ID: ${this.context.hoveredItems[0]}`}
									subtitle={description}
								>
								<AsterChart
									key="aster-doc-basic"
									// data={[]}
									data={hoverAsterData.data}
									keySourcePath="key"
									nameSourcePath="name"
									valueSourcePath="value.relative"
									hoverValueSourcePath="value.absolute"
									colorSourcePath="color"
									relative
									grid={{
										captions: true
									}}
									radials={{
										captions: true
									}}
									forceMinimum={0}
									forceMaximum={100}
									legend
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
							title={`Tree ID: ${selectedAreaData[this.props.spatialIdKey]}`}
							subtitle={description}
							>
							
								<AsterChart
									key={`${selectAsterData.key}-aster-doc-basic`}
									data={selectAsterData.data}

									keySourcePath="key"
									nameSourcePath="name"
									valueSourcePath="value.relative"
									hoverValueSourcePath="value.absolute"
									colorSourcePath="color"
									relative
									grid={{
										captions: true
									}}
									radials={{
										captions: true
									}}
									legend
									forceMinimum={0}
									forceMaximum={100}
								/>
							</ChartWrapper>
						</div>
					</div>
				)
	}
}

export default ChartPanel;


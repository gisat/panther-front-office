import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverContext from "../../../../../../components/common/HoverHandler/context";
import observedEcosystemServiceIndicators from './observedEcosystemServiceIndicators';
import observedMonetaryIndicators from './observedMonetaryIndicators';

import './style.css';

class ChartPanel extends React.PureComponent {
	static contextType = HoverContext;
	
	static propTypes = {
		ecosystemServiceIndicatorsData: PropTypes.array,
		ecosystemServiceIndicatorsStatistics: PropTypes.object,
		monetaryIndicatorsData: PropTypes.array,
		monetaryIndicatorsStatistics: PropTypes.object,
		selectedArea: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			normalised: false,
		};

		this.onShowNormalisedDataClicked = this.onShowNormalisedDataClicked.bind(this);
	}

	transformDataForAsterChart(data = {}, filterObservedValues) {
		const transformedData = [];
		for (const [key, value] of Object.entries(data)) {
			const observedValue = filterObservedValues.find(ov => ov.name === key);
			if(observedValue) {
				transformedData.push({
					key: `${data[this.props.spatialIdKey]}-${key}-${value.relative}`,
					value: {
						relative: value.relative,
						absolute: value.absolute,
						absoluteTooltip: typeof observedValue.getTooltip === 'function' ? observedValue.getTooltip(value.absolute) : value.absolute
					},
					name: observedValue.title,
					color: observedValue.color
				})
			}
		}

		return {
			key: data[this.props.spatialIdKey],
			data: transformedData,
			name: data.name,
		}
	}

	onShowNormalisedDataClicked(event) {
		this.setState({
			normalised: event.target.checked
		})
	}
	

	render() {
		const {ecosystemServiceIndicatorsData, monetaryIndicatorsData, ecosystemServiceIndicatorsStatistics, monetaryIndicatorsStatistics} = this.props;

		let hoverAsterDataEcosystemServiceIndicators
		let hoverAsterDataMonetaryIndicators
		if(this.context && this.context.hoveredItems) {
			hoverAsterDataEcosystemServiceIndicators = this.transformDataForAsterChart(ecosystemServiceIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0]), observedEcosystemServiceIndicators);
			hoverAsterDataMonetaryIndicators = this.transformDataForAsterChart(monetaryIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0]), observedMonetaryIndicators);
		}

		let selectAsterDataEcosystemServiceIndicators
		let selectAsterDataMonetaryIndicators
		if(this.props.selectedArea) {
			selectAsterDataEcosystemServiceIndicators = this.transformDataForAsterChart(ecosystemServiceIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea), observedEcosystemServiceIndicators);
			selectAsterDataMonetaryIndicators = this.transformDataForAsterChart(monetaryIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea), observedMonetaryIndicators);
		}

		const ecosystemServiceDescription = "Mean ecosystem service values normalised by population per district."
		const monetaryIndicatorsDescription = "Mean monetary values normalised by population per district."

			return (
					<div>
						<div className="ptr-unseea-top-options">
							<label>
								Normalise data by by median
								<input type="checkbox" checked={this.state.normalised} onChange={this.onShowNormalisedDataClicked} />
							</label>
						</div>
						<div className="ptr-unseea-chart-panel">

							<div className="ptr-unseea-chart-column">
							{
								hoverAsterDataEcosystemServiceIndicators && hoverAsterDataEcosystemServiceIndicators.data && hoverAsterDataEcosystemServiceIndicators.data.length > 0 && 
								hoverAsterDataMonetaryIndicators && hoverAsterDataMonetaryIndicators.data && hoverAsterDataMonetaryIndicators.data.length > 0 ? 
									<div>
										<ChartWrapper
											key={this.props.chartKey + "-wrapper-1"}
											title={hoverAsterDataEcosystemServiceIndicators.name}
											subtitle={ecosystemServiceDescription}
										>
											<AsterChart
												key="aster-doc-basic-1"
												data={hoverAsterDataEcosystemServiceIndicators.data}

												keySourcePath="key"
												nameSourcePath="name"
												valueSourcePath= {this.state.normalised ? "value.relative" : "value.absolute"}
												hoverValueSourcePath="value.absoluteTooltip"
												colorSourcePath="color"
												relative = {this.state.normalised}
												grid={{
													captions: true
												}}
												radials={{
													captions: true
												}}
												forceMinimum={0}
												forceMaximum= {this.state.normalised ? 100 : ecosystemServiceIndicatorsStatistics.sumStatistics.max}
												legend
											/>
										</ChartWrapper>
										<ChartWrapper
											key={this.props.chartKey + "-wrapper-2"}
											title={hoverAsterDataMonetaryIndicators.name}
											subtitle={monetaryIndicatorsDescription}
										>
											<AsterChart
												key="aster-doc-basic-2"
												data={hoverAsterDataMonetaryIndicators.data}

												keySourcePath="key"
												nameSourcePath="name"
												valueSourcePath= {this.state.normalised ? "value.relative" : "value.absolute"}
												hoverValueSourcePath="value.absoluteTooltip"
												colorSourcePath="color"
												relative = {this.state.normalised}
												grid={{
													captions: true
												}}
												radials={{
													captions: true
												}}
												forceMinimum={0}
												forceMaximum= {this.state.normalised ? 100 : monetaryIndicatorsStatistics.sumStatistics.max}
												legend
											/>
										</ChartWrapper>
									</div> : 
								(
									<div className="ptr-chart-wrapper-content">
										<p>
											What is the value of urban nature in the Oslo area? Oslo EEA municipal applications maps and values ecosystem services in the Oslo Region, and tests methods for ecosystem accounting at the municipal level.
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
										key={selectAsterDataEcosystemServiceIndicators.key + "-wrapper-1"}
										title={selectAsterDataEcosystemServiceIndicators.name}
										subtitle={ecosystemServiceDescription}
										>
										<AsterChart
											key={`${selectAsterDataEcosystemServiceIndicators.key}-aster-doc-basic-1`}
											data={selectAsterDataEcosystemServiceIndicators.data}

											keySourcePath="key"
											nameSourcePath="name"
											valueSourcePath= {this.state.normalised ? "value.relative" : "value.absolute"}
											hoverValueSourcePath="value.absoluteTooltip"
											colorSourcePath="color"
											relative = {this.state.normalised}
											grid={{
												captions: true
											}}
											radials={{
												captions: true
											}}
											legend
											forceMinimum={0}
											forceMaximum= {this.state.normalised ? 100 : ecosystemServiceIndicatorsStatistics.sumStatistics.max}
										/>
									</ChartWrapper>
									<ChartWrapper
									key={selectAsterDataMonetaryIndicators.key + "-wrapper-2"}
									title={selectAsterDataMonetaryIndicators.name}
									subtitle={monetaryIndicatorsDescription}
									>
									
										<AsterChart
											key={`${selectAsterDataMonetaryIndicators.key}-aster-doc-basic-2`}
											data={selectAsterDataMonetaryIndicators.data}

											keySourcePath="key"
											nameSourcePath="name"
											valueSourcePath= {this.state.normalised ? "value.relative" : "value.absolute"}
											hoverValueSourcePath="value.absoluteTooltip"
											colorSourcePath="color"
											relative = {this.state.normalised}
											grid={{
												captions: true
											}}
											radials={{
												captions: true
											}}
											legend
											forceMinimum={0}
											forceMaximum= {this.state.normalised ? 100 : monetaryIndicatorsStatistics.sumStatistics.max}
										/>
									</ChartWrapper>
							</div>
						</div>
					</div>
				)
	}
}

export default ChartPanel;


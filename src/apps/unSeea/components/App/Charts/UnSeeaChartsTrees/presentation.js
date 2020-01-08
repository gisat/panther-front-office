import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverContext from "../../../../../../components/common/HoverHandler/context";
import observedCondition from './observedCondition';
import observedPhysicalEcosystemServices from './observedPhysicalEcosystemServices';
import observedMonetaryAssetValues from './observedMonetaryAssetValues';


class ChartPanel extends React.PureComponent {
	static contextType = HoverContext;
	
	static propTypes = {
		// data: PropTypes.array,
		conditionIndicatorsStatistics: PropTypes.array,
		physicalEcosystemServicesIndicatorsStatistics: PropTypes.array,
		conditionIndicatorsIndicatorsData: PropTypes.array,
		physicalEcosystemServicesIndicatorsData: PropTypes.array,
		spatialIdKey: PropTypes.string,
		conditionIndicatorsMaximum: PropTypes.number,
		physicalEcosystemServicesMaximum: PropTypes.number,
		monetaryAssetValuesMaximum: PropTypes.number,
	};

	transformDataForAsterChart(data = {}, filterObservedValues) {
		const transformedData = [];
		for (const [key, value] of Object.entries(data)) {
			const observedValue = filterObservedValues.find(ov => ov.name === key);
			if(observedValue) {
				transformedData.push({
					key: `${data[this.props.spatialIdKey]}-${key}-${value.relative}`,
					value: {
						// relative: value.relativeMedian,
						relative: value.relativeMax,
						absolute: value.absolute,
						absoluteTooltip: typeof observedValue.getTooltip === 'function' ? observedValue.getTooltip(value.absolute) : value.absolute,
						relativeNormalised: value.relativeNormalised,
						absoluteNormalised: value.absoluteNormalised,
						absoluteTooltipNormalised: typeof observedValue.getTooltip === 'function' ? observedValue.getTooltip(value.absoluteNormalised) : value.absoluteNormalised
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
	

	render() {
		// const {conditionIndicatorsIndicatorsData, maximum} = this.props;

		// let hoveredData;
		// /* Handle context */
		// if (this.context && this.context.hoveredItems) {
		// 	hoveredData = conditionIndicatorsIndicatorsData.find((d) => d[this.props.spatialIdKey] == this.context.hoveredItems[0])
		// }

		// let hoverAsterData;
		// if(hoveredData) {
		// 	hoverAsterData = this.transformDataForAsterChart(hoveredData);
		// }

		// let selectedAreaData;
		// if (this.props.selectedArea) {
		// 	selectedAreaData = conditionIndicatorsIndicatorsData.find((d) => d[this.props.spatialIdKey] == this.props.selectedArea);
		// }

		// let selectAsterData;
		// if(selectedAreaData) {
		// 	selectAsterData = this.transformDataForAsterChart(selectedAreaData);
		// }

		const {conditionIndicatorsStatistics, physicalEcosystemServicesIndicatorsStatistics, conditionIndicatorsIndicatorsData, physicalEcosystemServicesIndicatorsData, monetaryAssetValuesStatistics, monetaryAssetValuesData, conditionIndicatorsMaximum, physicalEcosystemServicesMaximum, monetaryAssetValuesMaximum} = this.props;

		let hoverAsterDataConditionIndicators
		let hoverAsterDataPhysicalEcosystemServicesIndicators
		let hoverAsterDataMonetaryAssetValuesData
		if(this.context && this.context.hoveredItems) {
			hoverAsterDataConditionIndicators = this.transformDataForAsterChart(conditionIndicatorsIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0]), observedCondition);
			hoverAsterDataPhysicalEcosystemServicesIndicators = this.transformDataForAsterChart(physicalEcosystemServicesIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0]), observedPhysicalEcosystemServices);
			hoverAsterDataMonetaryAssetValuesData = this.transformDataForAsterChart(monetaryAssetValuesData.find((d) => d[this.props.spatialIdKey] === this.context.hoveredItems[0]), observedMonetaryAssetValues);
		}

		let selectAsterDataConditionIndicators
		let selectAsterDataPhysicalEcosystemServicesIndicators
		let selectAsterDataMonetaryAssetValuesData
		let data;
		if(this.props.selectedArea) {
			data = conditionIndicatorsIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea);
			selectAsterDataConditionIndicators = this.transformDataForAsterChart(data, observedCondition);
			selectAsterDataPhysicalEcosystemServicesIndicators = this.transformDataForAsterChart(physicalEcosystemServicesIndicatorsData.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea), observedPhysicalEcosystemServices);
			selectAsterDataMonetaryAssetValuesData = this.transformDataForAsterChart(monetaryAssetValuesData.find((d) => d[this.props.spatialIdKey] === this.props.selectedArea), observedMonetaryAssetValues);
		}

		const physicalEcosystemServicesDescription = "Physical ecosystem services tree characteristics in percentage where 100% is mean for all data."
		const conditionDescription = "Condition tree characteristics in percentage where 100% is mean for all data."
		const monetaryAssetValuesDescription = "Monetary asset values in percentage where 100% is mean for all data."

			return (
					<div className="ptr-unseea-chart-panel">
						<div className="ptr-unseea-chart-column">
						{
							hoverAsterDataConditionIndicators && hoverAsterDataConditionIndicators.data && hoverAsterDataConditionIndicators.data.length > 0 ? <div>
									<ChartWrapper
										key={this.props.chartKey + "-wrapper-1"}
										// title={`Tree ID: ${this.context.hoveredItems[0]}, ${hoveredData['SP_CO_NAME']}`}
										title={`Species common name: ${data['SP_CO_NAME']}`}
										subtitle={conditionDescription}
									>
									<AsterChart
										key="aster-doc-basic-2"
										// data={[]}
										data={hoverAsterDataConditionIndicators.data}
										keySourcePath="key"
										nameSourcePath="name"
										valueSourcePath="value.relative"
										hoverValueSourcePath="value.absoluteTooltip"
										colorSourcePath="color"
										relative
										grid={{
											captions: true
										}}
										radials={{
											captions: true
										}}
										forceMinimum={0}
										forceMaximum={conditionIndicatorsMaximum}
										legend
									/>
								</ChartWrapper>
								<ChartWrapper
									key={this.props.chartKey + "-wrapper-2"}
									// title={`Tree ID: ${this.context.hoveredItems[0]}, ${hoveredData['SP_CO_NAME']}`}
									title={`Species common name: ${data['SP_CO_NAME']}`}
									subtitle={physicalEcosystemServicesDescription}
								>
									<AsterChart
										key="aster-doc-basic-2"
										// data={[]}
										data={hoverAsterDataPhysicalEcosystemServicesIndicators.data}
										keySourcePath="key"
										nameSourcePath="name"
										valueSourcePath="value.relative"
										hoverValueSourcePath="value.absoluteTooltip"
										colorSourcePath="color"
										relative
										grid={{
											captions: true
										}}
										radials={{
											captions: true
										}}
										forceMinimum={0}
										forceMaximum={physicalEcosystemServicesMaximum}
										legend
									/>
								</ChartWrapper>
								<ChartWrapper
									key={this.props.chartKey + "-wrapper-3"}
									// title={`Tree ID: ${this.context.hoveredItems[0]}, ${hoveredData['SP_CO_NAME']}`}
									title={`Species common name: ${data['SP_CO_NAME']}`}
									subtitle={monetaryAssetValuesDescription}
								>
									<AsterChart
										key="aster-doc-basic-3"
										// data={[]}
										data={hoverAsterDataMonetaryAssetValuesData.data}
										keySourcePath="key"
										nameSourcePath="name"
										valueSourcePath="value.relative"
										hoverValueSourcePath="value.absoluteTooltip"
										colorSourcePath="color"
										relative
										grid={{
											captions: true
										}}
										radials={{
											captions: true
										}}
										forceMinimum={0}
										forceMaximum={monetaryAssetValuesMaximum}
										legend
									/>
								</ChartWrapper>
							</div>
							: 
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
							key={selectAsterDataConditionIndicators.key + "-wrapper-1"}
							// title={`Tree ID: ${selectedAreaData[this.props.spatialIdKey]}`}
							title={`Species common name: ${data['SP_CO_NAME']}`}
							subtitle={conditionDescription}
							>
							
								<AsterChart
									key={`${selectAsterDataConditionIndicators.key}-aster-doc-basic-1`}
									data={selectAsterDataConditionIndicators.data}

									keySourcePath="key"
									nameSourcePath="name"
									valueSourcePath="value.relative"
									hoverValueSourcePath="value.absoluteTooltip"
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
									forceMaximum={conditionIndicatorsMaximum}
								/>
							</ChartWrapper>
							<ChartWrapper
							key={selectAsterDataPhysicalEcosystemServicesIndicators.key + "-wrapper-2"}
							// title={`Tree ID: ${selectedAreaData[this.props.spatialIdKey]}`}
							title={`Species common name: ${data['SP_CO_NAME']}`}
							subtitle={physicalEcosystemServicesDescription}
							>
							
								<AsterChart
									key={`${selectAsterDataPhysicalEcosystemServicesIndicators.key}-aster-doc-basic-2`}
									data={selectAsterDataPhysicalEcosystemServicesIndicators.data}

									keySourcePath="key"
									nameSourcePath="name"
									valueSourcePath="value.relative"
									hoverValueSourcePath="value.absoluteTooltip"
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
									forceMaximum={physicalEcosystemServicesMaximum}
								/>
							</ChartWrapper>
							<ChartWrapper
							key={selectAsterDataMonetaryAssetValuesData.key + "-wrapper-3"}
							// title={`Tree ID: ${selectedAreaData[this.props.spatialIdKey]}`}
							title={`Species common name: ${data['SP_CO_NAME']}`}
							subtitle={monetaryAssetValuesDescription}
							>
							
								<AsterChart
									key={`${selectAsterDataMonetaryAssetValuesData.key}-aster-doc-basic-3`}
									data={selectAsterDataMonetaryAssetValuesData.data}

									keySourcePath="key"
									nameSourcePath="name"
									valueSourcePath="value.relative"
									hoverValueSourcePath="value.absoluteTooltip"
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
									forceMaximum={monetaryAssetValuesMaximum}
								/>
							</ChartWrapper>
						</div>
					</div>
				)
	}
}

export default ChartPanel;


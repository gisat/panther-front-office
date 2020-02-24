import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {ColumnChart, LineChart, ChartWrapper} from '@gisatcz/ptr-charts';
import {Icon} from '@gisatcz/ptr-atoms';
import chroma from "chroma-js";
import fuoreUtils from "../../../../utils";

class EsponFuoreChart extends React.PureComponent {
	static propTypes = {
		attribute: PropTypes.object,
		filter: PropTypes.object,
		data: PropTypes.array,
		onSelectionClear: PropTypes.func,
		periods: PropTypes.array,
		availablePeriodKeys: PropTypes.array,
		name: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	onSelectionClear(attributeKey) {
		if (this.props.onSelectionClear) {
			this.props.onSelectionClear(attributeKey);
		}
	}

	render() {
		const props = this.props;
		let loading = true;

		let data = props.data;
		let filter = props.filter;
		let availablePeriods = null;

		let singleValue = props.periods && props.periods.length === 1;
		let attr = props.attribute && props.attribute.data;

		/* Titles */
		let title = null;
		if (props.name) {
			title = props.name;
		} else if (attr && attr.nameDisplay) {
			title = attr && attr.nameDisplay;
		}

		let subtitle = null;
		if (props.periods) {
			let names = props.periods.map(period => period.data && period.data.nameDisplay);
			if (names.length > 1) {
				let sortedNames = _.sortBy(names);
				subtitle = `From ${sortedNames[0]} to ${sortedNames[sortedNames.length - 1]}`;
			} else {
				subtitle = `${names[0]}`;
			}
		}

		/* All data prepared? */
		if (props.periods && props.periods.length && props.availablePeriodKeys && props.availablePeriodKeys.length) {
			availablePeriods = _.filter(props.periods, (period) => {
				return _.includes(props.availablePeriodKeys, period.key);
			});

			if (data && data.length) {
				if (singleValue && data && data[0] && data[0].data && data[0].data.values && data[0].data.values.length === 1) {
					loading = false;
				} else {
					_.forEach(data, (item) => {
						let serie = item.data.values;
						if (serie && serie.length >= availablePeriods.length) {
							loading = false;
							return false;
						}
					});
				}
			}

			if (availablePeriods.length === 0) {
				loading = false;
			}
		}

		if (filter && !filter.filteredKeys.length) {
			loading = false;
		}

		const color = fuoreUtils.resolveColour(props.attribute);

		return (
			<ChartWrapper
				key={this.props.chartKey + "-wrapper"}
				wrapperKey={this.props.chartKey + "-wrapper"}
				title={title}
				subtitle={subtitle}
				statusBar={filter ? (this.renderLabel(filter)) : null}
				loading={loading}
				enableExport
			>
				{singleValue ? this.renderColumnChart(data, availablePeriods, color) : this.renderLineChart(data, availablePeriods, color)}
			</ChartWrapper>
		);
	}

	renderColumnChart(data, availablePeriods, color) {
		let noItemFitsFilter = this.props.filter && this.props.filter.filteredKeys && !this.props.filter.filteredKeys.length;
		let enoughPeriods = availablePeriods && availablePeriods.length === 1;

		if (noItemFitsFilter) {
			return <div className="ptr-chart-wrapper-info">No area was filtered.</div>
		} else if (!enoughPeriods) {
			return <div className="ptr-chart-wrapper-info">No data available for selected period.</div>
		} else {
			return <ColumnChart
				key={this.props.chartKey}
				keySourcePath="key"
				nameSourcePath="data.name"
				xSourcePath="data.name"
				ySourcePath="data.values[0].value"
				sorting={[["data.values[0].value", "desc"]]}
				xGridlines
				yGridlines
				yValues
				xValues
				xValuesSize={5}
				yValuesSize={4.3}
				minAspectRatio={1.5}
				withoutYbaseline
				data={data}
				defaultColor={color}
				highlightColor={color ? chroma(color).darken(1) : null}
				barGapRatio={0.25}
				minBarWidth={5}
				diverging
			/>
		}
	}

	renderLineChart(data, availablePeriods, color) {
		let yOptions = null;
		let enoughPeriods = availablePeriods && availablePeriods.length > 1;
		let filters = this.props.filter && this.props.filter.attributeFilter && this.props.filter.attributeFilter.and;
		let noItemFitsFilter = this.props.filter && this.props.filter.filteredKeys && !this.props.filter.filteredKeys.length;
		let legend = data && data.length < 11;

		if (filters && this.props.attribute) {
			let activeAttributeFilter = _.find(filters, {attributeKey: this.props.attribute.key});
			if (activeAttributeFilter) {
				yOptions = {
					highlightedArea: {
						from: activeAttributeFilter.min,
						to: activeAttributeFilter.max
					}
				}
			}
		}

		if (noItemFitsFilter) {
			return <div className="ptr-chart-wrapper-info">No area was filtered.</div>
		} else if (!enoughPeriods) {
			return <div className="ptr-chart-wrapper-info">No data available for some of the selected periods.</div>
		} else {
			return <LineChart
				key={this.props.chartKey}
				keySourcePath="key"
				nameSourcePath="data.name"
				serieDataSourcePath="data.values"
				xSourcePath="key" // in context of serie
				ySourcePath="value" // in context of serie

				xTicks
				xGridlines
				xValues
				yGridlines
				yValues
				minAspectRatio={1.5}
				withoutYbaseline

				sorting={[["key", "asc"]]}

				xValuesSize={3}
				yValuesSize={4.3}

				yOptions={yOptions}

				withPoints
				data={data}
				defaultColor={color}
				highlightColor={color ? chroma(color).darken(1) : null}

				legend={legend}
			/>
		}
	}

	// TODO create component
	// TODO make clearable
	// TODO multiple labels
	renderLabel(filter) {
		let attributeFiltersAnd = filter && filter.attributeFilter && filter.attributeFilter.and;
		if (attributeFiltersAnd) {
			return attributeFiltersAnd.map((item, index) => {
				let text = null;
				if (item.type === "uniqueValues") {
					text = item.uniqueValues.join(", ");
				} else if (item.type === "interval") {
					text = "From " + item.min.toLocaleString() + " to " + item.max.toLocaleString() ;
				}

				return (
					<div key={index} className="ptr-colored-label">
						<div className="ptr-colored-label-content">
							<Icon icon="filter"/>
							<div>{text}</div>
						</div>
						<div className="ptr-colored-label-clear" onClick={this.onSelectionClear.bind(this, item.attributeKey)}>
							<Icon icon="times"/>
						</div>
					</div>
				);
			});
		} else {
			return null;
		}
	}
}

export default EsponFuoreChart;


import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";
import Icon from "../../../../../../components/common/atoms/Icon";
import chroma from "chroma-js";

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

		this.onSelectionClear = this.onSelectionClear.bind(this);
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

	onSelectionClear() {
		if (this.props.onSelectionClear) {
			this.props.onSelectionClear();
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

		let subtitle = [];
		if (props.name && attr && attr.nameDisplay) {
			subtitle.push(attr.nameDisplay);
		}
		if (attr && attr.description) {
			subtitle.push(attr.description);
		}

		if (props.periods) {
			let names = props.periods.map(period => period.data && period.data.nameDisplay);
			if (names.length > 1) {
				let sortedNames = _.sortBy(names);
				subtitle.push(`from ${sortedNames[0]} to ${sortedNames[sortedNames.length - 1]}`);
			} else {
				subtitle.push(`in ${names[0]}`);
			}
		}

		/* Filter */
		if (data && data.length && filter && filter.filteredKeys) {
			data = _.filter(data, (item) => {
				return _.indexOf(filter.filteredKeys, item.key) !== -1;
			});
		}

		/* Merge with names */
		if (data && data.length && props.nameData && props.nameData.length) {
			let names = props.nameData;
			let mergedData = {};

			_.forEach(data, (record) => {
				mergedData[record.key] = {...record};
			});

			_.forEach(names, (nameRecord) => {
				let existingRecord = mergedData[nameRecord.key];
				if (existingRecord) {
					existingRecord.data.name = nameRecord.data.name;
				}
			});

			data = _.values(mergedData);
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

		return (
			<ChartWrapper
				key={this.props.chartKey + "-wrapper"}
				title={title}
				subtitle={subtitle.length ? subtitle.join(", ") : null}
				statusBar={filter && filter.name ? (this.renderLabel(filter.name)) : null}
				loading={loading}
			>
				{singleValue ? this.renderColumnChart(data) : this.renderLineChart(data, availablePeriods)}
			</ChartWrapper>
		);
	}

	renderColumnChart(data) {
		return (
			<ColumnChart
				key={this.props.chartKey}
				keySourcePath="key"
				nameSourcePath="data.name"
				xSourcePath="data.name"
				ySourcePath="data.values[0].value"
				sorting={[["data.values[0].value", "desc"]]}
				// xGridlines
				yGridlines
				yValues
				xValues
				xValuesSize={5}
				yValuesSize={4}
				minAspectRatio={1.5}
				withoutYbaseline
				data={data}
				defaultColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color}
				highlightColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color && chroma(this.props.attribute.data.color).darken(1)}
			/>
		);
	}

	renderLineChart(data, availablePeriods) {
		let enoughPeriods = availablePeriods && availablePeriods.length > 1;

		return (
			enoughPeriods ? (<LineChart
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
				yValuesSize={4.5}
				withPoints
				data={data}
				defaultColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color}
				highlightColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color && chroma(this.props.attribute.data.color).darken(1)}
			/>) : (
				<div className="ptr-chart-wrapper-info">Selected indicator doesn't contain enough data for this type of chart.</div>
			)
		);
	}

	// TODO create component
	// TODO make clearable
	// TODO multiple labels
	renderLabel(content) {
		return (
			<div className="ptr-colored-label">
				<div className="ptr-colored-label-content">
					<Icon icon="filter"/>
					<div>{content}</div>
				</div>
				<div className="ptr-colored-label-clear" onClick={this.onSelectionClear}>
					<Icon icon="times"/>
				</div>
			</div>
		);
	}
}

export default EsponFuoreChart;


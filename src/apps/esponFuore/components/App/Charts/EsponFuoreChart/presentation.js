import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";

class EsponFuoreChart extends React.PureComponent {
	static propTypes = {
		attribute: PropTypes.object,
		filter: PropTypes.array,
		loading: PropTypes.bool,
		data: PropTypes.array,
		periods: PropTypes.array,
		name: PropTypes.string
	};

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

	render() {
		const props = this.props;

		let data = props.data;
		let singleValue = data && data[0] && data[0].data && data[0].data.values && data[0].data.values.length === 1;
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
		if (data && props.filter) {
			data = _.filter(data, (item) => {
				return _.indexOf(props.filter, item.key) !== -1;
			});
		}

		return (
			<ChartWrapper
				title={title}
				subtitle={subtitle.length ? subtitle.join(", ") : null}
			>
				{singleValue ? this.renderColumnChart(data) : this.renderLineChart(data)}
			</ChartWrapper>
		);
	}

	renderColumnChart(data) {
		return (
			<ColumnChart
				key="fuoreTestChart"
				keySourcePath="key"
				xSourcePath="data.name"
				ySourcePath="data.values[0].value"
				sorting={[["data.values[0].value", "desc"]]}
				xGridlines
				yGridlines
				yCaptions
				xCaptions
				xCaptionsSize={50}
				withoutYbaseline
				data={data}
				defaultColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color}
			/>
		);
	}

	renderLineChart(data) {
		return (
			<LineChart
				key="fuoreTestAllPeriods"
				keySourcePath="key"
				serieKeySourcePath="key"
				serieNameSourcePath="data.name"
				serieDataSourcePath="data.values"
				xSourcePath="key" // in context of serie
				ySourcePath="value" // in context of serie

				xTicks
				xGridlines
				xCaptions
				yTicks
				yGridlines
				yCaptions
				withoutYbaseline

				sorting={[["key", "asc"]]}

				xCaptionsSize={40}
				withPoints
				data={data}
				loading={this.props.loading}
				defaultColor={this.props.attribute && this.props.attribute.data && this.props.attribute.data.color}
			/>
		);
	}
}

export default EsponFuoreChart;


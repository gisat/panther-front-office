import React from 'react';
import PropTypes from 'prop-types';
import ChartWrapper from "../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";

class EsponFuoreChart extends React.PureComponent {
	static propTypes = {
		loading: PropTypes.bool,
		data: PropTypes.array
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
		const data = this.props.data;
		let singleValue = data && data[0] && data[0].data && data[0].data.values && data[0].data.values.length === 1;
		let title = this.props.attribute && this.props.attribute.data && this.props.attribute.data.nameDisplay;

		return (
			<ChartWrapper
				title={title}
			>
				{singleValue ? this.renderColumnChart() : this.renderLineChart()}
			</ChartWrapper>
		);
	}

	renderColumnChart() {
		return (
			<ColumnChart
				key="fuoreTestChart"
				keySourcePath="key"
				xSourcePath="data.name"
				ySourcePath="data.values[0].value"
				sorting={[["data.values[0].value", "desc"]]}
				xGridlines
				yGridlines
				xTicks
				yCaptions
				withoutYbaseline
				data={this.props.data}
			/>
		);
	}

	renderLineChart() {
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
				data={this.props.data}
				loading={this.props.loading}
			/>
		);
	}
}

export default EsponFuoreChart;


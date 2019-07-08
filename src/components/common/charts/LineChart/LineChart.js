import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';
import utils from "../../../../utils/sort";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import Line from "./Line";
import utilsFilter from "../../../../utils/filter";
import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";
import ChartLegend from "../ChartLegend/ChartLegend";

class LineChart extends React.PureComponent {
	static defaultProps = {
		grayingThreshold: 10,
		aggregationThreshold: 50,
		withPoints: true,

		xGridlines: true,
		withoutYbaseline: true
	};

	static propTypes = {
		forceMode: PropTypes.string,
		aggregationThreshold: PropTypes.number,
		grayingThreshold: PropTypes.number,
		withPoints: PropTypes.bool,
	};

	constructor(props) {
		super(props);
	}

	// TODO axis orientation
	render() {
		const props = this.props;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, colors, sortedUniqueXvalues, mode = null;
		let data = {...props.data};

		if (data) {
			data = utilsFilter.filterDataWithNullValue(data, props.ySourcePath, props.serieDataSourcePath);

			/* domain */
			let yValues = _.map(data, item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.map(serie, record => {
					return _.get(record, props.ySourcePath);
				});
			});

			let xValues = _.map(props.data, item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.map(serie, record => {
					return _.get(record, props.xSourcePath);
				});
			});

			let uniqueXvalues = _.uniqBy(_.flatten(xValues));
			sortedUniqueXvalues = _.sortBy(uniqueXvalues);
			let yValuesPrepared = _.flatten(yValues);

			let yMaximum = _.max(yValuesPrepared);
			let yMinimum = _.min(yValuesPrepared);

			if (props.yOptions && props.yOptions.min) {
				yMinimum = props.yOptions.min;
			}

			if (props.yOptions && props.yOptions.max) {
				yMaximum = props.yOptions.max;
			}

			xDomain = sortedUniqueXvalues;
			yDomain = [yMinimum, yMaximum];

			/* scales */
			xScale = d3
				.scaleBand()
				.padding(0)
				.domain(xDomain)
				.range([0, props.innerPlotWidth]);

			// adjust range
			let extension = xScale.bandwidth()/2;
			xScale.range([0-extension, props.innerPlotWidth + extension]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([props.innerPlotHeight, 0]);

			colors = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(props.data.map(record => {return _.get(record, props.keySourcePath)}));

			if (props.forceMode){
				mode = props.forceMode;
			} else if (data.length > props.aggregationThreshold) {
				mode = 'aggregated';
			} else if (data.length > props.grayingThreshold) {
				mode = 'gray';
			}
		}


		return (
			<>
				<svg className="ptr-chart ptr-line-chart" width={props.width} height={props.height}>
					{(data) ?
						<CartesianChartContent
							{...props}
							{...{xScale, yScale, contentData: sortedUniqueXvalues}}
						>
							{mode === 'aggregated' ?
								this.renderAggregated(data, props, xScale, yScale) :
								this.renderLines(data, props, xScale, yScale, colors, mode)
							}
						</CartesianChartContent>
					: null}
				</svg>
				{this.props.legend ? (
					<ChartLegend
						data={data}
						keySourcePath={this.props.keySourcePath}
						nameSourcePath={this.props.nameSourcePath}
						colorSourcePath={this.props.colorSourcePath}
						colorScale={colors}
					/>
				) : null}
			</>
		);
	}

	renderLines(data, props, xScale, yScale, colors, mode) {
		let leftOffset = xScale.bandwidth()/2;
		let siblings = data.map((item) => _.get(item, props.keySourcePath));

		return _.map(data, (item) => {
			let serie = _.get(item, props.serieDataSourcePath);
			let key = _.get(item, props.keySourcePath);
			let name = _.get(item, props.nameSourcePath);
			let color = colors(_.get(item, props.keySourcePath));

			serie = this.props.sorting ? utils.sortByOrder(serie, props.sorting) : serie;

			let coordinates = serie.map(record => {
				let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
				let y = yScale(_.get(record, props.ySourcePath));
				return {x,y, originalData: record};
			});

			if (props.colorSourcePath) {
				color = _.get(item, props.colorSourcePath);
			}

			return (
				<Line
					key={`${key}_${JSON.stringify(coordinates)}`}
					itemKey={key}
					name={name}
					coordinates={coordinates}
					defaultColor={color}
					highlightedColor={color}
					withPoints={this.props.withPoints}
					siblings={siblings}
					gray={mode === 'gray'}
					pointNameSourcePath={props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
				/>
			);
		});
	}

	renderAggregated(data, props, xScale, yScale, colors) {
		let leftOffset = xScale.bandwidth()/2;

		let maxValues = {};
		let minValues = {};
		let values = {};

		_.map(data,(record) => {
			let serie = _.get(record, props.serieDataSourcePath);
			_.map(serie,(item) => {
				let key = _.get(item, props.xSourcePath);
				let value = _.get(item, props.ySourcePath);

				if ((!maxValues[key] && maxValues[key] !== 0) || maxValues[key] < value) {
					maxValues[key] = value;
				}

				if ((!minValues[key] && minValues[key] !== 0) || minValues[key] > value) {
					minValues[key] = value;
				}

				if (!values[key]) {
					values[key] = [value];
				} else {
					values[key].push(value);
				}
			});
		});

		// prepare max data for chart
		let maxValuesForChart = [];
		_.forIn(maxValues, (value, key) => {
			maxValuesForChart.push({
				[props.xSourcePath]: key,
				[props.ySourcePath]: value
			});
		});

		let maxCoordinates = maxValuesForChart.map(record => {
			let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
			let y = yScale(_.get(record, props.ySourcePath));
			return {x,y, originalData: record};
		});

		// prepare min data for chart
		let minValuesForChart = [];
		_.forIn(minValues, (value, key) => {
			minValuesForChart.push({
				[props.xSourcePath]: key,
				[props.ySourcePath]: value
			});
		});

		let minCoordinates = minValuesForChart.map(record => {
			let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
			let y = yScale(_.get(record, props.ySourcePath));
			return {x,y, originalData: record};
		});

		// prepare average data for chart
		let averageValuesForChart = [];
		_.forIn(values, (values, key) => {
			averageValuesForChart.push({
				[props.xSourcePath]: key,
				[props.ySourcePath]: (_.sum(values)/values.length).toFixed(2)
			});
		});

		let averageCoordinates = averageValuesForChart.map(record => {
			let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
			let y = yScale(_.get(record, props.ySourcePath));
			return {x,y, originalData: record};
		});

		let reverseMinCoordinates = _.reverse([...minCoordinates]);

		return (
			<>
				<path
					className="ptr-line-chart-area"
					d={`M${maxCoordinates.map(point => {
						return `${point.x} ${point.y}`;
					}).join(" L")} L${reverseMinCoordinates.map(point => {
						return `${point.x} ${point.y}`;
					}).join(" L")}`}
				/>
				<Line
					key={'minimum'}
					itemKey={'minimum'}
					name={'Minimum'}
					coordinates={minCoordinates}
					defaultColor={"#777777"}
					highlightedColor={"#555555"}
					withPoints={this.props.withPoints}
					pointNameSourcePath={props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
					gray
				/>
				<Line
					key={`average_${JSON.stringify(averageCoordinates)}`}
					itemKey={'average'}
					name={'Average'}
					coordinates={averageCoordinates}
					withPoints={this.props.withPoints}
					defaultColor={this.props.defaultColor ? this.props.defaultColor : "#0088ff"}
					highlightedColor={this.props.highlightedColor ? this.props.highlightedColor : "#0077ff"}
					pointNameSourcePath={props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
				/>
				<Line
					key={'maximum'}
					itemKey={'maximum'}
					name={'Maximum'}
					coordinates={maxCoordinates}
					defaultColor={"#777777"}
					highlightedColor={"#555555"}
					withPoints={this.props.withPoints}
					pointNameSourcePath={props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
					gray
				/>
			</>
		);
	}
}

export default cartesianChart(LineChart);


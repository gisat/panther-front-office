import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import moment from 'moment';

import '../style.scss';
import utils from "../../../../utils/sort";

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
		xScaleType: 'ordinal',
		withoutYbaseline: true
	};

	static propTypes = {
		forceMode: PropTypes.string,
		aggregationThreshold: PropTypes.number,
		grayingThreshold: PropTypes.number,
		withPoints: PropTypes.bool,

		serieDataSourcePath: PropTypes.string.isRequired,
		pointNameSourcePath: PropTypes.string //in context of serie (for custom point name in popup) // TODO coplex solution for chart popups
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

			if (props.yOptions && (props.yOptions.min || props.yOptions.min === 0)) {
				yMinimum = props.yOptions.min;
			}

			if (props.yOptions && (props.yOptions.max || props.yOptions.max === 0)) {
				yMaximum = props.yOptions.max;
			}

			let xMaximum = _.max(sortedUniqueXvalues);
			let xMinimum = _.min(sortedUniqueXvalues);

			if (props.xOptions && (props.xOptions.min || props.xOptions.min === 0)) {
				xMinimum = props.xOptions.min;
			}

			if (props.xOptions && (props.xOptions.max || props.xOptions.max === 0)) {
				xMaximum = props.xOptions.max;
			}

			yDomain = [yMinimum, yMaximum];

			/* scales */
			if (props.xScaleType === 'time') {
				if (props.xOptions && props.xOptions.inputValueFormat) {
					xMinimum = moment(`${xMinimum}`, props.xOptions.inputValueFormat).toDate();
					xMaximum = moment(`${xMaximum}`, props.xOptions.inputValueFormat).toDate();
				} else {
					xMinimum = new Date(xMinimum);
					xMaximum = new Date(xMaximum);
				}

				xDomain = [xMinimum, xMaximum];
				xScale = d3
					.scaleTime()
					.domain(xDomain)
					.range([0, props.innerPlotWidth]);
			} else {
				xDomain = sortedUniqueXvalues;
				xScale = d3
					.scaleBand()
					.padding(0)
					.domain(xDomain)
					.range([0, props.innerPlotWidth]);

				// adjust range
				let extension = xScale.bandwidth()/2;
				xScale.range([0-extension, props.innerPlotWidth + extension]);
			}

			yScale = d3.scaleLinear();

			if (this.props.yScaleType === 'logarithmic') {
				yScale = d3.scaleLog();
			}

			yScale.domain(yDomain).range([props.innerPlotHeight, 0]);

			colors = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(props.data.map(record => {return _.get(record, props.keySourcePath)}));

			if (props.forceMode){
				mode = props.forceMode;
			} else if (data.length > props.aggregationThreshold && props.xScaleType !== 'time') {
				mode = 'aggregated';
			} else if (data.length > props.grayingThreshold) {
				mode = 'gray';
			}
		}


		return (
			<>
				<svg className="ptr-chart ptr-cartesian-chart ptr-line-chart" height={props.height}>
					{(data) ?
						<CartesianChartContent
							{...props}
							{...{xScale, yScale, contentData: props.xScaleType === "time" ? sortedUniqueXvalues : xDomain}}
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
						showSelectedOnly={mode === 'gray'}
					/>
				) : null}
			</>
		);
	}

	renderLines(data, props, xScale, yScale, colors, mode) {
		let leftOffset = props.xScaleType !== 'time' ? xScale.bandwidth()/2 : 0;
		let siblings = data.map((item) => _.get(item, props.keySourcePath));

		return _.map(data, (item) => {
			let serie = _.get(item, props.serieDataSourcePath);
			let key = _.get(item, props.keySourcePath);
			let name = _.get(item, props.nameSourcePath);
			let color = colors(_.get(item, props.keySourcePath));

			serie = this.props.sorting ? utils.sortByOrder(serie, props.sorting) : serie;

			let coordinates = serie.map(record => {
				let xValue = _.get(record, props.xSourcePath);
				let x;
				if (this.props.xScaleType === "time") {
					if (props.xOptions && props.xOptions.inputValueFormat) {
						x = xScale(moment(`${xValue}`, props.xOptions.inputValueFormat).toDate());
					} else {
						x = xScale(new Date(xValue));
					}
				} else {
					x = xScale(xValue) + leftOffset;
				}

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
					highlightColor={color}
					withPoints={this.props.withPoints}
					siblings={siblings}
					gray={mode === 'gray'}
					pointNameSourcePath={props.pointNameSourcePath || props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
					xOptions={props.xOptions}
					xScaleType={props.xScaleType}
				/>
			);
		});
	}

	renderAggregated(data, props, xScale, yScale, colors) {
		let leftOffset = props.xScaleType !== 'time' ? xScale.bandwidth()/2 : 0;

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
				[props.ySourcePath]: _.sum(values)/values.length
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
					highlightColor={"#555555"}
					withPoints={this.props.withPoints}
					pointNameSourcePath={props.pointNameSourcePath || props.xSourcePath}
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
					highlightColor={this.props.highlightColor ? this.props.highlightColor : "#0077ff"}
					pointNameSourcePath={props.pointNameSourcePath || props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
				/>
				<Line
					key={'maximum'}
					itemKey={'maximum'}
					name={'Maximum'}
					coordinates={maxCoordinates}
					defaultColor={"#777777"}
					highlightColor={"#555555"}
					withPoints={this.props.withPoints}
					pointNameSourcePath={props.pointNameSourcePath || props.xSourcePath}
					pointValueSourcePath={props.ySourcePath}
					yOptions={props.yOptions}
					gray
				/>
			</>
		);
	}
}

export default cartesianChart(LineChart);


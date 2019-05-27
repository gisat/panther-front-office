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

const WIDTH = 500;
const HEIGHT = 250;

const MIN_WIDTH = 200;
const MAX_WIDTH = 1000;

const Y_CAPTIONS_SIZE = 70;
const X_CAPTIONS_SIZE = 70;

// TODO optional
const INNER_PADDING_LEFT = 10;
const INNER_PADDING_RIGHT = 10;
const INNER_PADDING_TOP = 10;

// If series count is greater than threshold, lines will be gray
const GRAYING_THRESHOLD = 10;

// If series count is greater than threshold, lines will be aggregated to maximum, minimum and average
const AGGREGATION_THRESHOLD = 50;

class LineChart extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		forceMode: PropTypes.string,
		loading: PropTypes.bool,

		serieKeySourcePath: PropTypes.string,
		serieNameSourcePath: PropTypes.string,
		serieDataSourcePath: PropTypes.string,
		xSourcePath: PropTypes.string, // in context of serie
		ySourcePath: PropTypes.string, // in context of serie

		height: PropTypes.number,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,

		minAspectRatio: PropTypes.number,

		xCaptionsSize: PropTypes.number, // space for captions along axis X
		yCaptionsSize: PropTypes.number, // space for captions along axis Y

		xCaptions: PropTypes.bool,
		yCaptions: PropTypes.bool,

		withPoints: PropTypes.bool,

		sorting: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	// TODO axis orientation
	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width ? props.width : WIDTH;
		let height = props.height ? props.height : HEIGHT;

		let minWidth = props.minWidth ? props.minWidth : MIN_WIDTH;
		let maxWidth = props.maxWidth ? props.maxWidth: MAX_WIDTH;

		let xCaptionsSize = props.xCaptionsSize ? props.xCaptionsSize : X_CAPTIONS_SIZE;
		let yCaptionsSize = props.yCaptionsSize ? props.yCaptionsSize : Y_CAPTIONS_SIZE;

		if (!props.xCaptions && !props.xCaptionsSize) {
			xCaptionsSize = props.yCaptions ? 10 : 0; // space for labels
		}

		if (!props.yCaptions && !props.yCaptionsSize) {
			yCaptionsSize = props.xCaptions ? 30 : 0; // space for labels
		}

		if (width > maxWidth) width = maxWidth;
		if (width < minWidth) width = minWidth;

		if (props.minAspectRatio && width/height < props.minAspectRatio) {
			height = width/props.minAspectRatio;
		}

		let plotWidth = width - (yCaptionsSize);
		let plotHeight = height - (xCaptionsSize);
		let innerPlotWidth = plotWidth - (INNER_PADDING_LEFT + INNER_PADDING_RIGHT);
		let innerPlotHeight = plotHeight - INNER_PADDING_TOP;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, colors, sortedUniqueXvalues, mode = null;
		let data = {...props.data};

		if (data && !this.props.loading) {
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

			xDomain = sortedUniqueXvalues;
			yDomain = [yMinimum, yMaximum];

			/* scales */
			xScale = d3
				.scaleBand()
				.padding(0)
				.domain(xDomain)
				.range([0, innerPlotWidth]);

			// adjust range
			let extension = xScale.bandwidth()/2;
			xScale.range([0-extension, innerPlotWidth + extension]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([innerPlotHeight, 0]);

			colors = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(data.map(record => {return _.get(record, props.serieKeySourcePath)}));

			if (props.forceMode){
				mode = props.forceMode;
			} else if (data.length > AGGREGATION_THRESHOLD) {
				mode = 'aggregated';
			} else if (data.length > GRAYING_THRESHOLD) {
				mode = 'gray';
			}
		}


		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-line-chart" width={width} height={height}>
					{(data && !this.props.loading) ? <>
						<AxisY
							scale={yScale}

							bottomMargin={xCaptionsSize}
							topPadding={INNER_PADDING_TOP}
							height={plotHeight}
							plotWidth={plotWidth}
							width={yCaptionsSize}
							ticks={props.yTicks}
							gridlines={props.yGridlines}
							withCaption={props.yCaptions}
							hiddenBaseline={props.withoutYbaseline}
						/>
						<AxisX
							data={sortedUniqueXvalues}
							scale={xScale}
							domain={xDomain}

							leftMargin={yCaptionsSize} //TODO right margin for right oriented
							leftPadding={INNER_PADDING_LEFT}
							height={xCaptionsSize}
							plotHeight={plotHeight}
							width={plotWidth}

							ticks={props.xTicks}
							gridlines={props.xGridlines}
							withCaption={props.xCaptions}
						/>
						<g transform={`translate(${yCaptionsSize + INNER_PADDING_LEFT},${INNER_PADDING_TOP})`}>
							{mode === 'aggregated' ?
								this.renderAggregated(data, props, xScale, yScale) :
								this.renderLines(data, props, xScale, yScale, colors, mode)
							}
						</g>
					</> : null}
				</svg>
			</div>
		);
	}

	renderLines(data, props, xScale, yScale, colors, mode) {
		let leftOffset = xScale.bandwidth()/2;
		let siblings = data.map((item) => _.get(item, props.serieKeySourcePath));

		return data.map((item, index) => {
			let serie = _.get(item, props.serieDataSourcePath);
			let key = _.get(item, props.serieKeySourcePath);
			let name = _.get(item, props.serieNameSourcePath);
			let color = colors(_.get(item, props.serieKeySourcePath));

			serie = this.props.sorting ? utils.sortByOrder(serie, props.sorting) : serie;

			let coordinates = serie.map(record => {
				let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
				let y = yScale(_.get(record, props.ySourcePath));
				return {x,y, originalData: record};
			});

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
				/>
			);
		});
	}

	renderAggregated(data, props, xScale, yScale, colors) {
		let leftOffset = xScale.bandwidth()/2;

		let maxValues = {};
		let minValues = {};
		let values = {};

		data.forEach((record) => {
			let serie = _.get(record, props.serieDataSourcePath);
			serie.forEach((item) => {
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
					gray
				/>
			</>
		);
	}
}

export default LineChart;


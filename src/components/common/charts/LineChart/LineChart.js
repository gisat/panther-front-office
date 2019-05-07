import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';
import utils from "../../../../utils/sort";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import Popup from "../Popup";
import Line from "./Line";

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

		xCaptionsSize: PropTypes.number, // space for captions along axis X
		yCaptionsSize: PropTypes.number, // space for captions along axis Y

		xCaptions: PropTypes.bool,
		yCaptions: PropTypes.bool,

		withPoints: PropTypes.bool,

		sorting: PropTypes.array
	};

	constructor(props) {
		super(props);
		this.state = {popup: null};

		this.onLineOut = this.onLineOut.bind(this);
		this.onLineOver = this.onLineOver.bind(this);
	}

	onLineOver(itemKey, name, x, y, data) {
		let state = this.state.popup;

		if (!state || !_.isEqual(state.itemKey, itemKey)  || state.x !== x || state.y !== y) {
			this.setState({
				popup: {itemKey, name, x, y, data},
				hoveredItemKey: itemKey
			});
		}
	}

	onLineOut() {
		this.setState({popup: null, hoveredItemKey: null});
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

		let plotWidth = width - (yCaptionsSize);
		let plotHeight = height - (xCaptionsSize);
		let innerPlotWidth = plotWidth - (INNER_PADDING_LEFT + INNER_PADDING_RIGHT);
		let innerPlotHeight = plotHeight - INNER_PADDING_TOP;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, colors, firstSerieData, mode = null;
		let data = props.data;

		if (data && !this.props.loading) {
			/* domain */
			let yMaximum = _.max(data.map(item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.max(serie.map(record => {
					return _.get(record, props.ySourcePath);
				}));
			}));

			let yMinimum = _.min(data.map(item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.min(serie.map(record => {
					return _.get(record, props.ySourcePath);
				}));
			}));

			/* domain and scales */
			firstSerieData = _.get(data[0], props.serieDataSourcePath); // TODO have all series same range?
			firstSerieData = _.sortBy(firstSerieData, [props.xSourcePath]);

			xDomain = firstSerieData.map(record => {return _.get(record, props.xSourcePath)});
			yDomain = [yMinimum, yMaximum];

			xScale = d3
				.scaleBand()
				.domain(xDomain)
				.range([0, innerPlotWidth]);

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
							data={firstSerieData}
							scale={xScale}
							domain={xDomain}
							sourcePath={props.xSourcePath}
							keySourcePath={props.xSourcePath}

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
				{this.state.popup ? this.renderPopup(width) : null}
			</div>
		);
	}

	renderLines(data, props, xScale, yScale, colors, mode) {
		let leftOffset = xScale.bandwidth()/2;

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
					key={key}
					itemKey={key}
					name={name}
					coordinates={coordinates}
					color={color}
					onMouseOut={this.onLineOut}
					onMouseOver={this.onLineOver}
					onMouseMove={this.onLineOver}
					withPoints={this.props.withPoints}
					suppressed={this.state.hoveredItemKey && this.state.hoveredItemKey !== key}
					gray={mode === 'gray'}
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

				if (!maxValues[key] || maxValues[key] < value) {
					maxValues[key] = value;
				}

				if (!minValues[key] || minValues[key] > value) {
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
					color={"#777777"}
					onMouseOut={this.onLineOut}
					onMouseOver={this.onLineOver}
					onMouseMove={this.onLineOver}
					withPoints={this.props.withPoints}
					gray
				/>
				<Line
					key={'average'}
					itemKey={'average'}
					name={'Average'}
					coordinates={averageCoordinates}
					onMouseOut={this.onLineOut}
					onMouseOver={this.onLineOver}
					onMouseMove={this.onLineOver}
					withPoints={this.props.withPoints}
					color={"#ff0000"}
				/>
				<Line
					key={'maximum'}
					itemKey={'maximum'}
					name={'Maximum'}
					coordinates={maxCoordinates}
					color={"#777777"}
					onMouseOut={this.onLineOut}
					onMouseOver={this.onLineOver}
					onMouseMove={this.onLineOver}
					withPoints={this.props.withPoints}
					gray
				/>
			</>
		);
	}

	renderPopup(maxX) {
		const state = this.state.popup;
		let content = null;

		if (state.itemKey) {
			content = (
				<>
					<div>{state.name}</div>
					{state.data ? (
						<div>{`${_.get(state.data, this.props.xSourcePath)}: ${_.get(state.data, this.props.ySourcePath)}`}</div>
					) : null}
				</>
			);
		}

		return (
			<Popup
				x={state.x}
				y={state.y}
				maxX={maxX}
			>
				{content}
			</Popup>
		);
	}
}

export default LineChart;


import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';
import utils from "../../../../utils/sort";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import Bar from "./Bar";
import Popup from "../Popup";
import ChartWrapper from "../ChartWrapper/ChartWrapper";

const MIN_BAR_WIDTH = 4;
const BAR_GAP_RATIO = 0.4;

const WIDTH = 500;
const HEIGHT = 250;

const MIN_WIDTH = 300;
const MAX_WIDTH = 700;

// TODO optional
const MARGIN_LEFT = 80;
const MARGIN_RIGHT = 35;
const MARGIN_BOTTOM = 25; // TODO xAxis caption
const MARGIN_TOP = 15;
const PADDING_LEFT = 10;
const PADDING_RIGHT = 10;

class ColumnChart extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		height: PropTypes.number,
		keySourcePath: PropTypes.string,
		sorting: PropTypes.array,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,
		xSourcePath: PropTypes.string,
		ySourcePath: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = {popup: null};

		this.onBarOut = this.onBarOut.bind(this);
		this.onBarOver = this.onBarOver.bind(this);
	}

	onBarOver(itemKeys, x, y) {
		let state = this.state.popup;

		if (!state || !_.isEqual(state.itemKeys, itemKeys)  || state.x !== x || state.y !== y) {
			this.setState({
				popup: {itemKeys, x, y}
			});
		}
	}

	onBarOut() {
		this.setState({popup: null});
	}

	// TODO axis orientation
	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width ? props.width : WIDTH;
		let height = props.height ? props.height : HEIGHT;

		let minWidth = props.minWidth ? props.minWidth : MIN_WIDTH;
		let maxWidth = props.maxWidth ? props.maxWidth: MAX_WIDTH;

		if (width > maxWidth) width = maxWidth;
		if (width < minWidth) width = minWidth;

		let plotWidth = width - (MARGIN_LEFT + MARGIN_RIGHT);
		let plotHeight = height - (MARGIN_TOP + MARGIN_BOTTOM);
		let innerPlotWidth = plotWidth - (PADDING_LEFT + PADDING_RIGHT);
		let innerPlotHeight = plotHeight;

		/* data preparation */
		let data = props.sorting ? utils.sortByOrder(props.data, props.sorting) : props.data;

		let maximum = _.get(_.maxBy(data, (item) => {return _.get(item, props.ySourcePath)}), props.ySourcePath);
		let minimum = _.get(_.minBy(data, (item) => {return _.get(item, props.ySourcePath)}), props.ySourcePath);
		if (minimum > 0) minimum = 0; // TODO custom option - forceMinimum?

		/* domain and scales */
		let xDomain = data.map(i  => _.get(i, props.keySourcePath));
		let yDomain = [minimum, maximum];

		let xScale = d3
			.scaleBand()
			.padding(BAR_GAP_RATIO)
			.domain(xDomain)
			.range([0, innerPlotWidth]);

		let yScale = d3
			.scaleLinear()
			.domain(yDomain)
			.range([innerPlotHeight, 0]);

		let barWidth = xScale.bandwidth();
		/* gap ratio between bars */
		if (barWidth < 10) {
			xScale = xScale.padding(0.1);
		}

		/* aggregation, if needed */
		let aggregatedData = [];
		if (barWidth < MIN_BAR_WIDTH) {
			let itemsInGroup = Math.ceil(MIN_BAR_WIDTH/barWidth);
			let keys = [];
			let originalData = [];
			data.forEach((item, index) => {
				keys.push(_.get(item, props.keySourcePath));
				originalData.push(item);
				if (index % itemsInGroup === (itemsInGroup - 1) || index === (data.length - 1)) {
					aggregatedData.push({keys, originalData});
					keys = [];
					originalData = [];
				}
			});

			// adjust domain
			xDomain = aggregatedData.map(i  => i.keys);
			xScale = xScale.domain(xDomain).padding(0);
		}

		return (
			<>
				<svg className="ptr-chart ptr-column-chart" width={width} height={height} onMouseMove={this.onMouseOver}>
					<AxisY
						data={data}
						scale={yScale}
						sourcePath={props.ySourcePath}

						bottomMargin={MARGIN_BOTTOM}
						topMargin={MARGIN_TOP}
						height={plotHeight}
						plotWidth={plotWidth}
						width={MARGIN_LEFT}

						ticks
						gridlines
						// hiddenBaseline
					/>
					<AxisX
						data={data}
						scale={xScale}
						domain={xDomain}
						sourcePath={props.xSourcePath}
						keySourcePath={props.keySourcePath}

						leftMargin={MARGIN_LEFT} //TODO right margin for right oriented
						topMargin={MARGIN_TOP}
						leftPadding={PADDING_LEFT}
						height={MARGIN_BOTTOM}
						plotHeight={plotHeight}
						width={plotWidth}

						// ticks
						gridlines
					/>
					<g transform={`translate(${MARGIN_LEFT + PADDING_LEFT},${MARGIN_TOP})`}>
						{aggregatedData.length ? this.renderAggregated(aggregatedData, props, xScale, yScale, innerPlotHeight, innerPlotWidth) : this.renderBars(data, props, xScale, yScale, innerPlotHeight)}
					</g>
				</svg>
				{this.state.popup ? this.renderPopup(width) : null}
			</>
		);
	}

	renderAggregated(data, props, xScale, yScale, availableHeight, availableWidth) {
		return (
			<>
				{this.renderPath(data, props, xScale, yScale, availableHeight, availableWidth)}
				{this.renderBarsFromAggregated(data, props, xScale, yScale, availableHeight)}
			</>
		)
	}

	renderBars(data, props, xScale, yScale, availableHeight) {
		return data.map((item) => {
			return (
				<Bar
					itemKeys={[_.get(item, props.keySourcePath)]}
					key={_.get(item, props.keySourcePath)}
					onMouseOut={this.onBarOut}
					onMouseOver={this.onBarOver}
					onMouseMove={this.onBarOver}

					y={yScale(_.get(item, props.ySourcePath))}
					x={xScale(_.get(item, props.keySourcePath))}
					width={xScale.bandwidth()}
					height={availableHeight - yScale(_.get(item, props.ySourcePath))}
				/>
			);
		});
	}

	renderBarsFromAggregated(aggregatedData, props, xScale, yScale, availableHeight) {
		return aggregatedData.map((group) => {
			let firstItemFromGroup = group.originalData[0];

			return (
				<Bar
					hidden
					itemKeys={group.keys}
					key={_.get(firstItemFromGroup, props.keySourcePath)}
					onMouseOut={this.onBarOut}
					onMouseOver={this.onBarOver}
					onMouseMove={this.onBarOver}

					y={yScale(_.get(firstItemFromGroup, props.ySourcePath))}
					x={xScale(group.keys)}
					width={xScale.bandwidth()}
					height={availableHeight - yScale(_.get(firstItemFromGroup, props.ySourcePath))}
				/>
			);
		});
	}

	renderPath(aggregatedData, props, xScale, yScale, availableHeight, availableWidth) {
		return (
			<path className="ptr-column-chart-path"
				d={`M0 ${availableHeight} L${aggregatedData.map((group) => {
						let firstValueFromGroup = _.get(group.originalData[0], props.ySourcePath);
						return `${xScale(group.keys)} ${yScale(firstValueFromGroup)}`
					}).join(' L')} L${availableWidth} ${availableHeight}`
				}
			/>
		);
	}

	renderPopup(maxX) {
		const state = this.state.popup;
		let content = null;

		if (state.itemKeys.length === 1) {
			let data = _.find(this.props.data, item => {return _.get(item, this.props.keySourcePath) === state.itemKeys[0]});
			content = (
				<>
					<div>{_.get(data, this.props.xSourcePath)}</div>
					<div>{_.get(data, this.props.ySourcePath)}</div>
				</>
			);
		} else {
			let units = [];
			let values = [];
			state.itemKeys.map((key) => {
				let data = _.find(this.props.data, item => {return _.get(item, this.props.keySourcePath) === key});
				units.push(_.get(data, this.props.xSourcePath));
				values.push(_.get(data, this.props.ySourcePath));
			});
			content = (
				<>
					<div>{units.length < 10 ? units.join(", ") : `${units.length} items`}</div>
					<div>{`From ${_.min(values)} to ${_.max(values)}`}</div>
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

export default ColumnChart;


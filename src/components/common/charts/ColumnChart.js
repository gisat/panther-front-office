import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import utils from "../../../utils/sort";

const MIN_BAR_WIDTH = 2;

const LEFT_MARGIN = 100;
const BOTTOM_MARGIN = 50;

const BAR_GAP_RATIO = 0.4;

class ColumnChart extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		height: PropTypes.number,
		keySourceName: PropTypes.string, // TODO path?
		sorting: PropTypes.array,
		width: PropTypes.number,
		xSourceName: PropTypes.string, // TODO path?
		ySourceName: PropTypes.string // TODO path?
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		let availableWidth = props.width - LEFT_MARGIN;
		let availableHeight = props.height - BOTTOM_MARGIN;

		let data = props.sorting ? utils.sortByOrder(props.data, props.sorting) : props.data;

		let maximum = _.maxBy(data, props.ySourceName)[props.ySourceName];
		let minimum = _.minBy(data, props.ySourceName)[props.ySourceName];
		if (minimum > 0) minimum = 0; // TODO

		let xDomain = data.map(i  => i[props.keySourceName]);
		let yDomain = [minimum, maximum];

		let xScale = d3
			.scaleBand()
			.padding(BAR_GAP_RATIO)
			.domain(xDomain)
			.range([0, availableWidth]);

		let yScale = d3
			.scaleLinear()
			.domain(yDomain)
			.range([availableHeight, 0]);

		let barWidth = xScale.bandwidth();

		// todo - decide, when to draw a line instead of columns
		return (
			<svg className="ptr-chart ptr-column-chart" width={props.width} height={props.height}>
				<g transform={`translate(${LEFT_MARGIN},0)`}>
					{barWidth >= MIN_BAR_WIDTH ? this.renderBars(data, props, xScale, yScale, availableHeight) : this.renderPath(data, props, xScale, yScale, availableHeight)}
				</g>
			</svg>
		);
	}

	renderBars(data, props, xScale, yScale, availableHeight) {
		return data.map((item) => {
			return (
				<rect className="ptr-column-chart-bar"
					y={yScale(item[props.ySourceName])}
					x={xScale(item[props.keySourceName])}
					key={item.key}
					width={xScale.bandwidth()}
					height={availableHeight - yScale(item[props.ySourceName])}
				/>
			);
		});
	}

	renderPath(data, props, xScale, yScale, availableHeight) {
		return (
			<path className="ptr-column-chart-path"
				d={`M0 ${availableHeight} L${data.map((item) => {
						return `${xScale(item[props.keySourceName])} ${yScale(item[props.ySourceName])}`
					}).join(' L')}`
				}
			/>
		);
	}
}

export default ColumnChart;


import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';
import utils from "../../../../utils/sort";

import AxisX from './AxisX';
import AxisY from "./AxisY";

const MIN_BAR_WIDTH = 4;
const BAR_GAP_RATIO = 0.4;

const MARGIN_LEFT = 70;
const MARGIN_RIGHT = 10;
const MARGIN_BOTTOM = 50;
const MARGIN_TOP = 10; // TODO apply

const PADDING_LEFT = 10;
const PADDING_RIGHT = 10;

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

	// TODO axis orientation
	render() {
		const props = this.props;

		/* dimensions */
		// TODO custom?
		const plotWidth = props.width - (MARGIN_LEFT + MARGIN_RIGHT);
		const plotHeight = props.height - (MARGIN_TOP + MARGIN_BOTTOM);
		const innerPlotWidth = plotWidth - (PADDING_LEFT + PADDING_RIGHT);
		const innerPlotHeight = plotHeight;

		/* data preparation */
		let data = props.sorting ? utils.sortByOrder(props.data, props.sorting) : props.data;

		let maximum = _.maxBy(data, props.ySourceName)[props.ySourceName];
		let minimum = _.minBy(data, props.ySourceName)[props.ySourceName];
		if (minimum > 0) minimum = 0; // TODO custom option - forceMinimum?

		/* domain and scales */
		let xDomain = data.map(i  => i[props.keySourceName]);
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
		if (barWidth < 10) {
			xScale = xScale.padding(0.1);
		}

		return (
			<svg className="ptr-chart ptr-column-chart" width={props.width} height={props.height}>
				<AxisY
					data={data}
					scale={yScale}
					sourceName={props.ySourceName}

					bottomMargin={MARGIN_BOTTOM}
					height={plotHeight}
					plotWidth={plotWidth}
					width={MARGIN_LEFT}

					// ticks
					gridlines
					hiddenBaseline
				/>
				<AxisX
					data={data}
					scale={xScale}
					sourceName={props.xSourceName}

					leftMargin={MARGIN_LEFT} //TODO right margin for right oriented
					height={MARGIN_BOTTOM}
					plotHeight={plotHeight}
					width={plotWidth}
				/>
				<g transform={`translate(${MARGIN_LEFT + PADDING_LEFT},0)`}>
					{barWidth >= MIN_BAR_WIDTH ? this.renderBars(data, props, xScale, yScale, innerPlotHeight) : this.renderPath(data, props, xScale, yScale, innerPlotHeight)}
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


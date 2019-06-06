import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import AxisX from '../AxisX';
import AxisY from "../AxisY";

import './style.scss';
import Point from "../Point";

const INNER_PADDING_TOP = 10;

class ScatterChart extends React.PureComponent {
	static defaultProps = {
		width: 500,
		height: 300,

		maxWidth: 1000,
		minWidth: 150,

		xCaptionsSize: 50,
		yCaptionsSize: 50,

		pointRadius: 5
	};

	static propTypes = {
		data: PropTypes.array,

		height: PropTypes.number,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,

		xCaptionsSize: PropTypes.number,
		yCaptionsSize: PropTypes.number,

		pointRadius: PropTypes.number
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width;
		let height = props.height;

		let minWidth = props.minWidth;
		let maxWidth = props.maxWidth;

		let xCaptionsSize = props.xCaptionsSize;
		let yCaptionsSize = props.yCaptionsSize;

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
		let innerPlotWidth = plotWidth;
		let innerPlotHeight = plotHeight - INNER_PADDING_TOP;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, colors, sortedUniqueXvalues, mode = null;
		let data = {...props.data};

		if (data) {
			// TODO filter null values

			/* domain */
			let yValues = _.map(data, item => {
				return _.get(item, props.ySourcePath);
			});

			let xValues = _.map(data, item => {
				return _.get(item, props.xSourcePath);
			});

			xDomain = [_.min(xValues), _.max(xValues)];
			yDomain = [_.min(yValues), _.max(yValues)];

			/* scales */
			xScale = d3
				.scaleLinear()
				.domain(xDomain)
				.range([0, innerPlotWidth]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([innerPlotHeight, 0]);
		}

		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-scatter-chart" width={width} height={height}>
					{(data) ? <>
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
							scale={xScale}
							domain={xDomain}

							leftMargin={yCaptionsSize} //TODO right margin for right oriented
							height={xCaptionsSize}
							plotHeight={plotHeight}
							width={plotWidth}

							ticks={props.xTicks}
							gridlines={props.xGridlines}
							withCaption={props.xCaptions}
						/>
						<g transform={`translate(${yCaptionsSize},${INNER_PADDING_TOP})`}>
							{this.renderPoints(data, props, xScale, yScale)}
						</g>
					</> : null}
				</svg>
			</div>
		);
	}

	renderPoints(data, props, xScale, yScale) {
		return _.map(data, (item) => {
			let key = _.get(item, this.props.keySourcePath);
			let xValue = _.get(item, this.props.xSourcePath);
			let yValue = _.get(item, this.props.ySourcePath);
			let color = _.get(item, this.props.colorSourcePath) || '#aaa';

			return (
				<Point
					key={key}
					itemKey={key}
					data={item}
					x={xScale(xValue)}
					y={yScale(yValue)}
					r={this.props.pointRadius}
					color={color}
				/>
			);
		});
	}
}

export default ScatterChart;


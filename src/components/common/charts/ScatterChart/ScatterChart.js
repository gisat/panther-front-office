import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import AxisX from '../AxisX';
import AxisY from "../AxisY";

import './style.scss';
import Point from "../Point";

import utilsFilter from "../../../../utils/filter";

class ScatterChart extends React.PureComponent {
	static defaultProps = {
		width: 500,
		height: 300,

		maxWidth: 1000,
		minWidth: 150,

		xCaptionsSize: 50,
		yCaptionsSize: 50,

		innerPadding: 10,

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

		isSerie: PropTypes.bool,

		nameSourcePath: PropTypes.string,
		colorSourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,
		serieDataSourcePath: PropTypes.string, // only if serie

		xSourcePath: PropTypes.string, // if serie, path in context of serie
		ySourcePath: PropTypes.string, // if serie, path in context of serie
		itemNameSourcePath: PropTypes.string, // only if serie

		xOptions: PropTypes.object,
		xGridlines: PropTypes.bool,
		xCaptions: PropTypes.bool,
		xTicks: PropTypes.bool,

		yOptions: PropTypes.object,
		yGridlines: PropTypes.bool,
		yCaptions: PropTypes.bool,
		yTicks: PropTypes.bool,

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
		let innerPlotWidth = plotWidth - 2*props.innerPadding;
		let innerPlotHeight = plotHeight - props.innerPadding;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, xValues, yValues, colors = null;
		let data = {...props.data};

		if (data) {
			data = utilsFilter.filterDataWithNullValue(data, [props.xSourcePath, props.ySourcePath], props.serieDataSourcePath);

			/* domain */
			if (props.isSerie) {
				yValues = _.map(data, item => {
					let serie = _.get(item, props.serieDataSourcePath);
					return _.map(serie, record => {
						return _.get(record, props.ySourcePath);
					});
				});

				yValues = _.flatten(yValues);

				xValues = _.map(props.data, item => {
					let serie = _.get(item, props.serieDataSourcePath);
					return _.map(serie, record => {
						return _.get(record, props.xSourcePath);
					});
				});

				xValues = _.flatten(xValues);
			} else {
				yValues = _.map(data, item => {
					return _.get(item, props.ySourcePath);
				});

				xValues = _.map(data, item => {
					return _.get(item, props.xSourcePath);
				});
			}

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

			if (props.isSerie) {
				colors = d3
					.scaleOrdinal(d3.schemeCategory10)
					.domain(_.map(data,record => {return _.get(record, props.keySourcePath)}));
			}
		}

		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-scatter-chart" width={width} height={height}>
					{(data) ? <>
						<AxisY
							scale={yScale}

							bottomMargin={xCaptionsSize}
							topPadding={props.innerPadding}
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

							leftMargin={yCaptionsSize} //TODO right margin for right oriented
							leftPadding={props.innerPadding}
							height={xCaptionsSize}
							plotHeight={plotHeight}
							width={plotWidth}

							ticks={props.xTicks}
							gridlines={props.xGridlines}
							withCaption={props.xCaptions}
						/>
						<g transform={`translate(${yCaptionsSize + props.innerPadding},${props.innerPadding})`}>
							{this.renderPoints(data, props, xScale, yScale, colors)}
						</g>
					</> : null}
				</svg>
			</div>
		);
	}

	renderPoints(data, props, xScale, yScale, colors) {
		return _.map(data, (item, index) => {
			let key = _.get(item, this.props.keySourcePath);
			let color = _.get(item, this.props.colorSourcePath);
			let name = _.get(item, this.props.nameSourcePath);

			if (this.props.isSerie) {
				let serie = _.get(item, this.props.serieDataSourcePath);
				if (!color) {
					color = colors(_.get(item, props.keySourcePath));
				}

				return _.map(serie, (serieItem, index) => {
					let xValue = _.get(serieItem, this.props.xSourcePath);
					let yValue = _.get(serieItem, this.props.ySourcePath);
					let itemName = _.get(serieItem, this.props.itemNameSourcePath);
					let finalName = name;
					if (itemName) {
						finalName = `${name} (${itemName})`;
					}

					return this.renderPoint(key, serieItem, xScale(xValue), yScale(yValue), color, finalName, index);
				});

			} else {
				let xValue = _.get(item, this.props.xSourcePath);
				let yValue = _.get(item, this.props.ySourcePath);

				return this.renderPoint(key, item, xScale(xValue), yScale(yValue), color, name, 0);
			}
		});
	}

	renderPoint(key, item, x, y, color, name, index) {
		return (
			<Point
				key={key + '-' + index}
				itemKey={key}
				data={item}
				x={x}
				y={y}
				xSourcePath={this.props.xSourcePath}
				xOptions={this.props.xOptions}
				ySourcePath={this.props.ySourcePath}
				yOptions={this.props.yOptions}
				name={name}
				r={this.props.pointRadius}
				color={color}
				standalone
			/>
		);
	}
}

export default ScatterChart;


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
import cartesianChart from "../cartesianChart";

class ScatterChart extends React.PureComponent {
	static defaultProps = {
		pointRadius: 5
	};

	static propTypes = {
		data: PropTypes.array,

		isSerie: PropTypes.bool,
		pointRadius: PropTypes.number,

		nameSourcePath: PropTypes.string,
		colorSourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,
		serieDataSourcePath: PropTypes.string, // only if serie

		xSourcePath: PropTypes.string, // if serie, path in context of serie
		ySourcePath: PropTypes.string, // if serie, path in context of serie
		itemNameSourcePath: PropTypes.string, // only if serie
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

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
				.range([0, props.innerPlotWidth]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([props.innerPlotHeight, 0]);

			if (props.isSerie) {
				colors = d3
					.scaleOrdinal(d3.schemeCategory10)
					.domain(_.map(data,record => {return _.get(record, props.keySourcePath)}));
			}
		}

		return (
			<svg className="ptr-chart ptr-scatter-chart" width={props.width} height={props.height}>
				{(data) ? <>
					<AxisY
						scale={yScale}

						bottomMargin={props.xCaptionsSize}
						topPadding={props.innerPaddingTop}
						height={props.plotHeight}
						plotWidth={props.plotWidth}
						width={props.yCaptionsSize}
						ticks={props.yTicks}
						gridlines={props.yGridlines}
						withCaption={props.yCaptions}
						hiddenBaseline={props.withoutYbaseline}
					/>
					<AxisX
						scale={xScale}

						leftMargin={props.yCaptionsSize} //TODO right margin for right oriented
						leftPadding={props.innerPaddingLeft}
						height={props.xCaptionsSize}
						plotHeight={props.plotHeight}
						width={props.plotWidth}

						ticks={props.xTicks}
						gridlines={props.xGridlines}
						withCaption={props.xCaptions}
					/>
					<g transform={`translate(${props.yCaptionsSize + props.innerPaddingTop},${props.innerPaddingLeft})`}>
						{this.renderPoints(data, xScale, yScale, colors)}
					</g>
				</> : null}
			</svg>
		);
	}

	renderPoints(data, xScale, yScale, colors) {
		return _.map(data, (item, index) => {
			let key = _.get(item, this.props.keySourcePath);
			let color = _.get(item, this.props.colorSourcePath);
			let name = _.get(item, this.props.nameSourcePath);

			if (this.props.isSerie) {
				let serie = _.get(item, this.props.serieDataSourcePath);
				if (!color) {
					color = colors(_.get(item, this.props.keySourcePath));
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

export default cartesianChart(ScatterChart);
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import Point from "../Point";

import utilsFilter from "../../../../utils/filter";
import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";
import ChartLegend from "../ChartLegend/ChartLegend";

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

		legend: PropTypes.bool
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

			let xMax = _.max(xValues);
			let xMin = _.min(xValues);

			if (props.xOptions && props.xOptions.min) {
				xMin = props.xOptions.min;
			}

			if (props.xOptions && props.xOptions.max) {
				xMax = props.xOptions.max;
			}

			let yMax = _.max(yValues);
			let yMin = _.min(yValues);

			if (props.yOptions && props.yOptions.min) {
				yMin = props.yOptions.min;
			}

			if (props.yOptions && props.yOptions.max) {
				yMax = props.yOptions.max;
			}

			xDomain = [xMin, xMax];
			yDomain = [yMin, yMax];

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
					.domain(_.map(props.data,record => {return _.get(record, props.keySourcePath)}));
			}
		}

		return (
			<>
				<svg className="ptr-chart ptr-scatter-chart" width={props.width} height={props.height}>
					{(data) ?
						<CartesianChartContent
							{...props}
							{...{xScale, yScale}}
						>
							{this.renderPoints(data, xScale, yScale, colors)}
						</CartesianChartContent>
					: null}
				</svg>
				{this.props.legend ? <ChartLegend
					data={data}
					keySourcePath={this.props.keySourcePath}
					nameSourcePath={this.props.nameSourcePath}
					colorSourcePath={this.props.colorSourcePath}
					colorScale={colors}
				/> : null}
			</>
		);
	}

	renderPoints(data, xScale, yScale, colors) {
		let siblings = _.map(data, item => _.get(item, this.props.keySourcePath));

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

					return this.renderPoint(key, serieItem, xScale(xValue), yScale(yValue), color, finalName, index, siblings);
				});

			} else {
				let xValue = _.get(item, this.props.xSourcePath);
				let yValue = _.get(item, this.props.ySourcePath);

				return this.renderPoint(key, item, xScale(xValue), yScale(yValue), color, name, 0, siblings);
			}
		});
	}

	renderPoint(key, item, x, y, color, name, index, siblings) {
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
				siblings={siblings}
				standalone
			/>
		);
	}
}

export default cartesianChart(ScatterChart);
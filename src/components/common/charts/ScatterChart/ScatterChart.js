import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import Point from "../Point";

import utilsFilter from "../../../../utils/filter";
import utilsSort from "../../../../utils/sort";
import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";
import ChartLegend from "../ChartLegend/ChartLegend";

class ScatterChart extends React.PureComponent {
	static defaultProps = {
		pointRadius: 5,
		minPointRadius: 5,
		maxPointRadius: 25,

		yTicks: true,

		xGridlines: true,
		xScaleType: 'linear'
	};

	static propTypes = {
		defaultSchemePointColors: PropTypes.bool,
		pointRadius: PropTypes.number,
		isSerie: PropTypes.bool,
		itemNameSourcePath: PropTypes.string, // only if serie

		zSourcePath: PropTypes.string,
		zOptions: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* data preparation */
		let xDomain, yDomain, zDomain, xScale, yScale, zScale, xValues, yValues, zValues, colors = null;
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

				zValues = _.map(props.data, item => {
					let serie = _.get(item, props.serieDataSourcePath);
					return _.map(serie, record => {
						return _.get(record, props.zSourcePath);
					});
				});

				zValues = _.flatten(zValues);
			} else {
				yValues = _.map(data, item => {
					return _.get(item, props.ySourcePath);
				});

				xValues = _.map(data, item => {
					return _.get(item, props.xSourcePath);
				});

				if (props.zSourcePath) {
					data = utilsSort.sortByOrder(data, [[props.zSourcePath, 'desc']]);
				}

				zValues = _.map(data, item => {
					return _.get(item, props.zSourcePath);
				});
			}

			let xMax = _.max(xValues);
			let xMin = _.min(xValues);

			if (props.xOptions && (props.xOptions.min || props.xOptions.min === 0)) {
				xMin = props.xOptions.min;
			}

			if (props.xOptions && (props.xOptions.max || props.xOptions.max === 0)) {
				xMax = props.xOptions.max;
			}

			let yMax = _.max(yValues);
			let yMin = _.min(yValues);

			if (props.yOptions && (props.yOptions.min || props.yOptions.min === 0)) {
				yMin = props.yOptions.min;
			}

			if (props.yOptions && (props.yOptions.max || props.yOptions.max === 0)) {
				yMax = props.yOptions.max;
			}

			// apply diversion value to extreme values
			let diversionValue = props.diverging && props.yOptions && props.yOptions.diversionValue || 0;
			if (yMin > diversionValue) {
				yMin = diversionValue;
			}

			if (yMax < diversionValue) {
				yMax = diversionValue;
			}


			/* domains */
			if (props.xScaleType === 'time') {
				xDomain = [new Date(xMin), new Date(xMax)];
			} else {
				xDomain = [xMin, xMax];
			}

			yDomain = [yMin, yMax];
			zDomain = [_.min(zValues), _.max(zValues)];

			/* scales */
			if (props.xScaleType === 'time') {
				xScale = d3
					.scaleTime()
					.domain(xDomain)
					.range([0, props.innerPlotWidth]);
			} else {
				xScale = d3
					.scaleLinear()
					.domain(xDomain)
					.range([0, props.innerPlotWidth]);
			}

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([props.innerPlotHeight, 0]);

			zScale = d3
				.scaleLinear()
				.domain(zDomain)
				.range([props.minPointRadius, props.maxPointRadius]);

			colors = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(_.map(props.data,record => {return _.get(record, props.keySourcePath)}));
		}

		return (
			<>
				<svg className="ptr-chart ptr-cartesian-chart ptr-scatter-chart" height={props.height}>
					{(data) ?
						<CartesianChartContent
							{...props}
							{...{xScale, yScale}}
						>
							{this.renderPoints(data, xScale, yScale, zScale, colors)}
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

	renderPoints(data, xScale, yScale, zScale, colors) {
		let siblings = _.map(data, item => _.get(item, this.props.keySourcePath));

		return _.map(data, (item, index) => {
			let key = _.get(item, this.props.keySourcePath);
			let color = _.get(item, this.props.colorSourcePath);
			let name = _.get(item, this.props.nameSourcePath);

			if ((!color && this.props.colorSourcePath) || this.props.defaultSchemePointColors) {
				color = colors(key);
			}

			if (this.props.isSerie) {
				let serie = _.get(item, this.props.serieDataSourcePath);

				return _.map(serie, (serieItem, index) => {
					let xValue = _.get(serieItem, this.props.xSourcePath);
					if (this.props.xScaleType === "time") {
						xValue = new Date(xValue);
					}
					let yValue = _.get(serieItem, this.props.ySourcePath);
					let zValue = _.get(serieItem, this.props.zSourcePath);
					let itemName = _.get(serieItem, this.props.itemNameSourcePath);
					let finalName = name;
					if (itemName) {
						finalName = `${name} (${itemName})`;
					}

					return this.renderPoint(key, serieItem, xScale(xValue), yScale(yValue), zScale(zValue), color, finalName, index, siblings);
				});

			} else {
				let xValue = _.get(item, this.props.xSourcePath);
				if (this.props.xScaleType === "time") {
					xValue = new Date(xValue);
				}

				let yValue = _.get(item, this.props.ySourcePath);
				let zValue = _.get(item, this.props.zSourcePath);

				return this.renderPoint(key, item, xScale(xValue), yScale(yValue), zScale(zValue), color, name, 0, siblings);
			}
		});
	}

	renderPoint(key, item, x, y, z, color, name, index, siblings) {
		return (
			<Point
				key={key + '-' + index}
				itemKey={key}
				data={item}
				x={x}
				y={y}
				xSourcePath={this.props.xSourcePath}
				xScaleType={this.props.xScaleType}
				xOptions={this.props.xOptions}
				ySourcePath={this.props.ySourcePath}
				yOptions={this.props.yOptions}
				zSourcePath={this.props.zSourcePath}
				zOptions={this.props.zOptions}
				name={name}
				r={z || this.props.pointRadius}
				color={color}
				siblings={siblings}
				standalone
			/>
		);
	}
}

export default cartesianChart(ScatterChart);
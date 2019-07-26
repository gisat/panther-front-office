import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import classnames from 'classnames';

import '../style.scss';
import utilsSort from "../../../../utils/sort";
import utilsFilter from "../../../../utils/filter";

import Bar from "./Bar";
import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";

class ColumnChart extends React.PureComponent {
	static defaultProps = {
		animateChangeData: true,

		minBarWidth: 3,
		barGapRatio: 0.4,

		withoutYbaseline: true
	};

	static propTypes = {
		defaultSchemeBarColors: PropTypes.bool, // if color is not defined in data and should be used from default scheme
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),

		minBarWidth: PropTypes.number,
		barGapRatio: PropTypes.number,

		animateChangeData: PropTypes.bool,
		hoverValueSourcePath: PropTypes.string //path for value to tooltip - by default same like value.
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* data preparation */
		let data, yScale, xScale, xDomain, yDomain, yValues, aggregatedData, colors, minimum = null;
		if (props.data) {

			/* Filtering and sorting */
			let allValuesHasToBeNullToFilterItemOut = !!props.diverging;
			data = utilsFilter.filterDataWithNullValue(props.data, props.ySourcePath, null, allValuesHasToBeNullToFilterItemOut);
			data = props.sorting ? utilsSort.sortByOrder(data, props.sorting) : data;

			/* Maximum and minimum */
			// TODO ySource instead of ySourcePath
			if (_.isArray(props.ySourcePath)) {
				yValues = [];
				_.forEach(data, (item) => {
					_.forEach(props.ySourcePath, (sourcePath) => {
						yValues.push(_.get(item, sourcePath));
					});
				});
			} else {
				yValues = _.map(data, (item) => {return _.get(item, props.ySourcePath)});
			}

			let maximum = _.max(yValues);
			minimum = _.min(yValues);

			/* The minimum should be 0 by default if the minimal value is 0 or positive. Otherwise reduce the minimum by 5 % of the values range to ensure some height for the smallest bar. */
			if (!props.diverging) {
				if (minimum >= 0) {
					minimum = 0;
				} else {
					minimum = minimum - Math.abs(maximum - minimum)*0.05;
				}
			}

			if (props.yOptions && (props.yOptions.min || props.yOptions.min === 0)) {
				minimum = props.yOptions.min;
			}

			if (props.yOptions && (props.yOptions.max || props.yOptions.max === 0)) {
				maximum = props.yOptions.max;
			}

			/* domain and scales */
			xDomain = data.map(i  => _.get(i, props.keySourcePath));
			yDomain = [minimum, maximum];

			xScale = d3
				.scaleBand()
				.padding(props.barGapRatio)
				.domain(xDomain)
				.range([0, props.innerPlotWidth]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([props.innerPlotHeight, 0]);

			if (props.defaultSchemeBarColors) {
				colors = d3
					.scaleOrdinal(d3.schemeCategory10)
					.domain(props.data.map(record => {return _.get(record, props.keySourcePath)}));
			}

			let barWidth = xScale.bandwidth();
			/* gap ratio between bars */
			if (barWidth < 10) {
				xScale = xScale.padding(0.1);
			}

			/* aggregation, if needed */
			aggregatedData = [];
			if (barWidth < props.minBarWidth) {
				let itemsInGroup = Math.ceil(props.minBarWidth/barWidth);
				let keys = [];
				let originalData = [];
				_.map(data,(item, index) => {
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
		}

		const chartClassNames = classnames('ptr-chart ptr-cartesian-chart ptr-column-chart', {
			'ptr-chart-no-animation': !props.animateChangeData,
		});

		return (
			<svg className={chartClassNames} height={props.height}>
				{data ?
					<CartesianChartContent
						{...props}
						{...{xScale, yScale, contentData: data, aggregated: !!aggregatedData.length}}
					>
						{aggregatedData.length ? this.renderAggregated(aggregatedData, props, xScale, yScale, minimum, props.innerPlotHeight, props.innerPlotWidth) : this.renderBars(data, props, xScale, yScale, minimum, props.innerPlotHeight, colors)}
					</CartesianChartContent>
				: null}
			</svg>
		);
	}

	renderAggregated(data, props, xScale, yScale, minimum, availableHeight, availableWidth) {
		return (
			this.props.diverging !== 'double' ? (
			<>
				{this.renderPath(data, props, xScale, yScale, minimum, availableHeight, availableWidth)}
				{this.renderBarsFromAggregated(data, props, xScale, yScale, minimum, availableHeight)}
			</>) : (<>
				{(() => {
					// TODO find out how to aggregate
					console.warn('Column chart: There is not enough space to render diverging column chart.');
					return null;
				})()}
			</>)
		)
	}

	renderBars(data, props, xScale, yScale, minimum, availableHeight, colors) {

		let baseValueY = minimum;
		let y0 = 0;

		if (props.diverging) {
			baseValueY = props.yOptions && props.yOptions.diversionValue || 0;
			y0 = availableHeight - yScale(baseValueY);
		}

		let positiveDirectionBars = [];
		let negativeDirectionBars = [];

		data.map((item) => {
			let key = _.get(item, props.keySourcePath);
			let color = _.get(item, props.colorSourcePath);
			let defaultColor = this.props.defaultColor;
			let highlightedColor = this.props.highlightedColor;

			if (props.colorSourcePath && color) {
				defaultColor = color;
				highlightedColor = chroma(defaultColor).darken(1);
			}

			if (props.defaultSchemeBarColors) {
				defaultColor = colors(key);
				highlightedColor = chroma(defaultColor).darken(1);
			}

			let x0 = xScale(key);
			let width = xScale.bandwidth();


			let barsData = [];

			// TODO ySource instead of ySourcePath
			if (_.isArray(props.ySourcePath)) {
				_.forEach(props.ySourcePath, (path) => {
					let value = _.get(item, path);
					if (value || value === 0) {
						barsData.push({path, value})
					}
				});
			} else {
				let value = _.get(item, props.ySourcePath);
				if (value || value === 0) {
					barsData.push({path: props.ySourcePath, value})
				}
			}


			_.forEach(barsData, (bar) => {
				let height = availableHeight - yScale(bar.value);

				if (props.diverging) {
					if (bar.value >= baseValueY) {
						height = height - y0;
						positiveDirectionBars.push(this.renderBar(key, bar.value, defaultColor, highlightedColor, x0, y0, width, height, availableHeight, item, bar.path));
					} else {
						height = y0 - height;
						negativeDirectionBars.push(this.renderBar(key, bar.value, defaultColor, highlightedColor, x0, availableHeight - y0, width, height, availableHeight, item, bar.path));
					}
				} else {
					positiveDirectionBars.push(this.renderBar(key, bar.value, defaultColor, highlightedColor, x0, y0, width, height, availableHeight, item, bar.path));
				}
			});
		});

		return (
			<>
				{
					positiveDirectionBars.length ? (
						<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
							{positiveDirectionBars}
						</g>
					) : null
				}
				{
					negativeDirectionBars.length ? (
						<g transform={`translate(0,0)`}>
							{negativeDirectionBars}
						</g>
					) : null
				}
			</>
		);
	}

	renderBar(key, value, defaultColor, highlightedColor, x0, y0, width, height, availableHeight, data, path, hidden) {
		return (
			<Bar
				itemKeys={[key]}
				key={`${key}_${value}`}
				defaultColor={defaultColor}
				highlightedColor={highlightedColor}

				y={y0}
				x={x0}
				width={width}
				height={height}
				availableHeight={availableHeight}

				nameSourcePath={this.props.xSourcePath}
				valueSourcePath={path}
				hoverValueSourcePath={this.props.hoverValueSourcePath || this.props.valueSourcePath}
				data={data}
				yOptions={this.props.yOptions}
				
				placeholder={this.props.diverging !== 'double'}
				baseline={this.props.diverging === 'double'}
				hidden={hidden}
			/>
		);
	}

	renderBarsFromAggregated(aggregatedData, props, xScale, yScale, minimum, availableHeight) {
		let positiveDirectionBars = [];
		let negativeDirectionBars = [];

		let baseValueY = minimum;
		let y0 = 0;

		if (props.diverging) {
			baseValueY = props.yOptions && props.yOptions.diversionValue || 0;
			y0 = availableHeight - yScale(baseValueY);
		}

		_.map(aggregatedData,(group) => {
			let firstItemFromGroup = group.originalData[0];
			let key = _.get(firstItemFromGroup, props.keySourcePath);
			let value = _.get(firstItemFromGroup, props.ySourcePath);
			let x0 = xScale(group.keys);
			let width = xScale.bandwidth();

			let height = availableHeight - yScale(value);

			if (props.diverging) {
				if (value >= baseValueY) {
					height = height - y0;
					positiveDirectionBars.push(this.renderBar(key, value, props.defaultColor, props.highlightedColor, x0, y0, width, height, availableHeight, group, props.ySourcePath, true));
				} else {
					height = y0 - height;
					negativeDirectionBars.push(this.renderBar(key, value, props.defaultColor, props.highlightedColor, x0, availableHeight - y0, width, height, availableHeight, group, props.ySourcePath, true));
				}
			} else {
				positiveDirectionBars.push(this.renderBar(key, value, props.defaultColor, props.highlightedColor, x0, y0, width, height, availableHeight, group, props.ySourcePath,true));
			}
		});

		return (
			<>
				{
					positiveDirectionBars.length ? (
						<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
							{positiveDirectionBars}
						</g>
					) : null
				}
				{
					negativeDirectionBars.length ? (
						<g transform={`translate(0,0)`}>
							{negativeDirectionBars}
						</g>
					) : null
				}
			</>
		);
	}

	renderPath(aggregatedData, props, xScale, yScale, minimum, availableHeight, availableWidth) {
		let style = {};
		if (this.props.defaultColor) {
			style.fill = this.props.defaultColor;
		}


		let firstValueFromGroup = "";
		let y0 = availableHeight;

		if (this.props.diverging) {
			let baseValueY = props.yOptions && props.yOptions.diversionValue || 0;
			y0 = yScale(baseValueY);
		}

		return (
			<path className="ptr-column-chart-path"
				  style={style}
				  d={`M0 ${y0} L${aggregatedData.map((group) => {
					  firstValueFromGroup = _.get(group.originalData[0], props.ySourcePath);
					  return `${xScale(group.keys)} ${yScale(firstValueFromGroup)}`;
				  }).join(' L')} L${availableWidth} ${yScale(firstValueFromGroup)} L${availableWidth} ${y0}`
				  }
			/>
		);
	}
}

export default cartesianChart(ColumnChart);
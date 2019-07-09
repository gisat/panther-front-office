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
		minBarWidth: 4,
		barGapRatio: 0.4,

		withoutYbaseline: true
	};

	static propTypes = {
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		sorting: PropTypes.array,
		animateChangeData: PropTypes.bool,

		minBarWidth: PropTypes.number,
		barGapRatio: PropTypes.number,

		colored: PropTypes.bool, // if color is not defined in data and should be used from default scheme
		hoverValueSourcePath: PropTypes.string //path for value to tooltip - by default same like value.
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* data preparation */
		let data, yScale, xScale, xDomain, yDomain, aggregatedData, colors = null;
		if (props.data) {
			data = utilsFilter.filterDataWithNullValue(props.data, props.ySourcePath);
			data = props.sorting ? utilsSort.sortByOrder(data, props.sorting) : data;

			let yValues = _.map(data, (item) => {return _.get(item, props.ySourcePath)});
			let maximum = _.max(yValues);
			let minimum = _.min(yValues);

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

			if (props.colored) {
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
						{...{xScale, yScale, contentData: data}}
					>
						{aggregatedData.length ? this.renderAggregated(aggregatedData, props, xScale, yScale, props.innerPlotHeight, props.innerPlotWidth) : this.renderBars(data, props, xScale, yScale, props.innerPlotHeight, colors)}
					</CartesianChartContent>
				: null}
			</svg>
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

	renderBars(data, props, xScale, yScale, availableHeight, colors) {
		return (
			<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
				{data.map((item) => {
					let key = _.get(item, props.keySourcePath);
					let value = _.get(item, props.ySourcePath);
					let color = _.get(item, props.colorSourcePath);
					let defaultColor = this.props.defaultColor;
					let highlightedColor = this.props.highlightedColor;

					if (props.colorSourcePath && color) {
						defaultColor = color;
						highlightedColor = chroma(defaultColor).darken(1);
					}

					if (props.colored) {
						defaultColor = colors(key);
						highlightedColor = chroma(defaultColor).darken(1);
					}

					return (
						<Bar
							itemKeys={[key]}
							key={`${key}_${value}`}
							defaultColor={defaultColor}
							highlightedColor={highlightedColor}

							y={0}
							x={xScale(key)}
							width={xScale.bandwidth()}
							height={availableHeight - yScale(value)}
							availableHeight={availableHeight}

							nameSourcePath={this.props.xSourcePath}
							valueSourcePath={this.props.ySourcePath}
							hoverValueSourcePath={this.props.hoverValueSourcePath || this.props.valueSourcePath}
							data={item}
							yOptions={this.props.yOptions}
						/>
					);
				})}
			</g>
		);
	}

	renderBarsFromAggregated(aggregatedData, props, xScale, yScale, availableHeight) {
		return (
			<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
				{_.map(aggregatedData,(group) => {
					let firstItemFromGroup = group.originalData[0];
					let key = _.get(firstItemFromGroup, props.keySourcePath);
					let value = _.get(firstItemFromGroup, props.ySourcePath);

					return (
						<Bar
							hidden
							itemKeys={group.keys}
							key={`${key}_${value}`}
							defaultColor={this.props.defaultColor}
							highlightedColor={this.props.highlightedColor}

							y={0}
							x={xScale(group.keys)}
							width={xScale.bandwidth()}
							height={availableHeight - yScale(value)}
							availableHeight={availableHeight}

							nameSourcePath={this.props.xSourcePath}
							valueSourcePath={this.props.ySourcePath}
							data={group}
							yOptions={this.props.yOptions}
						/>
					);
				})}
			</g>
		);
	}

	renderPath(aggregatedData, props, xScale, yScale, availableHeight, availableWidth) {
		let style = {};
		if (this.props.defaultColor) {
			style.fill = this.props.defaultColor;
		}

		return (
			<path className="ptr-column-chart-path"
				  style={style}
				d={`M0 ${availableHeight} L${aggregatedData.map((group) => {
						let firstValueFromGroup = _.get(group.originalData[0], props.ySourcePath);
						return `${xScale(group.keys)} ${yScale(firstValueFromGroup)}`
					}).join(' L')} L${availableWidth} ${availableHeight}`
				}
			/>
		);
	}
}

export default cartesianChart(ColumnChart);
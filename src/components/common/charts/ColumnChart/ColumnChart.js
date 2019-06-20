import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import '../style.scss';
import utilsSort from "../../../../utils/sort";
import utilsFilter from "../../../../utils/filter";

import Bar from "./Bar";
import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";

class ColumnChart extends React.PureComponent {
	static defaultProps = {
		minBarWidth: 4,
		barGapRatio: 0.4
	};

	static propTypes = {
		data: PropTypes.array,
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		sorting: PropTypes.array,

		minBarWidth: PropTypes.number,
		barGapRatio: PropTypes.number,

		keySourcePath: PropTypes.string,
		colorSourcePath: PropTypes.string,
		xSourcePath: PropTypes.string,
		ySourcePath: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* data preparation */
		let data, yScale, xScale, xDomain, yDomain, aggregatedData = null;
		if (props.data) {
			data = utilsFilter.filterDataWithNullValue(props.data, props.ySourcePath);
			data = props.sorting ? utilsSort.sortByOrder(data, props.sorting) : data;

			let yValues = _.map(data, (item) => {return _.get(item, props.ySourcePath)});
			let maximum = _.max(yValues);
			let minimum = _.min(yValues);
			if (minimum >= 0) minimum = 0; // TODO custom option - forceMinimum?

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

		return (
			<svg className="ptr-chart ptr-column-chart" width={props.width} height={props.height}>
				{data ?
					<CartesianChartContent
						{...props}
						{...{xScale, yScale, contentData: data}}
					>
						{aggregatedData.length ? this.renderAggregated(aggregatedData, props, xScale, yScale, props.innerPlotHeight, props.innerPlotWidth) : this.renderBars(data, props, xScale, yScale, props.innerPlotHeight)}
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

	renderBars(data, props, xScale, yScale, availableHeight) {
		return (
			<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
				{data.map((item) => {
					let key = _.get(item, props.keySourcePath);
					let value = _.get(item, props.ySourcePath);
					let defaultColor = this.props.defaultColor;
					let highlightedColor = this.props.highlightedColor;

					if (props.colorSourcePath) {
						defaultColor = _.get(item, props.colorSourcePath);
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
							data={item}
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
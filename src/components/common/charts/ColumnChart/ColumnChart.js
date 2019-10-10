import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import classnames from 'classnames';

import './style.scss';
import utilsSort from "../../../../utils/sort";

import cartesianChart from "../cartesianChart/cartesianChart";
import CartesianChartContent from "../cartesianChart/CartesianChartContent";
import BarGroup from "./BarGroup";

class ColumnChart extends React.PureComponent {
	static defaultProps = {
		animateChangeData: true,

		minBarWidth: 3,
		barGapRatio: 0.35,

		withoutYbaseline: true
	};

	static propTypes = {
		defaultSchemeBarColors: PropTypes.bool, // if color is not defined in data and should be used from default scheme
		defaultColor: PropTypes.string,
		highlightColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),

		minBarWidth: PropTypes.number,
		barGapRatio: PropTypes.number,

		animateChangeData: PropTypes.bool,
		hoverValueSourcePath: PropTypes.string, //path for value to tooltip - by default same like value.

		stacked: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.string
		])
	};

	constructor(props) {
		super(props);
	}

	prepareData() {
		const props = this.props;

		let defaultColor = props.defaultColor;
		let highlightColor = props.highlightColor;
		let colorScale = null;

		if (props.defaultSchemeBarColors) {
			colorScale = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(props.data);
		}
		let data = [];

		_.forEach(props.data, (record) => {
			let key = _.get(record, props.keySourcePath);
			let name = _.get(record, props.nameSourcePath);
			let	positive = {
				total: null,
				data: []
			};
			let	negative = {
				total: null,
				data: []
			};
			

			// colors
			let color = _.get(record, props.colorSourcePath);
			if (props.colorSourcePath && color) {
				defaultColor = color;
				highlightColor = chroma(defaultColor).darken(1);
			}

			if (props.defaultSchemeBarColors) {
				defaultColor = colorScale(key);
				highlightColor = chroma(defaultColor).darken(1);
			}

			// data
			let diversionValue = props.diverging && props.yOptions && props.yOptions.diversionValue || 0;

			if (_.isArray(props.ySourcePath)) {
				_.forEach(props.ySourcePath, source => {
					if (typeof source === "string" && props.diverging) {
						let value = _.get(record, source);
						// Deprecated ySourcePath array -> diverging double
						if (value >= diversionValue) {
							positive.total = value;
							positive.data.push({value, defaultColor, highlightColor});
						} else {
							negative.total = value;
							negative.data.push({value, defaultColor, highlightColor});
						}
					} else {
						let value = _.get(record, source.path);
						let name = source.name;
						if (source.color) {
							defaultColor = source.color;
							highlightColor = chroma(defaultColor).darken(1).hex();
						}

						if (value || value === 0) {
							if (value >= diversionValue) {
								if (!positive.total) {
									positive.total = diversionValue;
								}
								positive.total += (value - diversionValue);
								positive.data.push({name, value, defaultColor, highlightColor});
							} else {
								if (!negative.total) {
									negative.total = diversionValue;
								}
								negative.total -= (diversionValue - value);
								negative.data.push({name, value, defaultColor, highlightColor});
							}
						}
					}
				});
			} else {
				let value = _.get(record, props.ySourcePath);

				if (props.diverging) {
					if (value >= diversionValue) {
						positive.total = value;
						positive.data.push({value, defaultColor, highlightColor});
					} else {
						negative.total = value;
						negative.data.push({value, defaultColor, highlightColor});
					}
				} else {
					positive.total = value;
					positive.data.push({value, defaultColor, highlightColor});
				}
			}

			if (props.stacked === "relative") {
				if (positive.total) {
					_.forEach(positive.data, record => {
						record.originalValue = record.value;
						record.value = Math.abs(record.value * 100 / positive.total);
					});
					positive.total = 100;
				}

				if (negative.total) {
					_.forEach(negative.data, record => {
						record.originalValue = record.value;
						record.value = -Math.abs(record.value * 100 / negative.total);
					});
					negative.total = -100;
				}
			}

			if (positive.total || negative.total) {
				data.push({key, name, positive, negative});
			}
		});

		return data;
	}

	/* TODO solve sorting properly */
	sortData(data) {
		let params = [];
		let order = 'desc';
		_.forEach(this.props.sorting, (rule) => {
			let attribute = rule[0];
			if (attribute === this.props.nameSourcePath) {
				params.push(['name', rule[1]]);
			} else {
				order = rule[1];
			}
		});
		params.push(['negative.total', order], ['positive.total', order]);
		return utilsSort.sortByOrder(data, params);
	}

	getExtremeValues(data) {
		const props = this.props;
		let min, max = null;

		let yValues = [];
		_.forEach(data, record => {
			if (record.positive.total) {
				yValues.push(record.positive.total);
			}

			if (record.negative.total) {
				yValues.push(record.negative.total);
			}
		});

		max = _.max(yValues);
		min = _.min(yValues);

		/* The min should be 0 by default if the minimal value is 0 or positive. Otherwise reduce the min by 5 % of the values range to ensure some height for the smallest bar. */
		if (min >= 0) {
			min = 0;
		} else {
			min = min - Math.abs(max - min)*0.05;
		}

		if (this.props.diverging && max < 0) {
			max = 0;
		}

		if (props.yOptions && (props.yOptions.min || props.yOptions.min === 0)) {
			min = props.yOptions.min;
		}

		if (props.yOptions && (props.yOptions.max || props.yOptions.max === 0)) {
			max = props.yOptions.max;
		}
		
		return {min, max};
	}

	render() {
		const props = this.props;

		/* data preparation */
		let data, aggregatedData, yScale, xScale, xDomain, yDomain, minimum, maximum, diversionValue, units = null;
		if (props.data) {

			/* Prepare data for column chart */
			data = this.prepareData();
			data = props.sorting ? this.sortData(data) : data;

			/* Get maximum and minimum */
			let extremeValues = this.getExtremeValues(data);
			minimum = extremeValues.min;
			maximum = extremeValues.max;

			/* Adjust units */
			units = props.yOptions && props.yOptions.unit;
			if (props.stacked === 'relative') {
				units = '%';
			}

			diversionValue = minimum;
			if (props.diverging) {
				diversionValue = props.yOptions && props.yOptions.diversionValue || 0;
			}

			/* Set domain and scales */
			xDomain = data.map(i  => i.key);
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

			/* Aggregation needed? */
			let barWidth = xScale.bandwidth();
			/* gap ratio between bars */
			if (barWidth < 17) {
				xScale = xScale.padding(0.25);
			}
			if (barWidth < 14) {
				xScale = xScale.padding(0.1);
			}

			/* aggregation, if needed */
			aggregatedData = [];
			if (barWidth < props.minBarWidth) {
				let itemsInGroup = Math.ceil(props.minBarWidth/barWidth);
				let keys = [];
				let originalData = [];
				_.map(data,(item, index) => {
					keys.push(item.key);
					originalData.push(item);
					if (index % itemsInGroup === (itemsInGroup - 1) || index === (data.length - 1)) {
						aggregatedData.push({keys, originalData});
						keys = [];
						originalData = [];
					}
				});

				// adjust domain
				xDomain = aggregatedData.map(i  => i.keys[0]);
				xScale = xScale.domain(xDomain).padding(0);
			}
		}

		let svgHeight = props.height;
		if (aggregatedData.length) {
			svgHeight = props.plotHeight + 20;
		}

		const chartClassNames = classnames('ptr-chart ptr-cartesian-chart ptr-column-chart', {
			'ptr-chart-no-animation': !props.animateChangeData,
		});

		return (
			<svg className={chartClassNames} height={svgHeight}>
				{data ?
					<CartesianChartContent
						{...props}
						{...{xScale, yScale, contentData: data, aggregated: !!aggregatedData.length}}
					>
						{aggregatedData.length ? this.renderAggregated(aggregatedData, units, xScale, yScale, diversionValue, props.innerPlotHeight, props.innerPlotWidth) : this.renderBarGroups(data, units, minimum, maximum, xScale, yScale, diversionValue, props.innerPlotHeight, props.innerPlotWidth)}
					</CartesianChartContent>
				: null}
			</svg>
		);
	}

	renderBarGroups(data, units, minimum, maximum, xScale, yScale, yBaseValue, availableHeight, availableWidth) {
		return data.map(item => {
			return (
				<BarGroup
					key={item.key}
					itemKeys={[item.key]}
					data={item}
					originalData={item}
					minimum={minimum}
					maximum={maximum}
					xScale={xScale}
					yScale={yScale}
					yBaseValue={yBaseValue}
					availableHeight={availableHeight}
					availableWidth={availableWidth}
					defaultColor={this.props.defaultColor}
					highlightColor={this.props.highlightColor}
					attributeName={this.props.yOptions && this.props.yOptions.name}
					attributeUnits={units}
					baseline={this.props.diverging === "double"}
					stacked={this.props.stacked}
				/>
			);
		});
	}

	renderAggregated(data, units, xScale, yScale, yBaseValue, availableHeight, availableWidth) {
		return (
			this.props.diverging !== "double" && !this.props.stacked ? (
			<>
				{this.renderPath(data, xScale, yScale, yBaseValue, availableHeight, availableWidth)}
				{this.renderBarsFromAggregated(data, units, xScale, yScale, yBaseValue, availableHeight, availableWidth)}
			</>) : (<>
				{(() => {
					// TODO find out how to aggregate
					console.warn('Column chart: There is not enough space to render diverging column chart.');
					return null;
				})()}
			</>)
		)
	}

	renderBarsFromAggregated(data, units, xScale, yScale, yBaseValue, availableHeight, availableWidth) {
		return data.map(group => {
			return (
				<BarGroup
					key={group.keys[0]}
					itemKeys={group.keys}
					data={group.originalData[0]}
					originalData={group.originalData}
					xScale={xScale}
					yScale={yScale}
					yBaseValue={yBaseValue}
					availableHeight={availableHeight}
					availableWidth={availableWidth}
					defaultColor={this.props.defaultColor}
					highlightColor={this.props.highlightColor}
					attributeName={this.props.yOptions && this.props.yOptions.name}
					attributeUnits={units}
					baseline={this.props.diverging === "double"}
					hidden
				/>
			);
		});
	}

	renderPath(data, xScale, yScale, yBaseValue, availableHeight, availableWidth) {
		const props = this.props;
		let style = {};
		if (props.defaultColor) {
			style.fill = props.defaultColor;
		}

		let y0 = availableHeight;

		if (this.props.diverging) {
			let baseValueY = props.yOptions && props.yOptions.diversionValue || 0;
			y0 = yScale(baseValueY);
		}

		let points = [];
		_.forEach(data, group => {
			let firstValue = group.originalData[0].positive.total;
			if (firstValue) {
				points.push(`${xScale(group.keys[0])} ${yScale(firstValue)}`)
			}
		});

		_.forEach(data, group => {
			let firstValue = group.originalData[0].negative.total;
			if (firstValue) {
				points.push(`${xScale(group.keys[0])} ${yScale(firstValue)}`)
			}
		});

		let lastPoint = points[points.length - 1].split(" ");
		let lastNode = "";
		if (lastPoint[1] > y0) {
			lastNode = `L${availableWidth} ${lastPoint[1]}`;
		}

		return (
			<path className="ptr-column-chart-path"
				  style={style}
				  d={`M0 ${y0} L${points.join(' L')} ${lastNode} L${availableWidth} ${y0}`}
			/>
		);
	}
}

export default cartesianChart(ColumnChart);
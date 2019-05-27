import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import '../style.scss';
import utilsSort from "../../../../utils/sort";
import utilsFilter from "../../../../utils/filter";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import Bar from "./Bar";
import Popup from "../../HoverHandler/Popup/Popup";

const MIN_BAR_WIDTH = 4; // TODO optional
const BAR_GAP_RATIO = 0.4; // TODO optional

const WIDTH = 500;
const HEIGHT = 250;

const MIN_WIDTH = 200;
const MAX_WIDTH = 1000;

const Y_CAPTIONS_SIZE = 70;
const X_CAPTIONS_SIZE = 70;

const MARGIN_TOP = 20;

// TODO optional
const INNER_PADDING_LEFT = 10;
const INNER_PADDING_RIGHT = 10;

// TODO custom max, min

class ColumnChart extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		sorting: PropTypes.array,

		height: PropTypes.number,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,

		minAspectRatio: PropTypes.number,

		xCaptionsSize: PropTypes.number, // space for captions along axis X
		yCaptionsSize: PropTypes.number, // space for captions along axis Y

		xCaptions: PropTypes.bool,
		yCaptions: PropTypes.bool,

		xTicks: PropTypes.bool,
		yTicks: PropTypes.bool,

		xGridlines: PropTypes.bool,
		yGridlines: PropTypes.bool,

		withoutYbaseline: PropTypes.bool,

		keySourcePath: PropTypes.string,
		xSourcePath: PropTypes.string,
		ySourcePath: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	// TODO axis orientation
	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width ? props.width : WIDTH;
		let height = props.height ? props.height : HEIGHT;

		let minWidth = props.minWidth ? props.minWidth : MIN_WIDTH;
		let maxWidth = props.maxWidth ? props.maxWidth: MAX_WIDTH;

		let xCaptionsSize = props.xCaptionsSize ? props.xCaptionsSize : X_CAPTIONS_SIZE;
		let yCaptionsSize = props.yCaptionsSize ? props.yCaptionsSize : Y_CAPTIONS_SIZE;

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
		let innerPlotWidth = plotWidth - (INNER_PADDING_LEFT + INNER_PADDING_RIGHT);
		let innerPlotHeight = plotHeight;

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
				.padding(BAR_GAP_RATIO)
				.domain(xDomain)
				.range([0, innerPlotWidth]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([innerPlotHeight, 0]);

			let barWidth = xScale.bandwidth();
			/* gap ratio between bars */
			if (barWidth < 10) {
				xScale = xScale.padding(0.1);
			}

			/* aggregation, if needed */
			aggregatedData = [];
			if (barWidth < MIN_BAR_WIDTH) {
				let itemsInGroup = Math.ceil(MIN_BAR_WIDTH/barWidth);
				let keys = [];
				let originalData = [];
				data.forEach((item, index) => {
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
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-column-chart" width={width} height={height}>
					{data ?
						<>
							<AxisY
								scale={yScale}

								bottomMargin={xCaptionsSize}
								height={plotHeight}
								plotWidth={plotWidth}
								width={yCaptionsSize}

								ticks={props.yTicks}
								gridlines={props.yGridlines}
								withCaption={props.yCaptions}
								hiddenBaseline={props.withoutYbaseline}
							/>
							<AxisX
								data={data}
								scale={xScale}
								domain={xDomain}
								sourcePath={props.xSourcePath}
								keySourcePath={props.keySourcePath}

								leftMargin={yCaptionsSize} //TODO right margin for right oriented
								leftPadding={INNER_PADDING_LEFT}
								height={xCaptionsSize}
								plotHeight={plotHeight}
								width={plotWidth}

								ticks={props.xTicks}
								gridlines={props.xGridlines}
								withCaption={props.xCaptions}
							/>
							<g transform={`translate(${yCaptionsSize + INNER_PADDING_LEFT},0)`}>
								{aggregatedData.length ? this.renderAggregated(aggregatedData, props, xScale, yScale, innerPlotHeight, innerPlotWidth) : this.renderBars(data, props, xScale, yScale, innerPlotHeight)}
							</g>
						</> : null
					}
				</svg>
			</div>
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

					return (
						<Bar
							itemKeys={[key]}
							key={`${key}_${value}`}
							defaultColor={this.props.defaultColor}
							highlightedColor={this.props.highlightedColor}

							y={0}
							x={xScale(key)}
							width={xScale.bandwidth()}
							height={availableHeight - yScale(value)}
							availableHeight={availableHeight}

							popupContent={this.getPopupContent([key])}
						/>
					);
				})}
			</g>
		);
	}

	renderBarsFromAggregated(aggregatedData, props, xScale, yScale, availableHeight) {
		return (
			<g transform={`scale(1,-1) translate(0,-${availableHeight})`}>
				{aggregatedData.map((group) => {
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

							popupContent={this.getPopupContent(group.keys)}
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

	getPopupContent(itemKeys) {
		let content = null;

		if (itemKeys.length < 15){
			let con = [];
			itemKeys.map((key) => {
				let data = _.find(this.props.data, item => {return _.get(item, this.props.keySourcePath) === key});
				let unit = _.get(data, this.props.xSourcePath);
				let value = _.get(data, this.props.ySourcePath);
				con.push(<div key={unit}><i>{unit}:</i> {value.toLocaleString()}</div>);
			});
			content = (<>{con}</>);
		} else {
			let units = [];
			let values = [];
			itemKeys.map((key) => {
				let data = _.find(this.props.data, item => {return _.get(item, this.props.keySourcePath) === key});
				units.push(_.get(data, this.props.xSourcePath));
				values.push(_.get(data, this.props.ySourcePath));
			});
			content = (
				<div>
					<i>{units.length < 10 ? units.join(", ") : `${units.length} items `}</i>
					{`From ${_.min(values).toLocaleString()} to ${_.max(values).toLocaleString()}`}
				</div>
			);
		}

		return content;
	}
}

export default ColumnChart;


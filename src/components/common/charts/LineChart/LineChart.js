import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';
import utils from "../../../../utils/sort";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import Popup from "../Popup";
import Line from "./Line";
import Bar from "../ColumnChart/ColumnChart";

const WIDTH = 500;
const HEIGHT = 250;

const MIN_WIDTH = 200;
const MAX_WIDTH = 1000;

const Y_CAPTIONS_SIZE = 70;
const X_CAPTIONS_SIZE = 70;

// TODO optional
const INNER_PADDING_LEFT = 10;
const INNER_PADDING_RIGHT = 10;
const INNER_PADDING_TOP = 10;

class LineChart extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,

		serieKeySourcePath: PropTypes.string,
		serieNameSourcePath: PropTypes.string,
		serieDataSourcePath: PropTypes.string,
		xSourcePath: PropTypes.string, // in context of serie
		ySourcePath: PropTypes.string, // in context of serie

		xCaptionsSize: PropTypes.number, // space for captions along axis X
		yCaptionsSize: PropTypes.number, // space for captions along axis Y

		xCaptions: PropTypes.bool,
		yCaptions: PropTypes.bool,

		withPoints: PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {popup: null};

		this.onLineOut = this.onLineOut.bind(this);
		this.onLineOver = this.onLineOver.bind(this);
	}

	onLineOver(itemKey, x, y, data) {
		let state = this.state.popup;

		if (!state || !_.isEqual(state.itemKey, itemKey)  || state.x !== x || state.y !== y) {
			this.setState({
				popup: {itemKey, x, y, data}
			});
		}
	}

	onLineOut() {
		this.setState({popup: null});
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

		let plotWidth = width - (yCaptionsSize);
		let plotHeight = height - (xCaptionsSize);
		let innerPlotWidth = plotWidth - (INNER_PADDING_LEFT + INNER_PADDING_RIGHT);
		let innerPlotHeight = plotHeight - INNER_PADDING_TOP;

		/* data preparation */
		let xDomain, yDomain, xScale, yScale, colors, firstSerieData = null;
		let data = props.data;

		if (data) {
			/* domain */
			let yMaximum = _.max(data.map(item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.max(serie.map(record => {
					return _.get(record, props.ySourcePath);
				}));
			}));

			let yMinimum = _.min(data.map(item => {
				let serie = _.get(item, props.serieDataSourcePath);
				return _.min(serie.map(record => {
					return _.get(record, props.ySourcePath);
				}));
			}));

			/* domain and scales */
			firstSerieData = _.get(data[0], props.serieDataSourcePath); // TODO have all series same range?
			xDomain = firstSerieData.map(record => {return _.get(record, props.xSourcePath)});
			yDomain = [yMinimum, yMaximum];

			xScale = d3
				.scaleBand()
				.domain(xDomain)
				.range([0, innerPlotWidth]);

			yScale = d3
				.scaleLinear()
				.domain(yDomain)
				.range([innerPlotHeight, 0]);

			colors = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(data.map(record => {return _.get(record, props.serieKeySourcePath)}));
		}


		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-line-chart" width={width} height={height}>
					{data ? <>
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
							data={firstSerieData}
							scale={xScale}
							domain={xDomain}
							sourcePath={props.xSourcePath}
							keySourcePath={props.xSourcePath}

							leftMargin={yCaptionsSize} //TODO right margin for right oriented
							leftPadding={INNER_PADDING_LEFT}
							height={xCaptionsSize}
							plotHeight={plotHeight}
							width={plotWidth}

							ticks={props.xTicks}
							gridlines={props.xGridlines}
							withCaption={props.xCaptions}
						/>
						<g transform={`translate(${yCaptionsSize + INNER_PADDING_LEFT},${INNER_PADDING_TOP})`}>
							{this.renderLines(data, props, xScale, yScale, colors)}
						</g>
					</> : null}
				</svg>
				{this.state.popup ? this.renderPopup(width) : null}
			</div>
		);
	}

	renderLines(data, props, xScale, yScale, colors) {
		let leftOffset = xScale.bandwidth()/2;

		return data.map((item, index) => {
			let serie = _.get(item, props.serieDataSourcePath);
			let key = _.get(item, props.serieKeySourcePath);
			let color = colors(_.get(item, props.serieKeySourcePath));

			let coordinates = serie.map(record => {
				let x = xScale(_.get(record, props.xSourcePath)) + leftOffset;
				let y = yScale(_.get(record, props.ySourcePath));
				return {x,y, originalData: record};
			});

			return (
				<Line
					key={key}
					itemKey={key}
					coordinates={coordinates}
					color={color}
					onMouseOut={this.onLineOut}
					onMouseOver={this.onLineOver}
					onMouseMove={this.onLineOver}
					withPoints={this.props.withPoints}
				/>
			);
		});
	}

	renderPopup(maxX) {
		const state = this.state.popup;
		let content = null;

		if (state.itemKey) {
			let data = _.find(this.props.data, item => {return _.get(item, this.props.serieKeySourcePath) === state.itemKey});
			content = (
				<>
					<div>{_.get(data, this.props.serieNameSourcePath)}</div>
					{state.data ? (
						<div>{`${_.get(state.data, this.props.xSourcePath)}: ${_.get(state.data, this.props.ySourcePath)}`}</div>
					) : null}
				</>
			);
		}

		return (
			<Popup
				x={state.x}
				y={state.y}
				maxX={maxX}
			>
				{content}
			</Popup>
		);
	}
}

export default LineChart;


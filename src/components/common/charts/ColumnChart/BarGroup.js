import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import Bar from "./Bar";

import './style.scss';

import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

const ANIMATION_DURATION = 1500;
const ANIMATION_DELAY = 1000;

class BarGroup extends React.PureComponent {

	static contextType = HoverContext;

	static propTypes = {
		data: PropTypes.object,
		originalData: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.object
		]), // used in popups
		itemKeys: PropTypes.array,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		yBaseValue: PropTypes.number,
		availableHeight: PropTypes.number,
		availableWidth: PropTypes.number,
		defaultColor: PropTypes.string,
		highlightColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		attributeName: PropTypes.string,
		attributeUnits: PropTypes.string,
		maximum: PropTypes.number,
		minimum: PropTypes.number,
		baseline: PropTypes.bool,
		hidden: PropTypes.bool,

		stacked: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.string
		])
	};

	constructor(props) {
		super(props);

		this.state = {
			highlighted: false
		};

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
	}

	onMouseMove(e) {
		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys, {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		this.setState({highlighted: true});
	}

	onMouseOver(e) {
		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys, {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		this.setState({highlighted: true});
	}

	onMouseOut(e) {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}

		this.setState({highlighted: false});
	}


	render() {
		const props = this.props;
		const data = props.data;

		const x = props.xScale(props.data.key);
		const y0 = props.availableHeight - props.yScale(props.yBaseValue);
		const width = props.xScale.bandwidth();

		let highlighted = false;
		if (this.context && (this.context.hoveredItems || this.context.selectedItems)) {
			let isHovered = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
			let isSelected = !!_.intersection(this.context.selectedItems, this.props.itemKeys).length;
			highlighted = isHovered || isSelected;
		}

		return (
			<g transform={`translate(${x},0)`}
			   className="ptr-column-chart-bar-group"
			   onMouseOver={this.onMouseOver}
			   onMouseMove={this.onMouseMove}
			   onMouseOut={this.onMouseOut}
			>
				{this.renderPlaceholder(width, highlighted)}
				{data.positive.total || data.positive.total === 0 ? (
					<g transform={`scale(1,-1) translate(0,-${props.availableHeight})`}>
						{this.renderPositiveBars(data.positive.data, data.positive.total, y0, width)}
					</g>
				) : null}
				{data.negative.total || data.negative.total === 0 ? (
					<g>
						{this.renderNegativeBars(data.negative.data, data.negative.total, width)}
					</g>
				) : null}
				{props.baseline ? this.renderBaseline(props.availableHeight - y0, width) : null}
			</g>
		);
	}

	renderPlaceholder(width, visible) {
		let classes = classnames("ptr-column-chart-bar-placeholder", {
			visible
		});

		return (
			<rect className={classes}
				  y={0}
				  x={0}
				  width={width}
				  height={this.props.availableHeight}
			/>
		);
	}

	renderPositiveBars(data, total, y0, barWidth) {
		const props = this.props;
		let bars = [];
		let transitionDelay = ANIMATION_DELAY;

		_.forEach(data, (item, index) => {
			let height = props.yScale(props.yBaseValue) - props.yScale(item.value);
			let transitionDuration = Math.abs(((item.value - props.yBaseValue)*ANIMATION_DURATION)/(props.maximum - props.yBaseValue));

			bars.push(this.renderBar(index, item, y0, height, barWidth, transitionDuration, transitionDelay));

			y0 += height;
			transitionDelay += transitionDuration;
		});

		return bars;
	}

	renderNegativeBars(data, total, barWidth) {
		const props = this.props;

		let y0 = props.yScale(props.yBaseValue);
		let bars = [];
		let transitionDelay = ANIMATION_DELAY;

		_.forEach(data, (item, index) => {
			let height = props.yScale(item.value) - props.yScale(props.yBaseValue);
			let transitionDuration = Math.abs(((item.value - props.yBaseValue)*ANIMATION_DURATION)/(props.yBaseValue - props.minimum));

			bars.push(this.renderBar(index, item, y0, height, barWidth, transitionDuration, transitionDelay));

			y0 += height;
			transitionDelay += transitionDuration;
		});

		return bars;
	}

	renderBar(index, data, y, height, width, transitionDuration, transitionDelay) {
		const props = this.props;
		return (
			<Bar
				key={props.data.key + '-' + index}
				itemKeys={this.props.itemKeys}
				data={data}
				originalData={props.originalData}
				name={props.data.name}
				x={0}
				y={y}
				height={height}
				width={width}
				defaultColor={data.defaultColor || props.defaultColor}
				highlightColor={data.highlightColor || props.highlightColor}
				highlighted={this.state.highlighted}
				attributeName={props.attributeName}
				attributeUnits={props.attributeUnits}
				hidden={props.hidden}
				transitionDuration={transitionDuration}
				transitionDelay={transitionDelay}
				classes={classnames("", {
					'stacked-relative': props.stacked === "relative"
				})}
			/>
		);
	}

	renderBaseline(y, width) {
		return (
			<polyline
				className="ptr-column-chart-bar-baseline"
				points={`${0},${y} ${width},${y}`}
			/>
		);
	}

	getPopupContent() {
		const props = this.props;
		const data = props.originalData;

		let attributeName = props.attributeName;
		let units = props.attributeUnits;

		if (_.isArray(props.originalData)) {
			return (
				<>
					{attributeName ? <div className="ptr-popup-header">{attributeName}</div> : null}
					{props.originalData.map(record => {
						// TODO what if more values?
						let positive = record.positive.data[0];
						let negative = record.negative.data[0];
						let value = null;
						if (positive && (positive.value || positive.value === 0)) {
							value = positive.value;
						} else if (negative && (negative.value || negative.value === 0)) {
							value = negative.value;
						}

						let valueString = value;
						if ((value % 1) !== 0) {
							valueString = valueString.toFixed(2);
						}

						return (
							<div key={record.name} className="ptr-popup-record-value-group">
								{<span className="name">{record.name}:</span>}
								{valueString || valueString === 0 ? <span className="value">{valueString.toLocaleString()}</span> : null}
								{units ? <span className="unit">{units}</span> : null}
							</div>
						);

					})}
				</>
			);

		} else {
			let columnName = props.data.name;
			let color = props.highlightColor;

			// change order
			let positiveData = _.reverse(_.cloneDeep(data.positive.data));

			return (
				<>
					<div className="ptr-popup-header">{columnName}</div>
					{positiveData.map((record, index) => {
						return this.getPopupRecordGroup(record, attributeName, units, color, index)
					})}
					{data.negative.data.map((record, index) => {
						return this.getPopupRecordGroup(record, attributeName, units, color, index)
					})}
				</>
			);
		}
	}

	getPopupRecordGroup(record, attributeName, attributeUnits, color, index) {
		let style = {};
		let attribute = record.name || attributeName;

		if (record.highlightColor || record.defaultColor) {
			color = record.highlightColor || record.defaultColor;
		}

		if (color) {
			style.background = color;
		}

		let valueString = record.value;
		if ((record.value % 1) !== 0) {
			valueString = valueString.toFixed(2);
		}


		return (
			<React.Fragment key={index}>
				{(valueString || valueString === 0) ? <div className="ptr-popup-record-group">
					<div className="ptr-popup-record-color" style={style}></div>
					<div className="ptr-popup-record">
						{attribute ? <div className="ptr-popup-record-attribute">{attribute}</div> : null}
						<div className="ptr-popup-record-value-group">
							{(valueString || valueString === 0) ? <span className="value">{valueString.toLocaleString()}</span> : null}
							{attributeUnits ? <span className="unit">{attributeUnits}</span> : null}
						</div>
					</div>
				</div> : null}
			</React.Fragment>
		);
	}
}

export default BarGroup;


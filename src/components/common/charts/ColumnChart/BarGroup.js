import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import HoverContext from "../../../common/HoverHandler/context";
import Bar from "./Bar";

import './style.scss';

const ANIMATION_DURATION = 1500;
const ANIMATION_DELAY = 1000;

class BarGroup extends React.PureComponent {

	static contextType = HoverContext;

	static propTypes = {
		data: PropTypes.object,
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
		hidden: PropTypes.bool
	};

	constructor(props) {
		super(props);

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
	}

	onMouseOut(e) {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}
	}


	render() {
		const props = this.props;
		const data = props.data;

		const x = props.xScale(props.data.key);
		const y0 = props.availableHeight - props.yScale(props.yBaseValue);
		const width = props.xScale.bandwidth();

		let highlighted = false;
		if (this.context && this.context.hoveredItems) {
			highlighted = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
		}

		return (
			<g transform={`translate(${x},0)`}
			   className="ptr-column-chart-bar-group"
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
				  onMouseOver={this.onMouseOver}
				  onMouseMove={this.onMouseMove}
				  onMouseOut={this.onMouseOut}
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
			console.log(index, transitionDelay, transitionDuration);
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
				name={props.data.name}
				x={0}
				y={y}
				height={height}
				width={width}
				defaultColor={data.defaultColor || props.defaultColor}
				highlightColor={data.highlightColor || props.highlightColor}
				attributeName={props.attributeName}
				attributeUnits={props.attributeUnits}
				hidden={props.hidden}
				transitionDuration={transitionDuration}
				transitionDelay={transitionDelay}
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
		return (
			<div>
				<i>{this.props.data.name}</i>
			</div>
		);
	}
}

export default BarGroup;


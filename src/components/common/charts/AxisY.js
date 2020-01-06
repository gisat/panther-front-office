import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import AxisLabel from "./AxisLabel";

const TICK_SIZE = 5; // TODO optional?
const TICK_COUNT = 5;
const TICK_CAPTION_OFFSET_VERTICAL = 7;
const TICK_CAPTION_OFFSET_HORIZONTAL = 4;

class AxisY extends React.PureComponent {

	static defaultProps = {
		topPadding: 0,
		leftPadding: 0
	};

	static propTypes = {
		scale: PropTypes.func,

		bottomMargin: PropTypes.number,
		topPadding: PropTypes.number,
		leftPadding: PropTypes.number,
		height: PropTypes.number,
		plotWidth: PropTypes.number,
		labelSize: PropTypes.number,
		width: PropTypes.number,

		hiddenBaseline: PropTypes.bool,
		gridlines: PropTypes.bool,
		ticks: PropTypes.bool,
		withValues: PropTypes.bool,
		label: PropTypes.bool,
		options: PropTypes.object,

		diverging: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),
		stacked: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),
		xScale: PropTypes.func,
		xOptions: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<g className="ptr-column-chart-axis-y" transform={`translate(0,0)`}>
				{props.options && props.options.highlightedArea ? this.renderHighlightedArea() : null}
				{!props.hiddenBaseline ? this.renderBaseline() : null}
				{(props.ticks || props.gridlines || props.withValues) ? this.renderGrid() : null}
				{props.label ? this.renderLabel() : null}
			</g>
		);
	}

	renderBaseline() {
		const props = this.props;

		let xCoord = this.props.width + this.props.labelSize;

		if (props.diverging && props.xOptions && props.xOptions.diversionValue) {
			xCoord += props.xScale(props.xOptions.diversionValue) + props.leftPadding;
		}

		return (
			<path
				className="ptr-axis-baseline"
				d={`M${xCoord} ${this.props.height} L${xCoord} 0`}
			/>
		);
	}

	renderGrid() {
		const props = this.props;
		const tickCount = this.props.options && this.props.options.tickCount ? this.props.options.tickCount : TICK_COUNT;

		let shift = props.ticks ? (TICK_SIZE + TICK_CAPTION_OFFSET_VERTICAL) : TICK_CAPTION_OFFSET_VERTICAL;
		let ticks = props.scale.ticks(tickCount);

		if (props.diverging) {
			let diversionValue = props.options && props.options.diversionValue || 0;
			let notInTicks = _.indexOf(ticks, diversionValue) === -1;
			if (notInTicks) {
				let newTicks = [diversionValue];
				let domain = props.scale.domain();
				let min = domain[0];
				let max = domain[1];
				let step = Math.abs(ticks[0] - ticks[1]);
				for (let i = (diversionValue + step); i < max; i+=step) {
					newTicks.push(i);
				}
				for (let j = (diversionValue - step); j > min; j-=step) {
					newTicks.unshift(j);
				}
				ticks = newTicks;
			}
		}

		return (
			<g className="ptr-axis-grid" transform={`translate(${props.width + props.labelSize - shift},${props.topPadding })`}>
				{ticks.map(value => {
					let yCoord = props.scale(value);

					return (
						(yCoord || yCoord === 0) ? (
							<g key={value}>
								<line
									className="ptr-axis-gridline"
									x1={TICK_CAPTION_OFFSET_VERTICAL}
									x2={props.gridlines ? (props.plotWidth  + shift) : shift}
									y1={yCoord}
									y2={yCoord}
								/>
								{props.withValues ? (
									<g
										transform={`
											translate(0 ${yCoord + TICK_CAPTION_OFFSET_HORIZONTAL})
										`}
									>
										<AxisLabel
											classes="ptr-tick-caption"
											maxWidth={props.width}
											maxHeight={props.height/ticks.length}
											text={value.toLocaleString()}
											textAnchor="end"
										/>
									</g>
								) : null}
							</g>
						) : null
					)
				})}
			</g>
		);
	}

	renderLabel() {
		const props = this.props;
		let content = "";

		if (props.options) {
			if (props.options.name) {
				content += props.options.name;
			}

			if (props.options.unit || props.stacked === "relative") {
				let unit = props.options.unit;
				if (props.stacked === "relative") {
					unit = "%";
				}

				content += " (" + unit + ")"
			}

		} else {
			content = "Axis Y";
		}

		return (
			<g transform={`
						translate(13 ${props.height/2})
						rotate(270)
					`}>
				{/*<text className="ptr-axis-label" textAnchor="middle">{content}</text>*/}
				<AxisLabel
					classes="ptr-axis-label"
					maxWidth={props.height}
					maxHeight={25}
					text={content}
					textAnchor="middle"
				/>
			</g>
		);
	}

	renderHighlightedArea() {
		const props = this.props;
		let shift = props.ticks ? (TICK_SIZE + TICK_CAPTION_OFFSET_VERTICAL) : TICK_CAPTION_OFFSET_VERTICAL;
		let options = props.options.highlightedArea;

		let domain = props.scale.domain();
		let min = domain[0] > options.from ? domain[0] : options.from;
		let max = domain[1] < options.to ? domain[1] : options.to;


		let x1 = TICK_CAPTION_OFFSET_VERTICAL;
		let x2 = props.gridlines ? (props.plotWidth + shift) : props.plotWidth;
		let yMin = props.scale(min);
		let yMax = props.scale(max);

		return (
			<g className="ptr-axis-grid" transform={`translate(${props.width + props.labelSize - shift},${props.topPadding })`}>
				<path
					className="ptr-axis-highlighted-area"
					d={`M${x1},${yMin} L${x1},${yMax} L${x2},${yMax} L${x2},${yMin}`}
				/>
				{min === options.from ? (
					<line
						className="ptr-axis-highlighted-area-edge"
						x1={x1}
						x2={x2}
						y1={yMin}
						y2={yMin}
					/>
				) : null}
				{max === options.to ? (
					<line
						className="ptr-axis-highlighted-area-edge"
						x1={x1}
						x2={x2}
						y1={yMax}
						y2={yMax}
					/>
				) : null}
			</g>
		);
	}
}

export default AxisY;


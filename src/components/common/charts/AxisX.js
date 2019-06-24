import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import AxisCaption from "./AxisCaption";

const TICK_SIZE = 5; // TODO optional?
const TICK_COUNT = 10;
const TICK_CAPTION_OFFSET_TOP = 10;
const TICK_CAPTION_OFFSET_LEFT = 5;

class AxisX extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		scale: PropTypes.func,
		sourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,

		leftMargin: PropTypes.number,
		leftPadding: PropTypes.number,
		plotHeight: PropTypes.number,
		labelSize: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,

		gridlines: PropTypes.bool,
		ticks: PropTypes.bool,
		withCaption: PropTypes.bool,
		label: PropTypes.bool,
		options: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<g className="ptr-column-chart-axis-x" transform={`translate(${props.leftMargin},0)`}>
				<path
					className="ptr-axis-baseline"
					d={`M0 ${props.plotHeight} L${props.width} ${props.plotHeight}`}
				/>
				{(props.ticks || props.gridlines || props.withCaption) ? this.renderGrid() : null}
				{props.label ? this.renderLabel() : null}
			</g>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE) : 0;

		if (this.props.data) {
			return this.renderOrdinalGrid(shift);
		} else {
			return this.renderLinearGrid(shift);
		}
	}

	renderLinearGrid(shift) {
		let ticks = this.props.scale.ticks(TICK_COUNT);
		let availableHeight = this.props.width/ticks.length;

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.leftPadding}, 0)`}>
				{ticks.map(value => {
					let xCoord = this.props.scale(value);
					if (xCoord || xCoord === 0) {
						return (
							<g key={value}>
								<line
									className="ptr-axis-gridline"
									x1={xCoord}
									x2={xCoord}
									y1={this.props.plotHeight + shift}
									y2={this.props.gridlines ? 0 : this.props.plotHeight}
								/>
								{this.props.withCaption ? this.renderCaption(xCoord, shift, availableHeight, value.toLocaleString()) : null}
							</g>
						);
					} else {
						return null;
					}
				})}
			</g>
		);
	}

	renderOrdinalGrid(shift) {
		let barWidth = this.props.scale.bandwidth();
		let gap = 2*barWidth*this.props.scale.padding();

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.leftPadding + barWidth/2}, 0)`}>
				{this.props.data.map(item => {
					let xValue = item;
					let xValueFromObject = _.get(item, this.props.keySourcePath);

					if (_.isObject(xValue) && this.props.keySourcePath) {
						xValue = xValueFromObject;
					}

					let xCoord = this.props.scale(xValue);
					if (xCoord || xCoord === 0) {
						let key =  (this.props.keySourcePath && xValueFromObject) || item;
						let text = item;
						let textFromObject = _.get(item, this.props.sourcePath);

						if (this.props.sourcePath && textFromObject) {
							text = textFromObject;
						}

						return (
							<g key={key}>
								<line
									className="ptr-axis-gridline"
									x1={xCoord}
									x2={xCoord}
									y1={this.props.plotHeight + shift}
									y2={this.props.gridlines ? 0 : this.props.plotHeight}
								/>
								{this.props.withCaption ? this.renderCaption(xCoord, shift, barWidth + gap, text) : null}
							</g>
						);
					} else {
						return null;
					}
				})}
			</g>
		);
	}

	renderCaption(x, yShift, availableHeight, text) {
		if (availableHeight > 18) {
			return (
				<g
					transform={`
						rotate(-45 ${x + TICK_CAPTION_OFFSET_LEFT} ${this.props.plotHeight + yShift + TICK_CAPTION_OFFSET_TOP})
						translate(${x + TICK_CAPTION_OFFSET_LEFT} ${this.props.plotHeight + yShift + TICK_CAPTION_OFFSET_TOP})
					`}
				>
					<AxisCaption
						maxWidth={((this.props.height  - yShift - TICK_CAPTION_OFFSET_TOP) * Math.sqrt(2))}
						maxHeight={availableHeight}
						text={text}
						textAnchor="end"
					/>
				</g>
			);
		} else {
			return null;
		}
	}

	renderLabel() {
		const props = this.props;
		let content = "";

		if (props.options) {
			if (props.options.name) {
				content += props.options.name;
			}

			if (props.options.unit) {
				content += " (" + props.options.unit + ")"
			}

		} else {
			content = "Axis X";
		}

		return (
			<g
				transform={`
						translate(${props.width/2} ${props.plotHeight + props.height + props.labelSize - 3})
					`}
			>
				<text className="ptr-axis-label" textAnchor="middle">{content}</text>
			</g>
		);
	}
}

export default AxisX;


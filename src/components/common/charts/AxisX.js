import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/cs';

import './style.scss';
import AxisLabel from "./AxisLabel";

const TICK_SIZE = 5; // TODO optional?
const MIN_TICK_COUNT = 5;
const MAX_TICK_COUNT = 10;
const TICK_CAPTION_OFFSET_TOP = 10;
const TICK_CAPTION_OFFSET_LEFT = 5;

class AxisX extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		scale: PropTypes.func,
		scaleType: PropTypes.string,
		sourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,

		leftMargin: PropTypes.number,
		leftPadding: PropTypes.number,
		topPadding: PropTypes.number,
		plotHeight: PropTypes.number,
		labelSize: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,

		gridlines: PropTypes.bool,
		ticks: PropTypes.bool,
		withValues: PropTypes.bool,
		label: PropTypes.bool,
		options: PropTypes.object,

		diverging: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),
		yScale: PropTypes.func,
		yOptions: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<g className="ptr-column-chart-axis-x" transform={`translate(${props.leftMargin},0)`}>
				{this.renderBaseline()}
				{(props.ticks || props.gridlines || props.withValues) ? this.renderGrid() : null}
				{props.label ? this.renderLabel() : null}
			</g>
		);
	}

	renderBaseline() {
		const props = this.props;

		let yCoord = props.plotHeight;

		if (props.diverging) {
			yCoord = props.yScale(props.yOptions && props.yOptions.diversionValue ? props.yOptions.diversionValue : 0) + props.topPadding;
		}

		return (
			yCoord || yCoord === 0 ? (
				<path
					className="ptr-axis-baseline"
					d={`M0 ${yCoord} L${props.width} ${yCoord}`}
				/>
			) : null
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE) : 0;

		if (this.props.scaleType === 'ordinal') {
			return this.renderOrdinalGrid(shift);
		} else if (this.props.scaleType === 'linear') {
			return this.renderLinearGrid(shift);
		} else if (this.props.scaleType === 'time') {
			return this.renderLinearGrid(shift);
		}
	}

	renderLinearGrid(shift) {
		let ticks = this.props.scale.ticks(this.props.width > 300 ? MAX_TICK_COUNT : MIN_TICK_COUNT);
		let availableHeight = (this.props.width/ticks.length)/Math.sqrt(2);

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.leftPadding}, 0)`}>
				{ticks.map(value => {
					let xCoord = this.props.scale(value);
					let text = value;
					if (this.props.scaleType !== 'time') {
						text = value.toLocaleString();
					}

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
								{this.props.withValues ? this.renderValueLabel(null, xCoord, shift, availableHeight, text) : null}
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
		const props = this.props;
		const options = props.options;

		let scale = props.scale;
		let data = [];

		if (options && (options.startingTick || options.tickStep)) {
			let start = 0;
			let step = 1;

			if (options.startingTick) {
				start = options.startingTick;
			}
			if (options.tickStep) {
				step = options.tickStep;
			}

			for (let i = start; i<= props.data.length; i+=step) {
				data.push(props.data[i]);
			}

			scale = props.scale.domain(data);


		} else {
			data = props.data;

		}

		let barWidth = scale.bandwidth();
		let gap = scale.padding()*barWidth;

		return (
			<g className="ptr-axis-grid" transform={`translate(${props.leftPadding + barWidth/2}, 0)`}>
				{data.map(item => {
					let key = item;
					let name = item;

					if (_.isObject(item)) {
						key = item.key || _.get(item, props.keySourcePath);
						name = item.name || _.get(item, props.nameSourcePath);
					}

					let xCoord = props.scale(key);
					if (xCoord || xCoord === 0) {
						return (
							<g key={key}>
								<line
									className="ptr-axis-gridline"
									x1={xCoord}
									x2={xCoord}
									y1={props.plotHeight + shift}
									y2={props.gridlines ? 0 : props.plotHeight}
								/>
								{props.withValues ? this.renderValueLabel(key, xCoord, shift, barWidth + gap, name, item) : null}
							</g>
						);
					} else {
						return null;
					}
				})}
			</g>
		);
	}

	renderValueLabel(key, x, yShift, availableHeight, text, originalData) {
		let finalY = this.props.plotHeight + yShift + TICK_CAPTION_OFFSET_TOP;
		let maxHeight = ((this.props.height  - yShift - TICK_CAPTION_OFFSET_TOP) * Math.sqrt(2));

		if (this.props.scaleType === 'time') {
			let time = moment(text);
			if (this.props.options){
				if (this.props.options.timeValueLanguage) {
					time = time.locale(this.props.options.timeValueLanguage)
				}

				if (this.props.options.axisValueFormat) {
					time = time.format(this.props.options.axisValueFormat);
				} else {
					time = time.format();
				}
			}
			text = time;
		}

		if (this.props.options && this.props.options.valueLabelRenderer) {
			// TODO fix available width
			return this.props.options.valueLabelRenderer(x, finalY, availableHeight, maxHeight, text, originalData);
		} else if (availableHeight > 15) {
			return (
				<g
					transform={`
						rotate(-45 ${x + TICK_CAPTION_OFFSET_LEFT} ${finalY})
						translate(${x + TICK_CAPTION_OFFSET_LEFT} ${finalY})
					`}
				>
					<AxisLabel
						originalDataKey={key}
						classes="ptr-tick-caption"
						maxWidth={maxHeight}
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
				<AxisLabel
					classes="ptr-axis-label"
					maxWidth={props.width}
					maxHeight={25}
					text={content}
					textAnchor="middle"
				/>
			</g>
		);
	}
}

export default AxisX;


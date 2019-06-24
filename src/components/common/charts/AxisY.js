import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

const TICK_SIZE = 5; // TODO optional?
const TICK_COUNT = 5; // TODO optional?
const TICK_CAPTION_OFFSET_VERTICAL = 7;
const TICK_CAPTION_OFFSET_HORIZONTAL = 4;

class AxisY extends React.PureComponent {

	static defaultProps = {
		topPadding: 0
	};

	static propTypes = {
		scale: PropTypes.func,

		bottomMargin: PropTypes.number,
		topPadding: PropTypes.number,
		height: PropTypes.number,
		plotWidth: PropTypes.number,
		labelSize: PropTypes.number,
		width: PropTypes.number,

		hiddenBaseline: PropTypes.bool,
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
			<g className="ptr-column-chart-axis-y" transform={`translate(0,0)`}>
				{!props.hiddenBaseline ? this.renderBaseline() : null}
				{(props.ticks || props.gridlines || props.withCaption) ? this.renderGrid() : null}
				{props.label ? this.renderLabel() : null}
			</g>
		);
	}

	renderBaseline() {
		return (
			<path
				className="ptr-axis-baseline"
				d={`M${this.props.width + this.props.labelSize} ${this.props.height} L${this.props.width + this.props.labelSize} 0`}
			/>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE + TICK_CAPTION_OFFSET_VERTICAL) : TICK_CAPTION_OFFSET_VERTICAL;
		let ticks = this.props.scale.ticks(TICK_COUNT);
		let topPadding = this.props.topPadding ? this.props.topPadding : 0;

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.width + this.props.labelSize - shift},${topPadding})`}>
				{ticks.map(value => {
					let yCoord = this.props.scale(value);

					// avoid too top grid lines
					if (yCoord > 5) {
						return (
							<g key={value}>
								<line
									className="ptr-axis-gridline"
									x1={TICK_CAPTION_OFFSET_VERTICAL}
									x2={this.props.gridlines ? (this.props.plotWidth  + shift) : TICK_SIZE}
									y1={yCoord}
									y2={yCoord}
								/>
								{this.props.withCaption ? (
									<text
										className="ptr-tick-caption"
										textAnchor="end"
										x={0}
										y={yCoord + TICK_CAPTION_OFFSET_HORIZONTAL}
									>
										{value.toLocaleString()}
									</text>
								) : null}
							</g>
						)
					} else {
						return null;
					}
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

			if (props.options.unit) {
				content += " (" + props.options.unit + ")"
			}

		} else {
			content = "Axis Y";
		}

		return (
			<text
				transform={`
						translate(15 ${props.height/2})
						rotate(270)
					`} className="ptr-axis-label" textAnchor="middle">{content}</text>
		);
	}
}

export default AxisY;


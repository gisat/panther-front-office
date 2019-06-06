import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import AxisLabel from "./AxisLabel";

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
		height: PropTypes.number,
		plotWidth: PropTypes.number,
		width: PropTypes.number,

		hiddenBaseline: PropTypes.bool,
		gridlines: PropTypes.bool,
		ticks: PropTypes.bool,
		withCaption: PropTypes.bool
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
			</g>
		);
	}

	renderBaseline() {
		return (
			<path
				className="ptr-axis-baseline"
				d={`M${this.props.width} ${this.props.height} L${this.props.width} 0`}
			/>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE + TICK_CAPTION_OFFSET_VERTICAL) : TICK_CAPTION_OFFSET_VERTICAL;
		let ticks = this.props.scale.ticks(TICK_COUNT);

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.width - shift},0)`}>
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
}

export default AxisY;


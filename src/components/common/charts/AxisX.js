import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import AxisLabel from "./AxisLabel";

const TICK_SIZE = 5; // TODO optional?
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
		height: PropTypes.number,
		width: PropTypes.number,

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
			<g className="ptr-column-chart-axis-x" transform={`translate(${props.leftMargin},0)`}>
				<path
					className="ptr-axis-baseline"
					d={`M0 ${props.plotHeight} L${props.width} ${props.plotHeight}`}
				/>
				{(props.ticks || props.gridlines || props.withCaption) ? this.renderGrid() : null}
			</g>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE) : 0;
		let barWidth = this.props.scale.bandwidth();
		let gap = 2*barWidth*this.props.scale.padding();

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.leftPadding + barWidth/2}, 0)`}>
				{this.props.data.map(item => {
					let xCoord = this.props.scale(_.get(item, this.props.keySourcePath));
					if (xCoord || xCoord === 0) {
						return (
							<g key={_.get(item, this.props.keySourcePath)}>
								<line
									className="ptr-axis-gridline"
									x1={xCoord}
									x2={xCoord}
									y1={this.props.plotHeight + shift}
									y2={this.props.gridlines ? 0 : this.props.plotHeight}
								/>
								{this.props.withCaption ? this.renderCaption(xCoord, shift, barWidth + gap, _.get(item, this.props.sourcePath)) : null}
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
					<AxisLabel
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
}

export default AxisX;


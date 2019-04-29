import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

const TICK_SIZE = 5; // TODO optional?

class AxisX extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		scale: PropTypes.func,
		sourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,

		leftMargin: PropTypes.number,
		topMargin: PropTypes.number,
		leftPadding: PropTypes.number,
		plotHeight: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,

		gridlines: PropTypes.bool,
		ticks: PropTypes.bool
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<g className="ptr-column-chart-axis-x" transform={`translate(${props.leftMargin},${props.topMargin})`}>
				<path
					className="ptr-axis-baseline"
					d={`M0 ${props.plotHeight} L${props.width} ${props.plotHeight}`}
				/>
				{(props.ticks || props.gridlines) ? this.renderGrid() : null}
				{/*<text className="ptr-svg-text" x={0} y={325} transform="rotate(-45)">Caption</text>*/}
			</g>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? (TICK_SIZE) : 0;
		let barWidth = this.props.scale.bandwidth();

		return (
			<g className="ptr-axis-grid" transform={`translate(${this.props.leftPadding + barWidth/2}, 0)`}>
				{this.props.data.map(item => {
					let xCoord = this.props.scale(item[this.props.keySourcePath]);
					if (xCoord) {
						return (
							<line
								key={item[this.props.keySourcePath]}
								className="ptr-axis-gridline"
								x1={xCoord}
								x2={xCoord}
								y1={this.props.plotHeight + shift}
								y2={this.props.gridlines ? 0 : this.props.plotHeight}
							/>
						);
					} else {
						return null;
					}
				})}
			</g>
		);
	}
}

export default AxisX;


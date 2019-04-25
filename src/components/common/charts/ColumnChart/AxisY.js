import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';

const TICK_SIZE = 5; // TODO optional?
const MIN_TICK_GAP = 20; // TODO optional?
const TICK_COUNT = 5; // TODO optional?

class AxisY extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		scale: PropTypes.func,
		sourceName: PropTypes.string,

		bottomMargin: PropTypes.number,
		height: PropTypes.bool,
		plotWidth: PropTypes.number,
		width: PropTypes.number,

		hiddenBaseline: PropTypes.bool,
		gridlines: PropTypes.bool,
		ticks: PropTypes.bool
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<g className="ptr-column-chart-axis-y">
				{!props.hiddenBaseline ? this.renderBaseline() : null}
				{(props.ticks || props.gridlines) ? this.renderGrid() : null}
			</g>
		);
	}

	renderBaseline() {
		return (
			<path
				className="ptr-column-chart-axis-y-line"
				d={`M${this.props.width} ${this.props.height} L${this.props.width} 0`}
			/>
		);
	}

	renderGrid() {
		let shift = this.props.ticks ? TICK_SIZE : 0;
		let ticks = this.props.scale.ticks(TICK_COUNT);

		return (
			<g transform={`translate(${this.props.width - shift},0)`}>
				{ticks.map(value => {
					let yCoord = this.props.scale(value);

					// avoid too top grid lines
					if (yCoord > 20) {
						return (<line
							className="ptr-column-chart-axis-gridline"
							x1={0}
							x2={this.props.gridlines ? (this.props.plotWidth  + shift) : TICK_SIZE}
							y1={yCoord}
							y2={yCoord}
						/>)
					} else {
						return null;
					}
				})}
			</g>
		);
	}
}

export default AxisY;


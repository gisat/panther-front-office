import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';

class AxisX extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
		scale: PropTypes.func,
		sourceName: PropTypes.string,

		leftMargin: PropTypes.number,
		topMargin: PropTypes.number,
		plotHeight: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number
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
			</g>
		);
	}
}

export default AxisX;


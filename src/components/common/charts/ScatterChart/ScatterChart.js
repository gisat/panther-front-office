import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import utils from "../../../../utils/sort";

import AxisX from '../AxisX';
import AxisY from "../AxisY";
import utilsFilter from "../../../../utils/filter";

import './style.scss';

class ScatterChart extends React.PureComponent {
	static defaultProps = {
		width: 500,
		height: 300
	};

	static propTypes = {
		data: PropTypes.array,

		height: PropTypes.number,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width;
		let height = props.height;


		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-scatter-chart" width={width} height={height}>

				</svg>
			</div>
		);
	}
}

export default ScatterChart;


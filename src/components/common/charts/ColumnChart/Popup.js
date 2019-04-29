import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';

const WIDTH = 250;

class Popup extends React.PureComponent {

	static propTypes = {
		x: PropTypes.number,
		y: PropTypes.number,
		maxX: PropTypes.number,
	};

	constructor(props) {
		super(props);
	}

	render() {
		let x = this.props.x + 15;

		// positioning
		if ((x + WIDTH) > this.props.maxX) {
			x = this.props.x - WIDTH - 5;
		}

		if (x < 0) {
			x = this.props.x - WIDTH/2;
		}

		let style = {
			top: this.props.y + 15,
			left: x,
			width: WIDTH
		};

		return (
			<div style={style} className={"ptr-chart-popup"}>
				{this.props.children}
			</div>
		);
	}
}

export default Popup;


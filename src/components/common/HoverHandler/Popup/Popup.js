import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

const WIDTH = 250;
const HEIGHT = 50;

class Popup extends React.PureComponent {

	static propTypes = {
		x: PropTypes.number,
		y: PropTypes.number,
		maxX: PropTypes.number,
		content: PropTypes.element
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	render() {
		let maxX = window.innerWidth;
		let maxY = window.innerHeight;
		let x = this.props.x + 15;
		let y = this.props.y + 20;

		let width = this.ref.current && this.ref.current.offsetWidth ? this.ref.current.offsetWidth : WIDTH;
		let height = this.ref.current && this.ref.current.offsetHeight ? this.ref.current.offsetHeight : HEIGHT;

		// positioning
		if ((x + width) > (maxX - 5)) {
			x = this.props.x - width - 5;
		}

		if (x < 0) {
			x = 0;
		}

		// positioning
		if ((y + height) > (maxY - 5)) {
			y = this.props.y - height - 5;
		}

		if (y < 0) {
			y = 0;
		}

		// TODO calculate y

		let style = {
			top: y,
			left: x,
			width
		};

		return (
			<div style={style} className={"ptr-popup"} ref={this.ref}>
				{this.props.content ? React.cloneElement(this.props.content) : this.props.children}
			</div>
		);
	}
}

export default Popup;


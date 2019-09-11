import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
		content: PropTypes.element,
		compressed: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	render() {
		// TODO solve popup positioning properly
		const maxX = window.innerWidth - 20;
		const minX = 0;

		const maxY = window.innerHeight + window.pageYOffset - 20;
		const minY = window.pageYOffset;

		const maxWidth = maxX - 20;
		const maxHeight = (maxY - minY) - 20;

		let x = this.props.x + 15;
		let y = this.props.y + 20;

		let width = this.ref.current && this.ref.current.offsetWidth ? this.ref.current.offsetWidth : WIDTH;
		let height = this.ref.current && this.ref.current.offsetHeight ? this.ref.current.offsetHeight : HEIGHT;

		// size
		if (this.props.compressed || (height > maxHeight)) {
			width = 500;
		}

		if (width > maxWidth) {
			width = maxWidth;
		}

		// positioning
		if ((x + width) > maxX) {
			x = this.props.x - width - 10;
		}

		if (x < minX) {
			x = minX;
		}

		if ((y + height) > maxY) {
			y = this.props.y - height - 10;
		}

		if (y < minY && minY < maxY - height) {
			y = maxY - height;
		}

		if (y < 0) {
			y = 0;
		}

		let style = {
			top: y,
			left: x,
			width
		};

		let classes = classnames("ptr-popup", {
			'compressed': this.props.compressed
		});

		return (
			<div style={style} className={classes} ref={this.ref}>
				{this.props.content ? React.cloneElement(this.props.content) : this.props.children}
			</div>
		);
	}
}

export default Popup;


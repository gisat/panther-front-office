import React from 'react';
import PropTypes from 'prop-types';
import {getTootlipPosition} from '../position';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

const WIDTH = 250;
const HEIGHT = 50;
const TOOLTIP_PADDING = 15;

const getTooltipStyle = () => {
	// bbox for tooltip default defined by window
	const windowScrollTop = window.document.documentElement.scrollTop;
	const windowScrollLeft = window.document.documentElement.scrollLeft;
	const windowHeight = window.document.documentElement.clientHeight;
	const windowWidth = window.document.documentElement.clientWidth;
	const windowBBox = [windowScrollTop, windowScrollLeft + windowWidth, windowScrollTop + windowHeight, windowScrollLeft];

	return getTootlipPosition('corner', ['right', 'left', 'top', 'bottom'], windowBBox, TOOLTIP_PADDING);
}

class Popup extends React.PureComponent {

	static propTypes = {
		x: PropTypes.number,
		y: PropTypes.number,
		maxX: PropTypes.number,
		content: PropTypes.element,
		getStyle: PropTypes.func,
		hoveredElemen: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.object,
		  ]),
		  compressed: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	render() {
		let posX = this.props.x;
		let posY = this.props.y;
		let maxX = window.innerWidth;
		let maxY = window.innerHeight + window.pageYOffset;
		let minY = window.pageYOffset;
		const maxWidth = maxX - 20;
		const maxHeight = (maxY - minY) - 20;
		// let x = this.props.x + 15;
		// let y = this.props.y + 20;

		let width = this.ref.current && this.ref.current.offsetWidth ? this.ref.current.offsetWidth : WIDTH;
		let height = this.ref.current && this.ref.current.offsetHeight ? this.ref.current.offsetHeight : HEIGHT;

		let style = null;
		// positioning
		// if ((x + width) > (maxX - 20)) {
		// 	x = this.props.x - width - 10;
		// }

		// if (x < 0) {
		// 	x = 0;
		// }

		// if ((y + height) > (maxY - 20)) {
		// 	y = this.props.y - height - 10;
		// }

		// if (y < minY && minY < maxY - height) {
		// 	y = maxY - height;
		// }

		if(typeof this.props.getStyle === 'function' && this.props.hoveredElemen) {
			style = this.props.getStyle()(posX, posY, width, height, this.props.hoveredElemen);
		} else {
			//right corner on mouse position
			style = getTooltipStyle()(posX, posY, width, height);

		}

		if (this.props.compressed || (height > maxHeight)) {	
			width = 500;	
		}	

		if (width > maxWidth) {	
			width = maxWidth;	
		}

		// let style = {
		// 	top: y,
		// 	left: x,
		// 	width
		// };

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


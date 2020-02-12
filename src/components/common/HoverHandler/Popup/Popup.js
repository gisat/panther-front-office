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

	getStyle() {
		let posX = this.props.x;
		let posY = this.props.y;
		let maxX = window.innerWidth;
		let maxY = window.innerHeight + window.pageYOffset;
		let minY = window.pageYOffset;
		const maxWidth = maxX - 20;
		const maxHeight = (maxY - minY) - 20;

		const element = this.ref.current && this.ref.current.children[0];
		let width = element && element.offsetWidth ? element.offsetWidth : WIDTH;
		let height = element && element.offsetHeight ? element.offsetHeight : HEIGHT;

		let style = null;

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
		return (element && element.offsetWidth !== 0 && element.offsetHeight !== 0) ? {...style} : {...style, position:'absolute', overfloat: 'auto'};
	}

	componentDidMount() {
		// autofocus the input on mount
		if(true && this.ref && this.ref.current) {
			const style = this.getStyle();
			this.ref.current.style = style;
		}
	}

	render() {
		const style = this.getStyle();

		let classes = classnames("ptr-popup", {
			'compressed': this.props.compressed
		});

		if(this.ref && !this.ref.current) {
			style.display = 'none';
		}

		return (
			<div ref={this.ref} className={classes}>
				<div style={style} className={classes}>
					{this.props.content ? React.cloneElement(this.props.content) : this.props.children}
				</div>
			</div>
		);
	}
}

export default Popup;


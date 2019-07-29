import React from 'react';
import PropTypes from 'prop-types';
import {getTootlipPosition} from '../position';

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
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	render() {
		let posX = this.props.x;
		let posY = this.props.y;

		let width = this.ref.current && this.ref.current.offsetWidth ? this.ref.current.offsetWidth : WIDTH;
		let height = this.ref.current && this.ref.current.offsetHeight ? this.ref.current.offsetHeight : HEIGHT;

		let style;

		if(typeof this.props.getStyle === 'function' && this.props.hoveredElemen) {
			style = this.props.getStyle()(posX, posY, width, height, this.props.hoveredElemen);
		} else {
			//right corner on mouse position
			style = getTooltipStyle()(posX, posY, width, height);
		}

		return (
			<div style={style} className={"ptr-popup"} ref={this.ref}>
				{this.props.content ? React.cloneElement(this.props.content) : this.props.children}
			</div>
		);
	}
}

export default Popup;


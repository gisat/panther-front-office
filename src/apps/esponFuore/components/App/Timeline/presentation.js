import React from "react";
import classnames from 'classnames';

import './style.scss';

const BUTTON_WIDTH_WIDE = 3;
const BUTTON_WIDTH_NARROW = 2;
const BUTTON_GAP = .35;

class EsponFuoreTimeline extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			width: null,
			remSize: null
		};

		this.ref = this.ref.bind(this);
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true});
	}

	componentWillUnmount() {
		if (window) window.removeEventListener('resize', this.resize);
	}

	resize() {
		let remSize = null;
		let pxWidth = null;

		// get available width and height
		if (this.el && typeof this.el.clientWidth !== 'undefined') {
			pxWidth = this.el.clientWidth;
		}

		// get current base font size (rem)
		if (document && document.documentElement) {
			remSize = getComputedStyle(document.documentElement).fontSize;
			remSize = Number(remSize.slice(0, -2)); // "16px" -> 16
		}

		if (pxWidth  && remSize) {
			let width = pxWidth/remSize;
			if (width !== this.state.width) {
				this.setState({width, remSize});
			}
		}
	}

	ref(el) {
		this.el = el;
	}

	render() {
		let small = this.props.periods && (this.state.width < ((this.props.periods.length * (BUTTON_WIDTH_WIDE + BUTTON_GAP)) + BUTTON_GAP));

		return (
			<div className="esponFuore-timeline" ref={this.ref}>
				{this.props.periods ? this.renderPeriods(small) : null}
			</div>
		);
	}

	renderPeriods(small) {
		let style = {
			marginRight: BUTTON_GAP * this.state.remSize,
			marginBottom: BUTTON_GAP * this.state.remSize,
			width: (small ? BUTTON_WIDTH_NARROW : BUTTON_WIDTH_WIDE) * this.state.remSize
		};

		return this.props.periods.map(period => {
			let caption = period.data && period.data.nameDisplay;
			if (caption && small) {
				caption = caption.toString().slice(-2);
			}

			return (
				<div className="esponFuore-timeline-period" style={style}>
					{caption}
				</div>
			);
		});
	}
}


export default EsponFuoreTimeline;
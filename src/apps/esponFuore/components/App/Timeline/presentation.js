import React from "react";
import PropTypes from "prop-types";
import classnames from 'classnames';
import _ from 'lodash';

import './style.scss';

const BUTTON_WIDTH_WIDE = 3;
const BUTTON_WIDTH_NARROW = 2;
const BUTTON_GAP = .35;

class EsponFuoreTimeline extends React.PureComponent {
	static propTypes = {
		activePeriodKeys: PropTypes.array,
		onActivePeriodaChange: PropTypes.func,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		periods: PropTypes.array,
	};

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
		this.props.onMount();
	}

	componentWillUnmount() {
		if (window) window.removeEventListener('resize', this.resize);
		this.props.onUnmount();
	}

	onPeriodClick(key) {
		let activePeriods = this.props.activePeriodKeys ? [...this.props.activePeriodKeys] : [];

		if (activePeriods && _.includes(activePeriods, key)) {
			activePeriods = _.without(activePeriods, key);
		} else {
			activePeriods.push(key)
		}

		this.props.onActivePeriodsChange(activePeriods);
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
			let active = _.includes(this.props.activePeriodKeys, period.key);
			let caption = period.data && period.data.nameDisplay;
			if (caption && small) {
				caption = caption.toString().slice(-2);
			}

			let classes = classnames("esponFuore-timeline-period", {
				active
			});

			return (
				<div key={period.key} className={classes} style={style} onClick={this.onPeriodClick.bind(this, period.key)}>
					{caption}
				</div>
			);
		});
	}
}


export default EsponFuoreTimeline;
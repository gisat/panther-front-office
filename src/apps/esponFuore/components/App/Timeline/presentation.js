import React from "react";
import PropTypes from "prop-types";
import classnames from 'classnames';
import _ from 'lodash';

import './style.scss';

const BUTTON_WIDTH_WIDE = 3;
const BUTTON_WIDTH_NARROW = 2;
const BUTTON_GAP = .35;

// todo optional
const MIN_ACTIVE = 1;
const MAX_ACTIVE = 9;

class EsponFuoreTimeline extends React.PureComponent {
	static propTypes = {
		addMap: PropTypes.func,
		activeAttributeKey: PropTypes.string,
		activePeriodKeys: PropTypes.array,
		activeScopeKey: PropTypes.string,
		availablePeriodKeys: PropTypes.array,
		onActivePeriodaChange: PropTypes.func,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		periods: PropTypes.array,
		removeMap: PropTypes.func
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
		if (this.props.activeScopeKey && this.props.activeAttributeKey) {
			this.props.onActiveAttributeChange(this.props.activeAttributeKey, this.props.activeScopeKey);
		}
	}

	componentWillUnmount() {
		if (window) window.removeEventListener('resize', this.resize);
		this.props.onUnmount();
	}

	componentDidUpdate(prevProps) {
		if (this.props.activeScopeKey && this.props.activeAttributeKey &&
			(prevProps.activeAttributeKey !== this.props.activeAttributeKey || prevProps.activeScopeKey !== this.props.activeScopeKey)) {
			this.props.onActiveAttributeChange(this.props.activeAttributeKey, this.props.activeScopeKey);
		}

		if (this.props.savedHeight !== this.el.clientHeight) {
			this.props.saveHeightValue(this.el.clientHeight);
		}
	}

	onPeriodClick(periodKey) {
		let activePeriods = this.props.activePeriodKeys ? [...this.props.activePeriodKeys] : [];

		if (activePeriods && _.includes(activePeriods, periodKey)) {
			activePeriods = _.without(activePeriods, periodKey);
			this.props.removeMap(periodKey);
		} else {
			activePeriods.push(periodKey);
			this.props.addMap(periodKey);
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

		if (this.props.savedHeight !== this.el.clientHeight) {
			this.props.saveHeightValue(this.el.clientHeight);
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

		let numOfActive = this.props.activePeriodKeys && this.props.activePeriodKeys.length;

		return this.props.periods.map(period => {
			if(period) {
				let key = period.key;
				let active = _.includes(this.props.activePeriodKeys, key);
				let caption = period.data && period.data.nameDisplay;
				if (caption && small) {
					caption = caption.toString().slice(-2);
				}

				let available = this.props.availablePeriodKeys && _.includes(this.props.availablePeriodKeys, key);
				let title = available ? null : 'Selected indicator is not available for this period.';
				let disabled = (numOfActive <= MIN_ACTIVE && active) || (numOfActive >= MAX_ACTIVE && !active) || (!available && !active);
	
				let classes = classnames("esponFuore-timeline-period", {
					active,
					disabled,
					unavailable: !available
				});
	
				return (
					<div
						key={period.key}
						className={classes}
						style={style}
						onClick={disabled ? null : this.onPeriodClick.bind(this, period.key)}
						title={title}
					>
						{caption}
					</div>
				);
			} else {
				return null
			}

		});
	}
}


export default EsponFuoreTimeline;
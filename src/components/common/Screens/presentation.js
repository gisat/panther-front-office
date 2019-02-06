import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './style.css';


const RETRACTED_WIDTH = 5;
const CONST_PLUS = 1;

class Screens extends React.PureComponent {

	static propTypes = {
		set: PropTypes.shape({
			orderBySpace: PropTypes.array,
			orderByHistory: PropTypes.array
		}),
		screens: PropTypes.object
	};

	constructor(props){
		super(props);

		this.state = {
			width: null
		};

		this.ref = this.ref.bind(this);
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true}); //todo IE
	}

	componentWillUnmount() {
		if (window) window.removeEventListener('resize', this.resize);
	}

	resize() {
		let remSize = null;
		let pxWidth = null;
		//todo devicePixelRatio?

		// get available width
		if (this.el && typeof this.el.clientWidth !== 'undefined') {
			pxWidth = this.el.clientWidth;
		}

		// get current base font size (rem)
		if (document && document.documentElement) {
			remSize = getComputedStyle(document.documentElement).fontSize;
			remSize = Number(remSize.slice(0, -2)); // "16px" -> 16
		}

		// update available width in rem (if needed)
		if (pxWidth && remSize) {
			let width = pxWidth/remSize;
			if (width !== this.state.width) {
				this.setState({width});
			}
		}
	}

	ref(el) {
		this.el = el;
	}

	render() {
		return (
			<div
				className="ptr-screens"
				ref={this.ref}
			>
				{this.renderScreens()}
			</div>
		);
	}

	renderScreens() {
		if (this.state.width && this.props.set) {
			let screens = {...this.props.screens};
			let history = [...this.props.set.orderByHistory].reverse();

			// add any possible children as first screen
			if (this.props.children) {
				if (!_.find(history, 'base')) {
					history.unshift('base');
				}
				screens['base'] = {lineage: 'base'};
			}

			// compute open screens
			let overallRetractedWidth = history.length * RETRACTED_WIDTH;
			let availableWidthLeft = this.state.width - overallRetractedWidth;

			// check if there is enough space for first open screen
			let maximalizedScreen = null;
			history.forEach(lineage => {
				if (!maximalizedScreen) {
					let screen = screens[lineage];
					if (screen.data && screen.data.desiredState === 'open') {
						// screen does not fit
						if ((screen.data.width + CONST_PLUS) > (availableWidthLeft + RETRACTED_WIDTH)) {
							maximalizedScreen = screen;
						}
					}
				}
			});

			if (!maximalizedScreen) {
				history.forEach(lineage => {
					let screen = screens[lineage];

					if (!availableWidthLeft) {
						screen.computedWidth = RETRACTED_WIDTH;
						screen.computedDisabled = true;
					} else {
						if (screen.data && screen.data.width) {
							if (screen.data.desiredState === 'open') {
								if ((screen.data.width + CONST_PLUS) <= (availableWidthLeft + RETRACTED_WIDTH)) {
									screen.computedWidth = 	screen.data.width + CONST_PLUS;
								} else {
									screen.computedWidth = availableWidthLeft + RETRACTED_WIDTH;
									screen.computedDisabled = true;
								}
								availableWidthLeft -= (screen.computedWidth - RETRACTED_WIDTH);
							} else if (screen.data.desiredState === 'retracted') {
								screen.computedWidth = RETRACTED_WIDTH;
								screen.computedDisabled = true;
							} else {
								screen.computedWidth = 0;
								screen.computedDisabled = true;
							}
						} else {
							if (screen.data && screen.data.desiredState === 'retracted') {
								screen.computedWidth = RETRACTED_WIDTH;
								screen.computedDisabled = true;
							} else if (screen.data && screen.data.desiredState === 'closing') {
								screen.computedWidth = 0;
								screen.computedDisabled = true;
							} else {
								screen.computedWidth = availableWidthLeft + RETRACTED_WIDTH;
								availableWidthLeft = 0;

								// TODO Do we want to disable base screen?
								if (lineage === 'base') {
									screen.computedDisabled = true;
								}
							}
						}
					}
				});
			}

			// TODO replace
			return this.props.children;

		} else {
			return this.props.children;
		}
	}
}

export default Screens;

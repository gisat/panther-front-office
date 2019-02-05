import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './style.css';

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
			let screens = {};
			let history = [...this.props.set.orderByHistory];

			// add any possible children as first screen
			if (this.props.children) {
				if (!_.find(history, 'base')) {
					history.unshift('base');
				}
				screens['base'] = {lineage: 'base'};
			}

			// compute open screens
			//todo count * retracted width
			history.reverse().forEach(lineage => {
				// todo continue
			});

		} else {
			return this.props.children;
		}
	}
}

export default Screens;

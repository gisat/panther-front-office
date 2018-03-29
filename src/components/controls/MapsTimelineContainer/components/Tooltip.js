import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import utils from '../../../../utils/utils';

class Tooltip extends React.PureComponent {

	static propTypes = {

	};

	overlap(one, two) {
		return !(one.end < two.start || two.end < one.start);
	}

	render() {

		//console.log('Tooltip#render props', this.props);

		let interval = {
			start: this.props.getTime(this.props.mouseX - this.props.mouseBufferWidth),
			end: this.props.getTime(this.props.mouseX + this.props.mouseBufferWidth)
		};

		let layers = [];
		_.each(this.props.layers, layer => {
			if (layer.periods && layer.periods.loading) {
				// loading, do nothing (todo or flag something is still loading?)
			} else if (layer.periods && !layer.periods.loading && layer.periods.data) {
				// time-based, check periods overlap
				let periods = [];
				_.each(layer.periods.data, period => {
					period = utils.period(period);
					if (this.overlap(period, interval)) {
						periods.push(period);
					}
				});
				if (periods.length) {
					// we have some overlap(s), add
					layers.push({...layer, periods: periods})
				}
			} else {
				// not time-based, keep as is
				layers.push(layer);
			}
		});

		let width = 200;
		let height = layers.length * 30 + 20;
		let left = 0;
		if (this.props.mouseX < width/2) {

		} else if (this.props.mouseX > (this.props.containerWidth - width/2)) {
			left = this.props.containerWidth - width;
		} else {
			left = this.props.mouseX - Math.round(width/2);
		}

		let props = {
			className: "ptr-timeline-tooltip",
			style: {
				left: left,
				bottom: (this.props.layers && this.props.layers.length || 0) * 10 + 30,
				width: width,
				height: height
			}
		};

		let content = null;

		return React.createElement('div', props, content);
	}

}

export default Tooltip;

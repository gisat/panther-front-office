import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import {period} from '@gisatcz/ptr-utils';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

class Tooltip extends React.PureComponent {

	static propTypes = {

	};

	overlap(one, two) {
		return !(one.end < two.start || two.end < one.start);
	}

	render() {

		//console.log('Tooltip#render props', this.props);

		let mouseTime = this.props.getTime(this.props.mouseX);

		// only show tooltip when inside of data scope
		if (this.props.dataPeriod && mouseTime.isAfter(this.props.dataPeriod.start) && mouseTime.isBefore(this.props.dataPeriod.end)) {

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

			// only show tooltip if there's anything to put in it
			if (layers.length || this.props.showMouseTime) {

				let content = _.map(layers, layer => {
					let periods = null;
					let periodsLength = layer.periods && layer.periods.length;
					if (periodsLength) {
						if (periodsLength === 1) {
							periods = period.toString(layer.periods[0]);
						} else {
							periods = periodsLength + ' periods';
						}
					}
					return (
						<div
							className={classNames("ptr-timeline-tooltip-layer", {
						active: _.includes(this.props.activeLayers, layer.key)
						})}
							key={layer.key}
						>
							<div></div>
							<div>{layer.data.name}</div>
							<div className="ptr-timeline-tooltip-layer-periods">{periods}</div>
						</div>
					);
				});

				let width = 300;
				let left = 0;
				if (this.props.mouseX < width / 2) {

				} else if (this.props.mouseX > (this.props.containerWidth - width / 2)) {
					left = this.props.containerWidth - width;
				} else {
					left = this.props.mouseX - Math.round(width / 2);
				}

				let props = {
					className: "ptr-timeline-tooltip",
					style: {
						left: left,
						bottom: (this.props.layers && this.props.layers.length || 0) * 10 + 30,
						width: width,
						//height: height
					}
				};

				return React.createElement('div', props, content);

			}

		}

		return null;

	}

}

export default Tooltip;

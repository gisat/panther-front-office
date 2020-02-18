import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

const LAYER_HEIGHT = 10;

class Layers extends React.PureComponent {

	static propTypes = {

	};

	render() {


		let layers = _.map(this.props.layers, (layer, index) => {
			let periods = null;
			if (layer.periods && !layer.periods.loading && layer.periods.data) {
				periods = _.map(layer.periods.data, period => {
					let active = this.props.activeLayerPeriods && this.props.activeLayerPeriods[layer.key] === period;
					period = utils.period(period);
					let start = this.props.getX(period.start);
					let end = this.props.getX(period.end);
					if (end-start < 5) {
						start = start - 2.5;
						end = end + 2.5;
					}
					return (
						<g
							key={layer.key + '#' + period.source}
							className="ptr-timeline-layer-period"
							onClick={this.props.onPeriodClick.bind(null, layer.key, period.source)}
						>
							<rect
								key={layer.key + '#' + period.source + '#area'}
								x={start - 2.5}
								width={end-start + 5}
								y={2.5 + index * LAYER_HEIGHT}
								height="10"
								className="ptr-timeline-layer-period-area"
								rx="5"
								ry="5"
							/>
							<rect
								key={layer.key + '#' + period.source + '#symbol'}
								x={start}
								width={end-start}
								y={5 + index * LAYER_HEIGHT}
								height="5"
								className={classNames("ptr-timeline-layer-period-symbol", {
									active: active
								})}
								rx="2"
								ry="2"
							/>
						</g>
					);
				});
			} else {
				// layer w/o defined periods -> valid for whole timeline extent
				let active = this.props.activeLayers && _.includes(this.props.activeLayers, layer.key);
				let start = this.props.getX(this.props.period.start);
				let end = this.props.getX(this.props.period.end);
				if (end-start < 5) {
					start = start - 2.5;
					end = end + 2.5;
				}
				periods = (
					<g
						key={layer.key + '#all'}
						className="ptr-timeline-layer-period"
						onClick={this.props.onPeriodClick.bind(null, layer.key, 'all')}
					>
						<rect
							key={layer.key + '#all#area'}
							x={start - 2.5}
							width={end-start + 5}
							y={2.5 + index * LAYER_HEIGHT}
							height="10"
							className="ptr-timeline-layer-period-area"
							rx="5"
							ry="5"
						/>
						<rect
							key={layer.key + '#all#symbol'}
							x={start}
							width={end-start}
							y={5 + index * LAYER_HEIGHT}
							height="5"
							className={classNames("ptr-timeline-layer-period-symbol", {
								active: active
							})}
							rx="2"
							ry="2"
						/>
					</g>
				);
			}
			return React.createElement('g', {key: layer.key, className: 'ptr-timeline-layer'}, periods);
		});

		return React.createElement('g', null, layers);
	}

}

export default Layers;

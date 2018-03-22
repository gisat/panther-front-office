import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

class Layers extends React.PureComponent {

	static propTypes = {

	};

	render() {

		console.log('Layers#render props', this.props);

		let layers = _.map(this.props.layers, layer => {
			let periods = null;
			if (layer.periods && !layer.periods.loading && layer.periods.data) {
				periods = _.map(layer.periods.data, period => {
					period = utils.period(period);
					let start = this.props.getX(period.start);
					let end = this.props.getX(period.end);
					console.log('### layers#period', start, end, end-start);
					if (end-start < 5) {
						start = start - 2.5;
						end = end + 2.5;
					}
					return (
						<g
							className="ptr-timeline-layer-period"
						>
							<rect
								key={layer.key + '#' + period.source + '#area'}
								x={start - 2.5}
								width={end-start + 5}
								y={2.5}
								height="10"
								className="ptr-timeline-layer-period-area"
								rx="5"
								ry="5"
							/>
							<rect
								key={layer.key + '#' + period.source}
								x={start}
								width={end-start}
								y={5}
								height="5"
								className="ptr-timeline-layer-period-symbol"
								rx="2"
								ry="2"
							/>
						</g>
					);
				});
			}
			return React.createElement('g', {className: 'ptr-timeline-layer'}, periods);
		});

		return React.createElement('g', null, layers);
	}

}

export default Layers;

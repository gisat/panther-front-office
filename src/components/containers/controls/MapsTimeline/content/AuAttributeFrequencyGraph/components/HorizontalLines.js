import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import * as d3 from 'd3';

const AXIS_STEP = 10;

class HorizontalLines extends React.PureComponent {

	static propTypes = {

	};

	render() {
		if (this.props.data && this.props.height) {

			let values = _.map(this.props.data, 'value');
			let minY = _.min(values);
			let maxY = _.max(values);
			let buffer = (maxY - minY) * this.props.buffer;
			minY -= buffer;
			maxY += buffer;
			let y = d3.scaleLinear().domain([minY, maxY]).range([this.props.height, 0]);

			let minAxis = Math.ceil(minY/AXIS_STEP)*AXIS_STEP;
			let maxAxis = Math.floor(maxY/AXIS_STEP)*AXIS_STEP;
			let axes = [];
			for (var i = minAxis; i <= maxAxis; i+=AXIS_STEP) {
				axes.push(i);
			}

			let lines = _.map(axes, axis => {
				return (
					<line
						key={'axis-' + axis}
						x1="0"
						x2={this.props.width}
						y1={y(axis)}
						y2={y(axis)}
						className={classNames("ptr-timeline-graph-axis horizontal", {
							positive: (axis > 0),
							zero: (axis == 0),
							negative: (axis < 0)
						})}
					/>
				);
			});

			return (
				<g>
					{lines}
				</g>
			);

		}
	}

}

export default HorizontalLines;

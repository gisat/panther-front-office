import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import * as d3 from 'd3';

class Graph extends React.PureComponent {

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
			let path = d3.line().curve(d3.curveCatmullRom.alpha(0.5)).x(d => this.props.getX(d.date)).y(d => y(d.value));
			let pathD = path(this.props.data);

			let points = _.map(this.props.data, record => {
				return (
					<circle
						key={record.date}
						cx={this.props.getX(record.date)}
						cy={y(record.value)}
						r={2}
						className="ptr-timeline-graph-point"
					/>
				);
			});

			return (
				<g>
					<path
						d={pathD}
						className="ptr-timeline-graph-line"
					/>
					<g>
						{points}
					</g>
				</g>
			);

		}
	}

}

export default Graph;

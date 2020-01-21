import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../../utils/utils';
import _ from 'lodash';

import Graph from './components/Graph';
import HorizontalLines from './components/HorizontalLines';
import Months from '../../../../../presentation/controls/MapsTimeline/components/Months';
import Days from '../../../../../presentation/controls/MapsTimeline/components/Days';
import Years from '../../../../../presentation/controls/MapsTimeline/components/Years';
import Mouse from '../../../../../presentation/controls/MapsTimeline/components/Mouse';
import OutOfScopeOverlays from '../../../../../presentation/controls/MapsTimeline/components/OutOfScopeOverlays';

import './style.css';

const FAKE_DATA = [
	{date: '2017-01-03', value: 12.5},
	{date: '2017-01-16', value: 6.32},
	{date: '2017-01-23', value: 8},
	{date: '2017-02-05', value: 16.02},
	{date: '2017-02-13', value: -3.6},
	{date: '2017-02-20', value: 5.55},
	{date: '2017-02-28', value: 5.87},
	{date: '2017-03-03', value: 23.6},
	{date: '2017-03-11', value: 2.36},
	{date: '2017-03-22', value: 15.8},
	{date: '2017-04-01', value: 18.6},
	{date: '2017-04-10', value: 22.3},
	{date: '2017-04-18', value: 22.36},
	{date: '2017-04-26', value: 22.45},
	{date: '2017-05-06', value: 20},
	{date: '2017-05-14', value: 19.5},
	{date: '2017-05-25', value: 13.4},
	{date: '2017-05-30', value: 17},
	{date: '2017-06-08', value: 23.6},
	{date: '2017-06-20', value: 30.4},
	{date: '2017-06-29', value: 28.7},
	{date: '2017-07-03', value: 25.6},
	{date: '2017-07-16T12:00', value: 32.1},
	{date: '2017-07-23T12:00', value: 20.8},
	{date: '2017-08-05T12:00', value: 16.5},
	{date: '2017-08-13T12:00', value: 12.5},
	{date: '2017-08-14T01:00', value: 12.5},
	{date: '2017-08-14T02:00', value: 13},
	{date: '2017-08-14T03:00', value: 13},
	{date: '2017-08-14T04:00', value: 12.6},
	{date: '2017-08-14T05:00', value: 14.2},
	{date: '2017-08-14T06:00', value: 15.6},
	{date: '2017-08-14T07:00', value: 17},
	{date: '2017-08-14T08:00', value: 17.3},
	{date: '2017-08-14T09:00', value: 17.8},
	{date: '2017-08-14T10:00', value: 18.8},
	{date: '2017-08-14T11:00', value: 20},
	{date: '2017-08-14T12:00', value: 22.3},
	{date: '2017-08-14T13:00', value: 23},
	{date: '2017-08-14T14:00', value: 23.9},
	{date: '2017-08-14T15:00', value: 24.5},
	{date: '2017-08-14T16:00', value: 24.3},
	{date: '2017-08-14T17:00', value: 24.8},
	{date: '2017-08-14T18:00', value: 25.6},
	{date: '2017-08-14T19:00', value: 26},
	{date: '2017-08-14T20:00', value: 24.6},
	{date: '2017-08-14T21:00', value: 23},
	{date: '2017-08-14T22:00', value: 21.1},
	{date: '2017-08-14T23:00', value: 18.5},
	{date: '2017-08-20T12:00', value: 15.3},
	{date: '2017-08-28T12:00', value: 19.8},
	{date: '2017-09-03T12:00', value: 17.6},
	{date: '2017-09-11T12:00', value: 22.4},
	{date: '2017-09-22', value: 27.3},
	{date: '2017-10-01', value: 22.1},
	{date: '2017-10-10', value: 15.6},
	{date: '2017-10-18', value: 12.5},
	{date: '2017-10-26', value: 14},
	{date: '2017-11-06', value: 6.4},
	{date: '2017-11-14', value: 5.56},
	{date: '2017-11-25', value: 6.9},
	{date: '2017-11-30', value: 8.1},
	{date: '2017-12-08', value: 4.5},
	{date: '2017-12-20', value: 0.3},
	{date: '2017-12-27', value: -2}
];
const GRAPH_BUFFER = 0.1;


class AuAttributeFrequencyGraph extends React.PureComponent {

	render() {

		let height = 100;
		return (
			<svg
				width={this.props.width}
				height={height}
				className="ptr-au-attribute-frequency-graph"
			>
				<HorizontalLines
					width={this.props.width}
					height={height}
					data={FAKE_DATA}
					height={height}
					buffer={GRAPH_BUFFER}
				/>
				<Graph
					dayWidth={this.props.dayWidth}
					period={this.props.period}
					getX={this.props.getX}
					data={FAKE_DATA}
					height={height}
					buffer={GRAPH_BUFFER}
				/>

			</svg>
		);
	}

}

export default AuAttributeFrequencyGraph;

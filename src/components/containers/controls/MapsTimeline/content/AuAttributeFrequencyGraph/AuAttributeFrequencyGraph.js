import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import utils from '../../../../../../utils/utils';
import _ from 'lodash';

import Graph from './components/Graph';
import Months from '../../../../../presentation/controls/MapsTimeline/components/Months';
import Mouse from '../../../../../presentation/controls/MapsTimeline/components/Mouse';

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
	{date: '2017-07-16', value: 32.1},
	{date: '2017-07-23', value: 20.8},
	{date: '2017-08-05', value: 16.5},
	{date: '2017-08-13', value: 12.5},
	{date: '2017-08-20', value: 15.3},
	{date: '2017-08-28', value: 19.8},
	{date: '2017-09-03', value: 17.6},
	{date: '2017-09-11', value: 22.4},
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
			>
				<Months
					background
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Graph
					period={this.props.period}
					getX={this.props.getX}
					data={FAKE_DATA}
					height={height}
					buffer={GRAPH_BUFFER}
				/>
				<Mouse
					mouseBufferWidth={this.props.mouseBufferWidth}
					mouseX={this.props.mouseX}
					height={height}
				/>

			</svg>
		);
	}

}

export default AuAttributeFrequencyGraph;

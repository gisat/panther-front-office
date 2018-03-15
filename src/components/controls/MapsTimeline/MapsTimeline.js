import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../config';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../utils/utils';

import TimelineContent from './components/TimelineContent';


const CONTROLS_WIDTH = 100;

class MapsTimeline extends React.PureComponent {

	static propTypes = {
		period: PropTypes.array
	};

	static defaultProps = {
		period: [utils.period('2017-03')[0], utils.period('2017-10')[1]]
	};

	constructor(props) {
		super();
		props.initialize();

		this.calculate = this.calculate.bind(this);

		this.calculate(props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.containerWidth != this.props.containerWidth) {
			this.calculate(nextProps);
		}
	}


	calculate(props) {
		let start = moment(props.period[0]);
		let end = moment(props.period[1]);

		let diff = end.diff(start, 'days');

		this.dimensions = {
			width: props.containerWidth - CONTROLS_WIDTH,
			days: diff,
			dayWidth: (props.containerWidth - CONTROLS_WIDTH)/diff
		};
	}

	render() {

		console.log('MapsTimeline#render dimensions', this.dimensions);

		return (
			<div className="ptr-timeline-container">
				<TimelineContent
					height="40"
					period={this.props.period}
					width={this.dimensions.days * Math.floor(this.dimensions.dayWidth)}
					dayWidth={Math.floor(this.dimensions.dayWidth)}
				/>
			</div>
		);
	}

}

export default Dimensions()(MapsTimeline);

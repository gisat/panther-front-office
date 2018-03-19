import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';
import TimelineContent from './TimelineContent';

const CONTROLS_WIDTH = 0;

class MapsTimeline extends React.PureComponent {

	static propTypes = {
		period: PropTypes.shape({
			start: PropTypes.object,
			end: PropTypes.object
		}).isRequired
	};

	//static defaultProps = {
	//
	//};

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
		let start = moment(props.period.start);
		let end = moment(props.period.end);

		let diff = end.diff(start, 'days');

		this.dimensions = {
			width: props.containerWidth - CONTROLS_WIDTH,
			days: diff,
			dayWidth: (props.containerWidth - CONTROLS_WIDTH)/diff
		};
	}

	render() {
		return (
			<div className="ptr-timeline-container">
				<TimelineContent
					height="40"
					period={this.props.period}
					width={this.dimensions.days * this.dimensions.dayWidth}
					dayWidth={this.dimensions.dayWidth}
				/>
			</div>
		);
	}

}

export default Dimensions()(MapsTimeline);

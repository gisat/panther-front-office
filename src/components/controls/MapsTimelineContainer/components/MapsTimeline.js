import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from '../../../../utils/utils';

import TimelineContent from './TimelineContent';
import Tooltip from './Tooltip';

const CONTROLS_WIDTH = 0;
const INITIAL_STATE = {
	mouseX: null
};

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
		this.state = {...INITIAL_STATE};
		props.initialize();

		this.calculate = this.calculate.bind(this);
		this.getX = this.getX.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

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

	getX(date, props) {
		props = props || this.props;
		date = moment(date);
		let diff = date.unix() - moment(props.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.dimensions.dayWidth;
	}

	getTime(x, props) {
		props = props || this.props;
		let diffDays = x / this.dimensions.dayWidth;
		let diff = diffDays * (60 * 60 * 24);
		return moment(props.period.start).add(diff, 's');
	}


	onMouseOver(e) {
		this.setState({
			mouseX: e.clientX
		});
	}
	onMouseLeave(e) {
		this.setState({
			mouseX: null
		});
	}


	render() {

		let children = [];
		let {maps, activeMapKey, ...contentProps} = this.props; // consume unneeded props (though we'll probably use them in the future)
		contentProps = {...contentProps,
			width: this.dimensions.days * this.dimensions.dayWidth,
			dayWidth: this.dimensions.dayWidth,
			getX: this.getX,
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave
		};
		children.push(React.createElement(TimelineContent, contentProps));

		if (this.state.mouseX) {
			children.push(React.createElement(Tooltip, {
				mouseX: this.state.mouseX,
				getTime: this.getTime,
				layers: this.props.layers,
				containerWidth: this.props.containerWidth
			}));
		}

		return React.createElement('div', {className: 'ptr-timeline-container'}, children);
	}

}

export default MapsTimeline;

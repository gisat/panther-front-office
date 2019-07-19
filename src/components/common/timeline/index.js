import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {ContextProvider} from './context';
import TimelineContent from './timelineContent';

const CONTROLS_WIDTH = 0;

export const LEVELS = [
	{
		end: 1,
		level: 'year',
	},
	{
		end: 10,
		level: 'month',
	},
	{
		end: 250,
		level: 'day',
	},
	{
		end: 15000,
		level: 'hour',
	},
	{
		end: 70000,
		level: 'minute',
	}
]

const DEFAULT_VERTICAL_HEIGHT = 70;
const DEFAULT_HORIZONTAL_HEIGHT = 45;

class Timeline extends React.PureComponent {

	static propTypes = {
		period: PropTypes.shape({
			start: PropTypes.object,
			end: PropTypes.object
		}).isRequired,
		periodLimit: PropTypes.shape({
			start: PropTypes.object,
			end: PropTypes.object
		}),
		dayWidth: PropTypes.number,
		centerTime: PropTypes.func,
		containerWidth: PropTypes.number,
		containerHeight: PropTypes.number,
		height: PropTypes.number,
		
		onHover: PropTypes.func,
		onClick: PropTypes.func,

		periodLimitOnCenter: PropTypes.bool,
		vertical: PropTypes.bool,
		
		levels: PropTypes.arrayOf(PropTypes.shape({
			end: PropTypes.number,
			level: PropTypes.string
		})),										//ordered levels by higher level.end 
		onChange: PropTypes.func,
	};

	static defaultProps = {
		dayWidth: 1.5,
		levels: LEVELS,
		onHover: () => {},
		onClick: () => {},
	}

	constructor(props){
		super(props);

		this.updateContext = this.updateContext.bind(this);
		this.getX = this.getX.bind(this);
		this.getTime = this.getTime.bind(this);
		this.getActiveLevel = this.getActiveLevel.bind(this);


		const state = this.getStateUpdate({
			period: props.period,
			periodLimit: props.periodLimit || props.period,
			centerTime: props.time,
		})

		this.state = state;

		if(typeof this.props.onChange === 'function') {
			this.props.onChange(this.state)
		}

	}

	componentDidUpdate(prevProps) {
		//if parent component set dayWidth
		if(prevProps.dayWidth !== this.props.dayWidth && this.state.dayWidth !== this.props.dayWidth) {
			this.updateContext({dayWidth: this.props.dayWidth})
		}
	
		//if parent component set time
		if(prevProps.time !== this.props.time && this.state.centerTime !== this.props.time) {

			const periodLimit = this.getPeriodLimitByTime(this.props.time);

			//zoom to dayWidth
			this.updateContext({periodLimit})
		}

		//if parent component set time
		if(prevProps.containerWidth !== this.props.containerWidth) {
			//todo take time from state
			const periodLimit = this.getPeriodLimitByTime(this.props.time);

			//zoom to dayWidth
			this.updateContext({periodLimit})
		}
	}

	getPeriodLimitByTime(time, axesWidth = this.getXAxisWidth(), period = this.state.period, dayWidth = this.state.dayWidth) {
		const allDays = axesWidth / dayWidth;
		let setTime = moment(time);

		//check if setTime is in period
		if (setTime.isBefore(period.start)){
			setTime = period.start
		}

		if (setTime.isAfter(period.end)){
			setTime = period.end
		}

		const halfDays = allDays / 2;
		const start = moment(setTime).subtract(moment.duration(halfDays * (60 * 60 * 24 * 1000), 'ms'));
		const end = moment(setTime).add(moment.duration(halfDays * (60 * 60 * 24 * 1000), 'ms'));
		return {
			start,
			end
		}
	}

	getX(date) {
		date = moment(date);
		let diff = date.unix() - moment(this.state.periodLimit.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.state.dayWidth;
	}

	getTime(x, dayWidth = this.state.dayWidth, startTime = this.state.periodLimit.start) {
		let diffDays = x / dayWidth;
		let diff = diffDays * (60 * 60 * 24 * 1000);
		return moment(startTime).add(moment.duration(diff, 'ms'));
	}

	//Find first level with smaller start level.
	getActiveLevel(dayWidth) {
		return this.props.levels.find((l) => dayWidth <= l.end)
	}


	getDayWidthForPeriod(period, axesWidth, maxDayWidth = this.getMaxDayWidth()) {
		const start = moment(period.start);
		const end = moment(period.end);

		const diff = end.diff(start, 'ms');
		const diffDays = diff / (60 * 60 * 24 * 1000);

		let dayWidth = (axesWidth - CONTROLS_WIDTH) / diffDays;
		if(dayWidth > maxDayWidth) {
			dayWidth = maxDayWidth;
		}

		return dayWidth;
	}

	getPeriodLimitByDayWidth(dayWidth) {
		const {centerTime} = this.state;

		const allDays = this.getXAxisWidth() / dayWidth;
		const halfMouseDays = allDays / 2;

		const start = moment(centerTime).subtract(moment.duration(halfMouseDays * (60 * 60 * 24 * 1000), 'ms'));
		const end = moment(centerTime).add(moment.duration(halfMouseDays * (60 * 60 * 24 * 1000), 'ms'));
		return {
			start,
			end
		}
	}

	updateContext(options) {
		if (options) {
			const stateUpdate = this.getStateUpdate(options);
			this.setState(stateUpdate, () => {
				if(typeof this.props.onChange === 'function') {
					this.props.onChange(this.state);
				}
			})
		}
	}

	getStateUpdate(options) {	
		if (options) {
			const updateContext = {};
			Object.assign(updateContext, {...options});
			
			//on change dayWidth calculate periodLimit
			if(options.dayWidth) {
				Object.assign(updateContext, {periodLimit: this.getPeriodLimitByDayWidth(options.dayWidth)})
			}
			
			//on change periodLimit calculate dayWidth
			if(options.periodLimit) {
				Object.assign(updateContext, {dayWidth: this.getDayWidthForPeriod(options.periodLimit, this.getXAxisWidth())})
			}

			if(updateContext.dayWidth) {
				Object.assign(updateContext, {activeLevel: this.getActiveLevel(updateContext.dayWidth, this.props.levels).level})
			}

			if(updateContext.dayWidth && !options.centerTime) {
				Object.assign(updateContext, {centerTime: this.getTime(this.getXAxisWidth() / 2, updateContext.dayWidth, updateContext.periodLimit.start).toDate()})
			}

			if(options.centerTime) {
				Object.assign(updateContext, {periodLimit: this.getPeriodLimitByTime(options.centerTime, this.getXAxisWidth(), this.props.period, updateContext.dayWidth)})
			}
			
			return updateContext
		} else {
			return {};
		}
	}

	getMaxDayWidth(levels = this.props.levels) {
		const lastLevel = levels[levels.length - 1];
		const maxDayWidth = lastLevel.end;
		return maxDayWidth;
	}

	getXAxisWidth() {
		const {containerWidth, containerHeight, vertical} = this.props;
		return vertical ? containerHeight : containerWidth;
	}

	render() {
		const {levels, period, height, pickDateByCenter, onHover, onClick, vertical, children, periodLimitOnCenter} = this.props;
		const {dayWidth, periodLimit, mouseX} = this.state;

		const maxDayWidth = this.getMaxDayWidth();
		const activeDayWidth = dayWidth >= maxDayWidth ? maxDayWidth : dayWidth;
		const activeLevel = this.getActiveLevel(activeDayWidth, levels).level;
		const minDayWidth = this.getDayWidthForPeriod(period, this.getXAxisWidth())
		return (
			<ContextProvider value={{
				updateContext: this.updateContext,
				width: this.getXAxisWidth(),
				height: height || (vertical ? DEFAULT_VERTICAL_HEIGHT : DEFAULT_HORIZONTAL_HEIGHT),
				getX: this.getX,
				getTime: this.getTime,
				centerTime: this.state.centerTime,
				getActiveLevel: this.getActiveLevel,
				dayWidth,
				maxDayWidth,
				minDayWidth,
				period,
				periodLimit,
				mouseX,
				activeLevel,
				periodLimitVisible: true,
				onClick,
				onHover,
				vertical,
				periodLimitOnCenter
				}}>
				<TimelineContent>
					{children}
				</TimelineContent>
			</ContextProvider>
		);

	}

}

export default Timeline;

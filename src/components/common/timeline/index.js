import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {withResizeDetector} from 'react-resize-detector';

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
		periodLimit: PropTypes.shape({
			start: PropTypes.string,
			end: PropTypes.string
		}).isRequired,
		period: PropTypes.shape({
			start: PropTypes.string,
			end: PropTypes.string
		}),
		dayWidth: PropTypes.number,
		centerTime: PropTypes.func,
		contentHeight: PropTypes.number,
		width: PropTypes.number,
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
		selectMode: PropTypes.bool,					//whether change time while zoom 
	};

	static defaultProps = {
		dayWidth: 1.5,
		levels: LEVELS,
		onHover: () => {},
		onClick: () => {},
		width: 100,
		height: 100,
		selectMode: false,
	}

	constructor(props){
		super(props);

		this.updateContext = this.updateContext.bind(this);
		this.getX = this.getX.bind(this);
		this.getTime = this.getTime.bind(this);
		this.getActiveLevel = this.getActiveLevel.bind(this);


		const state = this.getStateUpdate({
			periodLimit: props.periodLimit,
			period: props.period || props.periodLimit,
			centerTime: props.time,
		})

		this.state = state;

		if(typeof props.onChange === 'function') {
			props.onChange(this.state)
		}

	}

	componentDidUpdate(prevProps) {
		const {dayWidth, time, width, height, periodLimit} = this.props;
		//if parent component set dayWidth
		if(prevProps.dayWidth !== dayWidth && this.state.dayWidth !== dayWidth) {
			this.updateContext({dayWidth, centerTime: time})
		}
	
		//if parent component set time
		if(prevProps.time && time && (prevProps.time.toString() !== time.toString()) && (this.state.centerTime.toString() !== time.toString())) {

			const period = this.getPeriodLimitByTime(time);

			//zoom to dayWidth
			this.updateContext({period, centerTime: time})
		}

		//if parent component set time
		if((prevProps.width !== width) || (prevProps.height !== height)) {
			//přepočítat day width aby bylo v periodě

			//todo take time from state
			// const period = this.getPeriodLimitByTime(time);
			const xAxis = this.getXAxisWidth();
			const minPeriodDayWidth = this.getDayWidthForPeriod(periodLimit, xAxis);
			let dayWidth = this.state.dayWidth;
			if(minPeriodDayWidth >= this.state.dayWidth) {
				dayWidth = minPeriodDayWidth;
			}
			const period = this.getPeriodLimitByTime(this.state.centerTime, xAxis, periodLimit, dayWidth)

			//zoom to dayWidth
			this.updateContext({period})
		}
	}

	getPeriodLimitByTime(time, axesWidth = this.getXAxisWidth(), periodLimit = this.state.periodLimit, dayWidth = this.state.dayWidth) {
		const allDays = axesWidth / dayWidth;
		let setTime = moment(time);

		//check if setTime is in periodLimit
		if (setTime.isBefore(periodLimit.start)){
			setTime = periodLimit.start
		}

		if (setTime.isAfter(periodLimit.end)){
			setTime = periodLimit.end
		}

		const halfDays = allDays / 2;
		const start = moment(setTime).subtract(moment.duration(halfDays * (60 * 60 * 24 * 1000), 'ms')).toDate().toString();
		const end = moment(setTime).add(moment.duration(halfDays * (60 * 60 * 24 * 1000), 'ms')).toDate().toString();
		return {
			start,
			end
		}
	}

	getX(date) {
		date = moment(date);
		let diff = date.unix() - moment(this.state.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.state.dayWidth;
	}

	getTime(x, dayWidth = this.state.dayWidth, startTime = this.state.period.start) {
		let diffDays = x / dayWidth;
		let diff = diffDays * (60 * 60 * 24 * 1000);
		return moment(startTime).add(moment.duration(diff, 'ms'));
	}

	//Find first level with smaller start level.
	getActiveLevel(dayWidth) {
		const {levels} = this.props;
		return levels.find((l) => dayWidth <= l.end)
	}


	getDayWidthForPeriod(periodLimit, axesWidth, maxDayWidth = this.getMaxDayWidth()) {
		const start = moment(periodLimit.start);
		const end = moment(periodLimit.end);

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

		const start = moment(centerTime).subtract(moment.duration(halfMouseDays * (60 * 60 * 24 * 1000), 'ms')).toDate().toString();
		const end = moment(centerTime).add(moment.duration(halfMouseDays * (60 * 60 * 24 * 1000), 'ms')).toDate().toString();
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
		const {levels, periodLimit} = this.props;

		if (options) {
			const updateContext = {};
			Object.assign(updateContext, {...options});
			
			//on change dayWidth calculate period
			if(options.dayWidth) {
				Object.assign(updateContext, {period: this.getPeriodLimitByDayWidth(options.dayWidth)})
			}
			
			//on change period calculate dayWidth
			if(options.period) {
				Object.assign(updateContext, {dayWidth: this.getDayWidthForPeriod(options.period, this.getXAxisWidth())})
			}

			if(updateContext.dayWidth) {
				Object.assign(updateContext, {activeLevel: this.getActiveLevel(updateContext.dayWidth, levels).level})
			}

			if(updateContext.dayWidth && !options.centerTime && !options.lockCenter) {
				Object.assign(updateContext, {centerTime: this.getTime(this.getXAxisWidth() / 2, updateContext.dayWidth, updateContext.period.start).toDate()})
			}

			if(options.centerTime && !updateContext.period) {
				Object.assign(updateContext, {period: this.getPeriodLimitByTime(options.centerTime, this.getXAxisWidth(), periodLimit, updateContext.dayWidth)})
			}

			if(updateContext.centerTime) {
				const utcTime = new Date(updateContext.centerTime);
				utcTime.setTime( utcTime.getTime() - utcTime.getTimezoneOffset()*60*1000 )
				Object.assign(updateContext, {centerTimeUtc:utcTime.toUTCString()})
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
		//fix ReactResizeDetector. 
		const {width, height, vertical} = this.props;
		return vertical ? height : width;
	}

	getContentHeight() {
		const {contentHeight, vertical} = this.props;
		return contentHeight || (vertical ? DEFAULT_VERTICAL_HEIGHT : DEFAULT_HORIZONTAL_HEIGHT);
	}

	render() {
		const {levels, periodLimit, onHover, onClick, vertical, children, periodLimitOnCenter, selectMode} = this.props;
		const {dayWidth, period, mouseX, moving} = this.state;

		const maxDayWidth = this.getMaxDayWidth();
		const activeDayWidth = dayWidth >= maxDayWidth ? maxDayWidth : dayWidth;
		const activeLevel = this.getActiveLevel(activeDayWidth, levels).level;
		const minDayWidth = this.getDayWidthForPeriod(periodLimit, this.getXAxisWidth());
		return (
			<ContextProvider value={{
				updateContext: this.updateContext,
				width: this.getXAxisWidth(),
				height: this.getContentHeight(),
				getX: this.getX,
				getTime: this.getTime,
				centerTime: this.state.centerTime,
				getActiveLevel: this.getActiveLevel,
				dayWidth,
				maxDayWidth,
				minDayWidth,
				periodLimit,
				period,
				mouseX,
				activeLevel,
				periodLimitVisible: true,
				onClick,
				onHover,
				vertical,
				periodLimitOnCenter,
				selectMode,
				moving,
				}}>
				<TimelineContent>
					{children}
				</TimelineContent>
			</ContextProvider>
		);

	}

}

export default withResizeDetector(Timeline);

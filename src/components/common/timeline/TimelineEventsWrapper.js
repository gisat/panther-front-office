import React from 'react';
import moment from 'moment';
import {Context as TimeLineContext} from './context';

/**
 * 
 * @param {Event} evt 
 * @param {boolean} vertical 
 */
const getPageXFromEvent = (evt, vertical = false, targetBoudingBox) => {
	let clientX;
	const touch = (evt.touches && evt.touches[0]) || (evt.changedTouches && evt.changedTouches[0])
	const scrollLeft = window.document.documentElement.scrollLeft;
	const scrollTop = window.document.documentElement.scrollTop;
	if(touch) {
		clientX = vertical ? touch.pageY - scrollTop : touch.pageX - scrollLeft;
	} else {
		clientX = vertical ? evt.pageY - scrollTop : evt.pageX - scrollLeft;
	}

	if(vertical) {
		clientX = clientX - targetBoudingBox.top;  //y position within the element.
	} else {
		clientX = clientX - targetBoudingBox.left;  //y position within the element.
	}

	return clientX;
}

const calculateEventDistance = (point1, point2) => {
	return Math.hypot(point1.clientX - point2.clientX, point1.clientY - point2.clientY)
}

const getPoint = (index, cachedEvents, tpCache, targetTouches) => {
	const identifier = tpCache[index].identifier;
	let evIndex = null;
	for (let i = 0; i < targetTouches.length; i++) {
		const equals = targetTouches[i].identifier === identifier;
		if(equals) {
			evIndex = i;
		}
	}

	if(evIndex) {
		return targetTouches[evIndex]
	} else {
		return tpCache[index];
	}
}

class TimelineEventsWrapper extends React.PureComponent {
	static contextType = TimeLineContext;
	constructor(props){
		super(props);

		this.node = React.createRef();
		this._drag = null;
		this._lastX = null;
		this._mouseDownX = null;
		this.decelerating = false;
		this._pointerLastX = null;
		this.multiplier = 5;
		this.friction = 0.91; //default 0.92
		this.stopThreshold = 0.3;
		this.targetX = 0;
		this.trackingPoints = [];
		this.decVelX = 0;

		this.onWheel = this.onWheel.bind(this);
		this.onPinch = this.onPinch.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		
		this.start_handler = this.start_handler.bind(this);
		this.end_handler = this.end_handler.bind(this);
		this.move_handler = this.move_handler.bind(this);

		// Global vars to cache event state
		this.tpCache = [];
		this.prevDiff = -1;
	}
	componentDidMount() {
		this.node.current.addEventListener('touchstart', this.start_handler);
		this.node.current.addEventListener('touchmove', this.move_handler);
		this.node.current.addEventListener('touchend', this.end_handler);
		this.node.current.addEventListener('touchcancel', this.end_handler);
	}
	
	componentWillUnmount() {
		this.node.current.removeEventListener('touchstart', this.start_handler);
		this.node.current.removeEventListener('touchmove', this.move_handler);
		
		this.node.current.removeEventListener('touchend', this.end_handler);
		this.node.current.removeEventListener('touchcancel', this.end_handler);
	}

	end_handler(ev) {
		const {vertical} = this.context;
		ev.preventDefault();
		const clientX = getPageXFromEvent(ev, vertical, this.node.current.getBoundingClientRect());
		
		//identify stop touch move by one touch
		if(ev.changedTouches.length === 1 && this.tpCache.length === 1) {
			this.onPointerUp(clientX)
		}

		//remove from cache by identifier		
		for (let i = 0; i < ev.changedTouches.length; i++) {
			this.removeTouchEventByIdentifier(ev.changedTouches[i].identifier);
		}

		//FIX - sometime touchend or touchcancel is not called and touch stick in cache 
		if(ev.touches.length === 0 && this.tpCache.length > 0) {
			this.clearTouchEventCache();
		}
	}

	clearTouchEventCache() {
		this.tpCache = [];
	}

	removeTouchEventByIdentifier(identifier) {
		this.tpCache = this.tpCache.filter((ev) => {
			return ev.identifier !== identifier;
		});
	}

	cacheEvents(evts) {
		for (let i=0; i < evts.length; i++) {
			this.tpCache.push(evts[i]);
		}
	}

	start_handler(ev) {
		const {vertical} = this.context;
		// If the user makes simultaneious touches, the browser will fire a 
		// separate touchstart event for each touch point. Thus if there are 
		// three simultaneous touches, the first touchstart event will have 
		// targetTouches length of one, the second event will have a length 
		// of two, and so on.
		ev.preventDefault();
		if(this.tpCache.length > 0) {
			for (let i = 0; i < ev.touches.length; i++) {
				this.removeTouchEventByIdentifier(ev.touches[i].identifier);
			}
		}
		// Cache the touch points for later processing of 2-touch pinch/zoom
		this.cacheEvents(ev.touches);

		//identify only one touch
		this.trackingPoints = [];
		this._pointerLastX = null;
		this.resetMouseTouchProps();
		if(this.tpCache.length === 1) {
			const clientX = getPageXFromEvent(ev, vertical, this.node.current.getBoundingClientRect());
			this.onPointerDown(clientX);
		}
	   }

	move_handler(ev) {
		const {vertical} = this.context;
		ev.preventDefault();
		
		//identify pinch/zoom touch
		if(this.tpCache.length === 2) {
			this.handle_pinch_zoom(ev.touches);
		}
		
		//identify touch by one touch
		if(this.tpCache.length === 1) {
			const clientX = getPageXFromEvent(ev, vertical, this.node.current.getBoundingClientRect());
			this.onPointerMove(clientX);

			this.clearTouchEventCache();
			// Cache the touch points for later processing
			this.cacheEvents([ev.touches[0]]);
	   }
	}

	onPointerMove(clientX) {
		const distance = clientX - this._lastX;
		if(distance !== 0) {
			this.onDrag({
				distance: Math.abs(distance),
				direction: distance < 0 ? 'future': 'past'
			});
			this.registerMovements(clientX);
		}
	}

	onPointerDown(clientX) {
		this._drag = true;
		this.trackingPoints = [];
		this._lastX = clientX;
		this._pointerLastX = clientX;
		this._mouseDownX = clientX;
		this.addTrackingPoint(this._pointerLastX);
	}

	onPointerUp(clientX) {
		const isClick = Math.abs(this._mouseDownX - clientX) < 1;
		this.resetMouseTouchProps()
		if (isClick) {
			this.onClick(clientX)
		}

		this.stopTracking();
	}

	// This is a very basic 2-touch move/pinch/zoom handler that does not include
	// error handling, only handles horizontal moves, etc.
	handle_pinch_zoom(touches) {
		const cachedEvents = [];

		for(let i = 0; i < touches.length; i++) {
			const found = this.tpCache.findIndex(e => e.identifier === touches[i].identifier);
			if(found > -1) {
				cachedEvents[i] = found;
			}
		}

		const prevPoint1 = this.tpCache[0];
		const prevPoint2 = this.tpCache[1];
		const point1 = getPoint(0, cachedEvents, this.tpCache, touches);
		const point2 = getPoint(1, cachedEvents, this.tpCache, touches);
		const prevDist = calculateEventDistance(prevPoint1, prevPoint2);
		const dist = calculateEventDistance(point1, point2);

		this.clearTouchEventCache();

		// Cache the touch points for later processing of 2-touch pinch/zoom
		this.cacheEvents([point1, point2]);
		const targetBox = this.node.current.getBoundingClientRect();
		const centerPoint = [((point1.clientX + point2.clientX) / 2) - targetBox.left, ((point1.clientY + point2.clientY) / 2) - targetBox.top];
		this.onPinch(dist/prevDist, centerPoint)
   }

   resetMouseTouchProps() {
		this._drag = false;
		this._lastX = null;
		this._mouseDownX = null;
   }

	onMouseUp(e) {		
		const {vertical} = this.context;
		const clientX = getPageXFromEvent(e, vertical, this.node.current.getBoundingClientRect());
		this.onPointerUp(clientX);
	}

	onMouseDown(e) {
		const {vertical} = this.context;
		const clientX = getPageXFromEvent(e, vertical, this.node.current.getBoundingClientRect());
		this.onPointerDown(clientX);
	}

	onClick(clientX) {
		const {onClick, getTime} = this.context;

		onClick({
			type: 'time',
			x: clientX,
			time: getTime(clientX)
		})
	}

	onMouseMove(e) {
		const {vertical} = this.context;
		const clientX = getPageXFromEvent(e, vertical, this.node.current.getBoundingClientRect());
	
		this.context.onHover({
			x: e.pageX,
			y: e.pageY,
			time: this.context.getTime(clientX),
			vertical: vertical
		})
		
		this.context.updateContext({
			mouseX: clientX,
			mouseTime: this.context.getTime(clientX)
		});
		
		if(this._drag) {
			this.onPointerMove(clientX);
			e.preventDefault();
		}
	}


	/**
	 * When the user drags the timeline, if it is still permitted, it updates the available and visible period and
	 * therefore redraws the information.
	 * @param dragInfo {Object}
	 * @param dragInfo.distance {Number} Amount of pixels to move in given direction
	 * @param dragInfo.direction {String} Either past or future. Based on this.
	 */
	onDrag(dragInfo) {
		const {dayWidth, period, periodLimit, width, updateContext, periodLimitOnCenter} = this.context;
		const allDays = this.context.width / dayWidth;
		const periodStart = moment(period.start);
    	const periodEnd = moment(period.end);
		let periodLimitStart =  moment(periodLimit.start)
		let periodLimitEnd = moment(periodLimit.end)
		
		//center time
		const halfDays = allDays / 2;
		let periodLimitCenter = moment(periodLimit.end).subtract(halfDays * (60 * 60 * 24 * 1000), 'ms')

    	// Either add  to start and end.
		let daysChange = Math.abs(dragInfo.distance) / dayWidth;
		if(dragInfo.direction === 'past') {
			periodLimitStart.subtract(daysChange * (60 * 60 * 24 * 1000), 'ms');
	    	periodLimitEnd.subtract(daysChange * (60 * 60 * 24 * 1000), 'ms');
			if(periodLimitOnCenter) {
				periodLimitCenter.subtract(daysChange * (60 * 60 * 24 * 1000), 'ms');
				
				if(periodLimitCenter.isBefore(periodStart)) {
					//use last period limit
					periodLimitStart = moment(periodLimit.start);
					periodLimitEnd = moment(periodLimit.end);
				}
			} else {
				if(periodLimitStart.isBefore(periodStart)) {
					//use last period limit
					periodLimitStart = moment(periodLimit.start);
					periodLimitEnd = moment(periodLimit.end);
				}
			}
			
		} else {
			periodLimitStart.add(daysChange * (60 * 60 * 24 * 1000), 'ms');
			periodLimitEnd.add(daysChange * (60 * 60 * 24 * 1000), 'ms');
			periodLimitCenter.add(daysChange * (60 * 60 * 24 * 1000), 'ms');

			if(periodLimitOnCenter) {
				if(periodLimitCenter.isAfter(periodEnd)) {
					//use last period limit
					periodLimitStart = moment(periodLimit.start);
					periodLimitEnd = moment(periodLimit.end);
				}
			} else {
				if(periodLimitEnd.isAfter(periodEnd)) {
					//use last period limit
					periodLimitStart = moment(periodLimit.start);
					periodLimitEnd = moment(periodLimit.end);
				}
			}
		}

		let widthOfTimeline = width;
		// If the result is smaller than width of the timeline
		let widthOfResult = (periodLimitEnd.diff(periodLimitStart, 'ms') / (60 * 60 * 24 * 1000)) * dayWidth;
		// Make sure that we stay within the limits.
		if(widthOfResult < widthOfTimeline) {
			let daysNeededToUpdate = (widthOfTimeline - widthOfResult) / dayWidth;
			if(dragInfo.direction === 'past') {
				periodLimitEnd.add(daysNeededToUpdate * (60 * 60 * 24 * 1000), 'ms');
			} else {
				periodLimitStart.subtract(daysNeededToUpdate * (60 * 60 * 24 * 1000), 'ms');
			}
		}

		updateContext({
			periodLimit: {
				end: periodLimitEnd,
				start: periodLimitStart
			}
		});
	}


	/**
	 * Handles move events
	 * @param  {clientX} ev Normalized event
	 */
 	 registerMovements(clientX) {
		this._lastX = clientX;
		if (this._drag) {
			this.addTrackingPoint(this._lastX);
		}

		const pointerChangeX = this._lastX - this._pointerLastX;

		this.targetX += pointerChangeX * this.multiplier;

		this._pointerLastX = this._lastX;
	}


	/**
	 * Records movement for the last 100ms
	 * @param {number} x
	 */
	addTrackingPoint(x) {
		const time = Date.now();
		while (this.trackingPoints.length > 0) {
			if (time - this.trackingPoints[0].time <= 100) {
				break;
			}
			this.trackingPoints.shift();
		}

		this.trackingPoints.push({x, time});
	}

	/**
	 * Stops movement tracking, starts animation
	 */
	stopTracking() {
		this.addTrackingPoint(this._pointerLastX);
		
		this.startDecelAnim();
	}


    /**
     * Initialize animation of values coming to a stop
     */
    startDecelAnim() {
		const firstPoint = this.trackingPoints[0];
		const lastPoint = this.trackingPoints[this.trackingPoints.length - 1];
  
		const xOffset = lastPoint.x - firstPoint.x;
		const timeOffset = lastPoint.time - firstPoint.time;
  
		const D = (timeOffset / 15) / this.multiplier;
  
		this.decVelX = (xOffset / D) || 0; // prevent NaN
  
		//check difference start/stop
		if ((Math.abs(this.decVelX) > 1)) {
			this.decelerating = true;
			// end
			requestAnimFrame(() => this.stepDecelAnim());
		} else {
		  this.clearScroll()
		}
	}


  /**
   * Animates values slowing down
   */
  stepDecelAnim() {
    if (!this.decelerating) {
        return;
    }

    this.decVelX *= this.friction;

    this.targetX += this.decVelX;
    
    if (Math.abs(this.decVelX) > this.stopThreshold) {

		this.onDrag({
			distance: Math.abs(this.decVelX),
			direction: this.decVelX < 0 ? 'future': 'past'
		});

        requestAnimFrame(this.stepDecelAnim.bind(this));
    } else {
        this.clearScroll();
    }
  }

	clearScroll() {
		this.decelerating = false;
	  }

	onMouseLeave(e) {
		this._drag = false;
		this._lastX = null;
		this._mouseDownX = null;

		this.context.onHover(null);

		this.context.updateContext({
			mouseX: null,
			mouseTime: null
		});

	}

	/**
	 * Based on the amount of pixels the wheel moves update the size of the visible pixels.
	 * @param e {SyntheticEvent}
	 *
	 */
	onWheel(e) {
		const {dayWidth} = this.context;
		e.preventDefault();
		let change;

		if (e.deltaY > 0) {
			// zoom out
			change = 1 - Math.abs(e.deltaY / (10 * 100));
		} else {
			// zoom in
			change = 1 + Math.abs(e.deltaY / (10 * 100));
		}

		let newWidth = dayWidth * change;
		this.zoom(newWidth);
	}

	onPinch(scale, point) {
		const {vertical} = this.context;
		let zoomX;
		if(vertical) {
			zoomX = point[1];
		} else {
			zoomX = point[0];
		}
		
		const {dayWidth} = this.context;
		let change;
		if (scale === 1) {
			change = 1;
		} else if (scale > 1) {
			// zoom out
			change = 1 + scale / 10;
		} else {
			// zoom in
			change = 1 - scale / 10;
		}

		let newWidth = dayWidth * change;
		this.zoom(newWidth, zoomX);
	}

	zoom(newWidth, x) {
		const {mouseX, getTime, updateContext, period, periodLimit, periodLimitOnCenter} = this.context;
		const zoomX = x || mouseX;
		const mouseTime = zoomX ? getTime(zoomX) : getTime(mouseX);
		let periodLimitStart =  moment(periodLimit.start)
		let periodLimitEnd = moment(periodLimit.end)

		
		if(newWidth > this.context.maxDayWidth) {
			newWidth = this.context.maxDayWidth;
		}

		//don't allow zoom out outside initial zoom
		if (newWidth < this.context.minDayWidth) {
			newWidth = this.context.minDayWidth;
		}

		let beforeMouseDays = zoomX / newWidth;
		let allDays = this.context.width / newWidth;

		let start = moment(mouseTime).subtract(moment.duration(beforeMouseDays * (60 * 60 * 24 * 1000), 'ms'));
		let end = moment(start).add(moment.duration(allDays * (60 * 60 * 24 * 1000), 'ms'));

		//Don't allow zoom center out of period
		let center = moment(start).add(moment.duration((allDays / 2) * (60 * 60 * 24 * 1000), 'ms'));

		if(periodLimitOnCenter) {
			if(center.isBefore(period.start)) {
				const diff = period.start.diff(center, 'ms');
				start.add(diff, 'ms')
				end.add(diff, 'ms')
			}

			if(center.isAfter(period.end)) {
				const diff = period.end.diff(center, 'ms');
				start.add(diff, 'ms')
				end.add(diff, 'ms')
			}
		} else {
			//Don`t allow show date out of period
			if(start.isBefore(period.start)) {
				const diff = period.start.diff(periodLimitStart, 'ms');
				start.add(diff, 'ms')
				end.add(diff, 'ms')
			}

			if(end.isAfter(period.end)) {
				const diff = period.end.diff(periodLimitEnd, 'ms');
				start.add(diff, 'ms')
				end.add(diff, 'ms')
			}
		}

		updateContext({
			periodLimit: {
				start: start,
				end: end
			}
		});
	}


	render() {
		const {children} = this.props;

		return (
			<div
				ref={this.node}
				onMouseLeave={this.onMouseLeave}
				onWheel={this.onWheel}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onMouseMove={this.onMouseMove}
			>
				{children}
			</div>
		);
	}

}



/**
 * @see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
const requestAnimFrame = (function(){
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
  })();
  

export default TimelineEventsWrapper;

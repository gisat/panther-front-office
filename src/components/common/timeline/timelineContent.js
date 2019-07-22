import React from 'react';

import {Context as TimeLineContext} from './context';

import TimelineEventsWrapper from './TimelineEventsWrapper';

import './style.css';

class TimelineContent extends React.PureComponent {
	static contextType = TimeLineContext;

	render() {
		const {period, height, width,dayWidth, periodLimit, mouseX, vertical, activeLevel} = this.context;
		const {children} = this.props;

		const elementWidth = vertical ? height : width;
		const elementHeight = vertical ? width : height;
		const transform = vertical ? `scale(-1,1) translate(-${height},0)` : '';

		const childrenWithProps = [];
		if(children && children.length > 0) {
			children.forEach(child => {
				const {children, ...propsWithoutChildren} = this.props;
	
				childrenWithProps.push(React.cloneElement(child, {
					...propsWithoutChildren,
					periodLimit: periodLimit,
					period: period,
					getX: (dayWidth) => this.context.getX(dayWidth),
					height: height,
					width: width,
					dayWidth: dayWidth,
					vertical: vertical,
					mouseX: mouseX,
					activeLevel: activeLevel,
				}))
			})
		}

		return (
				<TimelineEventsWrapper>
					<div className="ptr-timeline-content">
						<svg version={"1.1"}
							xmlns={"http://www.w3.org/2000/svg"}
							xmlnsXlink={"http://www.w3.org/1999/xlink"} 
     						width={elementWidth}
							height={elementHeight}>
							<g transform={transform}>
								{childrenWithProps}
							</g>
						</svg>
					</div>
				</TimelineEventsWrapper>
		);
	}

}

export default TimelineContent;

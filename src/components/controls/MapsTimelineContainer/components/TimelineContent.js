import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import utils from '../../../../utils/utils';

import Months from './Months';
import Days from './Days';
import Years from './Years';
import Mouse from './Mouse';
import Layers from './Layers';

/*
Necessary updates
  The minimum size for what is shown is 4px
  The size is changing at 10% speed with the wheel movement.
  If the size is big enough we draw the month text
    Month names. Is it possible to figure out the size? As for names of the months it should be ok to use the first
    three letters
  If the size is big enough we draw the day name
    First two letters should be big enough.
  If the size is big enough we draw the hour
    Always two letters 01 to 24


  The Layers contain the information about points that are available there.
 */
class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this._drag = false;
		this._lastX = null;
	}

	onMouseUp() {
		console.log('onMouseUp');
		this._drag = false;

		this._lastX = null;
	}
	onMouseDown(e) {
        console.log('onMouseDown');
        this._drag = true;

		this._lastX = e.clientX;
	}
	onMouseMove(e) {
		if(this._drag) {
            let distance = e.clientX - this._lastX;
            if(distance !== 0) {
                this.props.onDrag({
                    distance: Math.abs(distance),
                    direction: distance < 0 ? 'future': 'past'
                });

                this._lastX = e.clientX;
            }
		}

		this.props.onMouseOver.apply(this, arguments);
	}

	render() {

		//console.log('TimelineContent#render props', this.props);

		let height = (this.props.layers && this.props.layers.length * 10 + 20) || 20;

		return (
			<svg
				width={this.props.width}
				height={height}
				onMouseLeave={this.props.onMouseLeave}
                onWheel={this.props.onWheel}

                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
			>
				<Months
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Days
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Years
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Mouse
					mouseBufferWidth={this.props.mouseBufferWidth}
					mouseX={this.props.mouseX}
					height={height}
				/>
				<Layers
					layers={this.props.layers}
                    dayWidth={this.props.dayWidth} // It is here to make sure the layers get rendered as the timeline is changed.
					getX={this.props.getX}
					onPeriodClick={this.props.onLayerPeriodClick}
					period={this.props.period}
					activeLayers={this.props.activeLayers}
					activeLayerPeriods={this.props.activeLayerPeriods}
				/>
			</svg>
		);
	}

}

export default TimelineContent;

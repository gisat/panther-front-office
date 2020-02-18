import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

import Months from './Months';
import Days from './Days';
import Years from './Years';
import Mouse from './Mouse';
import Layers from './Layers';
import OutOfScopeOverlays from './OutOfScopeOverlays';


class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('TimelineContent#render props', this.props);

		let height = (this.props.layers && this.props.layers.length * 10 + 20) || 20;

		let content = null;
		if (this.props.content) {
			content = React.createElement(this.props.content, {
				width: this.props.width,
				dayWidth: this.props.dayWidth,
				period: this.props.period,
				dataPeriod: this.props.dataPeriod,
				getX: this.props.getX,
				mouseX: this.props.mouseX,
				mouseBufferWidth: this.props.mouseBufferWidth
			});
		}

		return (
			<div
				className="ptr-timeline-content"
				onMouseLeave={this.props.onMouseLeave}
				onWheel={this.props.onWheel}
				onMouseDown={this.props.onMouseDown}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMove}
			>
				{content}
				<svg
					width={this.props.width}
					height={height}
					onMouseEnter={this.props.displayTooltip}
					onMouseLeave={this.props.hideTooltip}
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
						dayWidth={this.props.dayWidth}
						getX={this.props.getX}
						onPeriodClick={this.props.onLayerPeriodClick}
						period={this.props.period}
						activeLayers={this.props.activeLayers}
						activeLayerPeriods={this.props.activeLayerPeriods}
					/>
					<OutOfScopeOverlays
						dayWidth={this.props.dayWidth}
						getX={this.props.getX}
						period={this.props.period}
						dataPeriod={this.props.dataPeriod}
						height={height}
					/>
				</svg>
			</div>
		);
	}

}

export default TimelineContent;

import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

import Months from './Months';
import Days from './Days';
import Years from './Years';
import Layers from './Layers';

class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	render() {

		console.log('TimelineContent#render props', this.props);

		let height = this.props.layers.length * 10 + 20;

		return (
			<svg
				width={this.props.width}
				height={height}
				onMouseOver={this.props.onMouseOver}
				onMouseLeave={this.props.onMouseLeave}
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
				/>
				<Years
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Layers
					layers={this.props.layers}
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

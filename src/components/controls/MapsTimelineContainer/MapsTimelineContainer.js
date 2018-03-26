import React from 'react';
import PropTypes from 'prop-types';
import MapsTimeline from './components/MapsTimeline';
import Dimensions from 'react-dimensions';
import utils from '../../../utils/utils';

class MapsTimelineContainer extends React.PureComponent {

	constructor(){
		super();

		this.onLayerPeriodClick = this.onLayerPeriodClick.bind(this);
	}


	onLayerPeriodClick(layerKey, periodString) {
		this.props.selectLayerPeriod(layerKey, periodString, this.props.activeMapKey);
	}


	render() {

		if (this.props.scope && this.props.period && this.props.scope.showTimeline) {

			let {scope, period, ...props} = this.props;
			return React.createElement(MapsTimeline, {...props,
				period:  utils.period(period.period),
				onLayerPeriodClick: this.onLayerPeriodClick
			});

		} else {

			return null;

		}
	}

}

export default Dimensions()(MapsTimelineContainer);

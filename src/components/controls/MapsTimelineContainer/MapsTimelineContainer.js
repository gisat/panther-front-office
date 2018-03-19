import React from 'react';
import PropTypes from 'prop-types';
import MapsTimeline from './components/MapsTimeline';

class MapsTimelineContainer extends React.PureComponent {

	constructor(){
		super();
	}

	render() {

		if (this.props.scope && this.props.period) {

			let {scope, ...props} = this.props;
			return React.createElement(MapsTimeline, props);

		} else {

			return null;

		}
	}

}

export default MapsTimelineContainer;

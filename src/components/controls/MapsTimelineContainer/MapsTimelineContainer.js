import React from 'react';
import PropTypes from 'prop-types';
import MapsTimeline from './components/MapsTimeline';

class MapsTimelineContainer extends React.PureComponent {

	constructor(){
		super();
	}

	render() {

		console.log('MapsTimeline#render dimensions', this.dimensions);
		return (
			<MapsTimeline
				activeKey={this.props.activeKey}
				initialize={this.props.initialize.bind(this)}
				maps={this.props.maps}
				setActive={this.props.setActive.bind(this)}
			/>
		);
	}

}

export default MapsTimelineContainer;

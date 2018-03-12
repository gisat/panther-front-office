import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../config';

import _ from 'lodash';
import classNames from 'classnames';

import utils from '../../../utils/utils';

class MapsTimeline extends React.PureComponent {

	constructor(props) {
		super();
		props.initialize();
		this.onChangeActiveClick = this.onChangeActiveClick.bind(this);
	}

	onChangeActiveClick() {
		let randomKey = utils.guid();
		this.props.setActive(randomKey);
	}

	render() {


		return (
			<div id="maps-timeline">
				<a onClick={this.onChangeActiveClick}>{this.props.maps.activeMapKey || "not set"}</a>
			</div>
		);
	}

}

export default MapsTimeline;

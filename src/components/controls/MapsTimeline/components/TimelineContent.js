import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';

import utils from '../../../../utils/utils';

class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	render() {

		console.log('TimelineContent#render props', this.props);

		return (
			<svg
				width={this.props.width}
				height={this.props.height}
			>

			</svg>
		);
	}

}

export default TimelineContent;

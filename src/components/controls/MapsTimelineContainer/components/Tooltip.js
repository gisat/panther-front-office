import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import utils from '../../../../utils/utils';

class Tooltip extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('Tooltip#render props', this.props);

		let width = 50;
		let height = 50;
		let left = 0;
		if (this.props.mouseX < width/2) {

		} else if (this.props.mouseX > (this.props.containerWidth - width/2)) {
			left = this.props.containerWidth - width;
		} else {
			left = this.props.mouseX - Math.round(width/2);
		}

		let props = {
			className: "ptr-timeline-tooltip",
			style: {
				left: left,
				bottom: (this.props.layers && this.props.layers.length || 0) * 10 + 30,
				width: width,
				height: height
			}
		};

		let content = null;

		return React.createElement('div', props, content);
	}

}

export default Tooltip;

import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

class Mouse extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('Mouse#render props', this.props);

		if (this.props.mouseX) {
			return (
				<g
					className="ptr-timeline-mouse"
				>
					<rect
						x={this.props.mouseX - this.props.mouseBufferWidth}
						width={this.props.mouseBufferWidth * 2 + 1}
						y={0}
						height={this.props.height}
					/>
					<line
						x1={this.props.mouseX + 0.5}
						x2={this.props.mouseX + 0.5}
						y1={0}
						y2={this.props.height}
					/>
				</g>
			);
		} else {
			return null;
		}
	}

}

export default Mouse;

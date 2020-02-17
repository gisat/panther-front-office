import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from "panther-utils"

class OutOfScopeOverlays extends React.PureComponent {

	static propTypes = {

	};

	render() {

		let ret = [];

		if (this.props.period && this.props.dataPeriod) {

			if (this.props.period.start.isBefore(this.props.dataPeriod.start)) {
				ret.push(
					<rect
						key="outOfScopeOverlayBefore"
						className="ptr-timeline-out-of-scope-overlay before"
						x={0}
						width={this.props.getX(this.props.dataPeriod.start)}
						y={0}
						height={this.props.height}
					/>
				);
			}

			if (this.props.period.end.isAfter(this.props.dataPeriod.end)) {
				ret.push(
					<rect
						key="outOfScopeOverlayAfter"
						className="ptr-timeline-out-of-scope-overlay after"
						x={this.props.getX(this.props.dataPeriod.end)}
						width={this.props.getX(this.props.period.end)}
						y={0}
						height={this.props.height}
					/>
				);
			}

		}

		return ret.length ? React.createElement('g', null, ret) : null;
	}

}

export default OutOfScopeOverlays;

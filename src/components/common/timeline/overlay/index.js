import React from 'react';
import PropTypes from 'prop-types';
import {getOverlays} from '../utils/interval';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import './style.css';

export default (props) => {
	const {periodLimit, overlays, getX, vertical} = props;
	const periodStart = moment(periodLimit.start);
	const periodEnd = moment(periodLimit.end);
	
	const overlaysCfg = getOverlays(periodStart, periodEnd, overlays);

	const overlaysElms = _.map(overlaysCfg, overlay => {
		const start = getX(overlay.start);
		const end = getX(overlay.end);
		let label = null
		
		const x = vertical ? overlay.top : (start + 3);
		const yL = vertical ? start : (overlay.top + overlay.height - 2);
		const yR = vertical ? start : overlay.top;
		const eHeight = vertical ? end-start : overlay.height;
		const width = vertical ? overlay.height : end-start;

		//TODO - solve label in vertical
		if(overlay.label && !vertical) {
			label = (
				<text
					x={x}
					y={yL}
					className="ptr-timeline-overlay-label"
				>
					{overlay.label}
				</text>
			);
		}
		return (
			<g
				key={`${overlay.key}`}
				className={classNames("ptr-timeline-overlay", overlay.classes)}
			>
				<rect
					x={x}
					width={width}
					y={yR}
					height={eHeight}
					fill={overlay.backgound}
				/>
				{label}
			</g>
		);
	});

	return (
		<g>
			{overlaysElms}
		</g>
	);
};

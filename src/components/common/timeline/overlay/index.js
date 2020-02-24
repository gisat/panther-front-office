import React from 'react';
import PropTypes from 'prop-types';
import {getOverlays} from '../utils/interval';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import './style.css';

const MIN_OVERLAY_WIDTH = 5 //in pixels

const Overlay = (props) => {
	const {period, overlays, getX, vertical, onClick} = props;
	
	if(period) {
		const periodStart = moment(period.start);
		const periodEnd = moment(period.end);
		
		const overlaysCfg = getOverlays(periodStart, periodEnd, overlays);
	
		const overlaysElms = _.map(overlaysCfg, overlay => {
			const start = getX(overlay.start);
			const end = getX(overlay.end);
			let label = null
			
			const MIN_WIDTH_MODE = end-start > MIN_OVERLAY_WIDTH ? false : true;
			const diff = MIN_WIDTH_MODE ? MIN_OVERLAY_WIDTH : end-start;
			const x = vertical ? overlay.top : (MIN_WIDTH_MODE ? start - diff / 2 : start);
			const yL = vertical ? start : (overlay.top + overlay.height - 2);
			const yR = vertical ? start : overlay.top;
			const eHeight = vertical ? diff : overlay.height;
			const width = vertical ? overlay.height : diff;
	
			const onOverlayClick = () => {
				if(typeof onClick === 'function') {
					const clickOverlay = overlays.find(o => o.key === overlay.key);
					onClick(clickOverlay);
				}
			};
	
	
			//TODO - solve label in vertical
			if(!overlay.hideLabel && overlay.label && !vertical) {
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
						rx={eHeight/2}
						ry={eHeight/2}
						height={eHeight}
						fill={overlay.backgound}
						onClick={onOverlayClick}
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
	} else {
		return null;
	}

};


Overlay.propTypes = {
    period: PropTypes.shape({
		start: PropTypes.string,
		end: PropTypes.string,
	}),
	getX: PropTypes.func,
	overlays: PropTypes.array.isRequired,
	vertical: PropTypes.bool,
  }

Overlay.defaultProps = {
	vertical: false,
}

export default Overlay;
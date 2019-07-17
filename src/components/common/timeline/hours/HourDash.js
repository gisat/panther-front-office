import React from 'react';
import {D1, D2, D3} from '../utils/dash';

export default (props) => {
	const {x, label, vertical, height} = props;
	const dLabel = label || null;
	return (
		<g
			className={'ptr-timeline-hour'}
		>
			{height === 1 ? <D1 x={x} vertical={vertical}/> : null}
			{height === 2 ? <D2 x={x} vertical={vertical}/> : null}
			{height === 3 ? <D3 x={x} vertical={vertical}/> : null}
			{dLabel}
		</g>
	);
} ;
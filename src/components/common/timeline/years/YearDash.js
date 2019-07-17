import React from 'react';
import {D1} from '../utils/dash';

export default (props) => {
	const {x, label, vertical} = props;
	const dLabel = label || null;
	return (
		<g
			className={'ptr-timeline-year'}
		>
			<D1 x={x} vertical={vertical}/>
			{dLabel}
		</g>
	);
} 
import React from 'react';

export default props => {

	let color = props.color ? props.color : '#000000';
	let opacity = (props.opacity || props.opacity === 0) ? props.opacity : 1;

	return (
		<g>
			<circle className="polygon" cx="16" cy="16" r="5" fill={color} fillOpacity={opacity}/>
		</g>
	);
};
import React from 'react';

export default props => {

	let color = null;
	switch (props.color){
		case 'green':
			color = 'green';
			break;
		case 'orange':
			color = 'orange';
			break;
		case 'red':
			color = 'red';
			break;
		default:
			color = 'black';
	}

	return (
		<g>
			<circle className="polygon" cx="16" cy="16" r="5" fill={color}/>
		</g>
	);
};
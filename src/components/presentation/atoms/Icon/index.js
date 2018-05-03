import React from 'react';

import Dots from './Dots';
import Plus from './Plus';

const icon = key => {
	switch(key) {
		case 'dots':
			return <Dots />;
		case 'plus':
			return <Plus />;
		default:
			return null;
	}
};

export default props => (
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="32px"
		height="32px"
		viewBox="0 0 32 32"
		xmlSpace="preserve"
		className="ptr-icon"
	>
		{icon(props.icon)}
	</svg>
);

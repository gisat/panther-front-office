import React from 'react';

import Dots from './Dots';

const icon = key => {
	switch(key) {
		case 'dots':
			return Dots;
		default:
			return null;
	}
};

export default props => (
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="32px"
		height="32px"
		viewBox="0 0 32 32"
		style="enable-background:new 0 0 32 32;"
		xml:space="preserve"
	>
		{icon(props.icon)}
	</svg>
);

import React from 'react';

import ArrowLeft from './ArrowLeft';
import Delete from './Delete';
import Dots from './Dots';
import Download from './Download';
import Edit from './Edit';
import Expand from './Expand';
import Plus from './Plus';
import Pushpin from './Pushpin';
import Restore from './Restore';

const icon = key => {
	switch(key) {
		case 'arrow-left':
			return <ArrowLeft />;
		case 'delete':
			return <Delete />;
		case 'dots':
			return <Dots />;
		case 'download':
			return <Download />;
		case 'edit':
			return <Edit />;
		case 'expand':
			return <Expand />;
		case 'plus':
			return <Plus />;
		case 'pushpin':
			return <Pushpin />;
		case 'restore':
			return <Restore />;
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

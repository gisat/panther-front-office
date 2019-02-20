import React from 'react';

import ArrowLeft from './ArrowLeft';
import Circle from './Circle';
import Delete from './Delete';
import Dots from './Dots';
import getAngleDoubleRight from './angle-double-right-solid';
import getAngleDoubleLeft from './angle-double-left-solid';
import getAngleDoubleUp from './angle-double-up-solid';
import getAngleDoubleDown from './angle-double-down-solid';
import getAngleRight from './angle-right-solid';
import getAngleLeft from './angle-left-solid';
import getAngleUp from './angle-up-solid';
import getAngleDown from './angle-down-solid';
import Download from './Download';
import Edit from './Edit';
import Expand from './Expand';
import ExpandRow from './ExpandRow';
import Opacity from './Opacity';
import Minus from './Minus';
import NorthArrow from './NorthArrow';
import Plus from './Plus';
import Pushpin from './Pushpin';
import Restore from './Restore';
import Search from './Search';
import getSortDown from './sort-down-solid';
import getSortUp from './sort-up-solid';
import TiltMore from './TiltMore';
import TiltLess from './TiltLess';
import getTimes from './times-solid';
import Upload from './Upload';
import RotateLeftCircularArrow from './rotateLeftCircularArrow';
import RotateRightCircularArrow from './rotateRightCircularArrow';

import './icon.css';

const icon = key => {
	switch(key) {
		// case 'angle-double-right':
		// 	return getAngleDoubleRight();
		// case 'angle-double-left':
		// 	return getAngleDoubleLeft();
		// case 'angle-double-up':
		// 	return getAngleDoubleUp();
		// case 'angle-double-down':
		// 	return getAngleDoubleDown();
		// case 'angle-right':
		// 	return getAngleRight();
		// case 'angle-left':
		// 	return getAngleLeft();
		// case 'angle-up':
		// 	return getAngleUp();
		// case 'angle-down':
		// 	return getAngleDown();
		case 'arrow-left':
		case 'back':
			return <ArrowLeft />;
		// case 'circle':
		// 	return <Circle />;
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
		case 'expand-row':
			return <ExpandRow />;
		case 'minus':
			return <Minus />;
		case 'north-arrow':
			return <NorthArrow />;
		case 'opacity':
			return <Opacity />;
		case 'plus':
			return <Plus />;
		case 'pushpin':
			return <Pushpin />;
		case 'restore':
			return <Restore />;
		case 'rotate-left-circular-arrow':
			return <RotateLeftCircularArrow />;
		case 'rotate-right-circular-arrow':
			return <RotateRightCircularArrow />;
		case 'search':
			return <Search />;
		case 'tilt-less':
			return <TiltLess />;
		case 'tilt-more':
			return <TiltMore />;
		// case 'sort-down':
		// 	return getSortDown();
		// case 'sort-up':
		// 	return getSortUp();
		case 'upload':
			return <Upload />;
		// case 'times':
		// 	return getTimes();
		default:
			return null;
	}
};

export default props => (
	<svg
		style={props.style} //todo better solution (used for transform: rotate)
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="32px"
		height="32px"
		viewBox="0 0 32 32"
		xmlSpace="preserve"
		className={`ptr-icon ${props.className || ''}`}
	>
		{icon(props.icon)}
	</svg>
);

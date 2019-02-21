import React from 'react';

import ArrowLeft from './components/ArrowLeft';
import Circle from './components/Circle';
import Delete from './components/Delete';
import Dots from './components/Dots';
import getAngleDoubleRight from './components/angle-double-right-solid';
import getAngleDoubleLeft from './components/angle-double-left-solid';
import getAngleDoubleUp from './components/angle-double-up-solid';
import getAngleDoubleDown from './components/angle-double-down-solid';
import getAngleRight from './components/angle-right-solid';
import getAngleLeft from './components/angle-left-solid';
import getAngleUp from './components/angle-up-solid';
import getAngleDown from './components/angle-down-solid';
import Download from './components/Download';
import Edit from './components/Edit';
import Expand from './components/Expand';
import ExpandRow from './components/ExpandRow';
import Opacity from './components/Opacity';
import Minus from './components/Minus';
import NorthArrow from './components/NorthArrow';
import Plus from './components/Plus';
import Pushpin from './components/Pushpin';
import Restore from './components/Restore';
import Search from './components/Search';
import getSortDown from './components/sort-down-solid';
import getSortUp from './components/sort-up-solid';
import TiltMore from './components/TiltMore';
import TiltLess from './components/TiltLess';
import getTimes from './components/times-solid';
import Upload from './components/Upload';
import RotateLeftCircularArrow from './components/rotateLeftCircularArrow';
import RotateRightCircularArrow from './components/rotateRightCircularArrow';

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

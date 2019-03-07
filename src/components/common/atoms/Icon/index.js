import React from 'react';

import AngleDoubleDown from "./components/AngleDoubleDown";
import AngleDoubleLeft from "./components/AngleDoubleLeft";
import AngleDoubleRight from "./components/AngleDoubleRight";
import AngleDoubleUp from "./components/AngleDoubleUp";
import ArrowLeft from './components/ArrowLeft';
import Circle from './components/Circle';
import Delete from './components/Delete';
import Dots from './components/Dots';
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
		case 'angle-double-right':
			return <AngleDoubleRight />;
		case 'angle-double-left':
			return <AngleDoubleLeft/>;
		case 'angle-double-up':
			return <AngleDoubleUp/>;
		case 'angle-double-down':
			return <AngleDoubleDown/>;
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
			return <Delete />; //todo
		case 'dots':
			return <Dots />;
		case 'download':
			return <Download />; //todo
		case 'edit':
			return <Edit />;
		case 'expand':
			return <Expand />; //todo
		case 'expand-row':
			return <ExpandRow />;
		case 'minus':
			return <Minus />;
		case 'north-arrow':
			return <NorthArrow />; //todo
		case 'opacity':
			return <Opacity />; //todo
		case 'plus':
			return <Plus />;
		case 'pushpin':
			return <Pushpin />; //todo
		case 'restore':
			return <Restore />;
		case 'rotate-left-circular-arrow':
			return <RotateLeftCircularArrow />; //todo
		case 'rotate-right-circular-arrow':
			return <RotateRightCircularArrow />; //todo
		case 'search':
			return <Search />; //todo
		case 'tilt-less':
			return <TiltLess />; //todo
		case 'tilt-more':
			return <TiltMore />; //todo
		// case 'sort-down':
		// 	return getSortDown();
		// case 'sort-up':
		// 	return getSortUp();
		case 'upload':
			return <Upload />; //todo
		// case 'times':
		// 	return getTimes();
		default:
			return (
				<g>
					<rect x="4.844" y="4.844" fill="none" stroke="#FF3333" strokeMiterlimit="10" width="22.313" height="22.313"/>
					<line fill="none" stroke="#FF3333" strokeMiterlimit="10" x1="27.156" y1="4.844" x2="4.844" y2="27.156"/>
					<line fill="none" stroke="#FF3333" strokeMiterlimit="10" x1="4.844" y1="4.844" x2="27.156" y2="27.156"/>
				</g>
			);
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
		{typeof props.icon === "function" ? props.icon() : icon(props.icon)}
	</svg>
);
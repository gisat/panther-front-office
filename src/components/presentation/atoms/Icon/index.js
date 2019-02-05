import React from 'react';

import ArrowLeft from './ArrowLeft';
import Circle from './Circle';
import Delete from './Delete';
import Dots from './Dots';
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
import TiltMore from './TiltMore';
import TiltLess from './TiltLess';
import Upload from './Upload';
import RotateLeftCircularArrow from './rotateLeftCircularArrow';
import RotateRightCircularArrow from './rotateRightCircularArrow';

import './icon.css';

const icon = (key, props) => {
	switch(key) {
		case 'arrow-left':
		case 'back':
			return <ArrowLeft />;
		case 'circle':
			return <Circle
				color={props.color}
				opacity={props.opacity}
			/>;
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
		case 'upload':
			return <Upload />;
		default:
			return null;
	}
};

export default props => {

	const width = props.width || 32;
	const height = props.height || 32;
	const defaultViewBox = `0 0 ${width} ${height}`;
	return <svg
		style={props.style}
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width={`${width}px`}
		height={`${height}px`}
		viewBox={props.viewBox || defaultViewBox}
		xmlSpace="preserve"
		className={`ptr-icon ${props.className ? props.className : ''}`}
	>
		{icon(props.icon, props)}
	</svg>
};

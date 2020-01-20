import React from 'react';
import PropTypes from 'prop-types';
import './style.css'

const Mouse = (props) => {
	//nekdy na overlay se nenastaví mouseX
	const {mouseX, mouseBufferWidth, height, vertical} = props;
	if (mouseX) {
		const x = vertical ? 0 : mouseX - mouseBufferWidth;
		const y = vertical ? mouseX - mouseBufferWidth : 0;
		const eHeight = vertical ? mouseBufferWidth * 2 + 1 : height;
		const width = vertical ? height : mouseBufferWidth * 2 + 1;

		return (
			<g
				className="ptr-timeline-mouse"
			>
				<rect
					x={x}
					width={width}
					y={y}
					height={eHeight}
				/>
				<line
					x1={vertical ? 0 : mouseX + 0.5}
					x2={vertical ? height : mouseX + 0.5}
					y1={vertical ? mouseX + 0.5 : 0}
					y2={vertical ? mouseX + 0.5 : height}
				/>
			</g>
		);
	} else {
		return null;
	}
};

Mouse.propTypes = {
	mouseX: PropTypes.number,
	mouseBufferWidth: PropTypes.number.isRequired,
	height: PropTypes.number,
	vertical: PropTypes.bool,
  }

Mouse.defaultProps = {
	vertical: false,
}

export default Mouse;
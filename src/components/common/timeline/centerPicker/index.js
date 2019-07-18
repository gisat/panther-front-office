import React from 'react';
import './picker.css';
import PropTypes from 'prop-types';

class Picker extends React.PureComponent {

	static propTypes = {
		width: PropTypes.number
	};

	render() {
		const {width, height, vertical} = this.props;
		const indicatorWidth = 10;
		if (width) {
			const position = width / 2;
			const x = vertical ? 0 : position - indicatorWidth;
			const y = vertical ? position - indicatorWidth : 0;
			const eHeight = vertical ? indicatorWidth * 2 + 1 : height;
			const eWidth = vertical ? height : indicatorWidth * 2 + 1;

			return (
				<g
					className="ptr-timeline-picker"
				>
					<rect
						x={x}
						width={eWidth}
						y={y}
						height={eHeight}
					/>
					<line
						x1={vertical ? 0 : position + 0.5}
						x2={vertical ? height : position + 0.5}
						y1={vertical ? position + 0.5 : 0}
						y2={vertical ? position + 0.5 : height}
					/>
				</g>
			);
		} else {
			return null;
		}
	}

}

Picker.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	vertical: PropTypes.bool,
  }

Picker.defaultProps = {
	vertical: false,
}

export default Picker;

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';

class Bar extends React.PureComponent {

	static propTypes = {
		itemKey: PropTypes.string,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		x: PropTypes.number,
		y: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,
	};

	constructor(props) {
		super(props);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
	}

	onMouseMove(e) {
		console.log("mousemove");
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
	}

	onMouseOver(e) {
		console.log("mouseover");
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
	}

	onMouseOut(e) {
		console.log("mouseout");
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}
	}

	render() {
		const props = this.props;

		return (
			<rect className="ptr-column-chart-bar"
				  key={this.props.itemKey}
				  onMouseOver={this.onMouseOver}
				  onMouseMove={this.onMouseMove}
				  onMouseOut={this.onMouseOut}
				  y={props.y}
				  x={props.x}
				  width={props.width}
				  height={props.height}
			/>
		);
	}
}

export default Bar;


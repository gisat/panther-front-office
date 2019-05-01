import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import '../style.scss';

class Line extends React.PureComponent {

	static propTypes = {
		itemKey: PropTypes.array,
		coordinates: PropTypes.array,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		color: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);

		this.state = {
			color: chroma(this.props.color).luminance(.5)
		}
	}

	onMouseMove(e) {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
		this.setState({color: this.props.color});
	}

	onMouseOver(e) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
		this.setState({color: this.props.color});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}
		this.setState({color: chroma(this.props.color).luminance(.4)});
	}

	render() {
		const props = this.props;
		let classes = classnames("ptr-line-chart-line", {
		});

		return (
			<path
				className={classes}
				key={props.itemKey}
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				d={`M${props.coordinates.map(point => {
					return `${point.x} ${point.y}`;
				}).join(" L")}`}
				style={{stroke: this.state.color}}
			/>
		);
	}
}

export default Line;


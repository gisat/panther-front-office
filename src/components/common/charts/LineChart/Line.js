import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import '../style.scss';
import Point from "./Point";

class Line extends React.PureComponent {

	static propTypes = {
		itemKey: PropTypes.string,
		coordinates: PropTypes.array,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		color: PropTypes.string,
		withPoints: PropTypes.bool,
		suppressed: PropTypes.bool,
		gray: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);

		this.state = {
			color: !props.gray ? chroma(this.props.color).luminance(.3) : null,
			length: null
		}
	}

	onMouseMove(e, data) {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY, data);
		}
		this.setState({
			color: this.props.color
		});
	}

	onMouseOver(e, data) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKey, e.nativeEvent.offsetX, e.nativeEvent.offsetY, data);
		}
		this.setState({color: this.props.color});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}
		this.setState({color: !this.props.gray ? chroma(this.props.color).luminance(.3) : null});
	}

	componentDidUpdate() {
		let length = this.ref.current.getTotalLength();
		this.setState({length});
	}

	render() {
		const props = this.props;
		let classes = classnames("ptr-line-chart-line-wrapper", {
			gray: this.props.gray
		});

		return (
			<g
				className={classes}
				id={props.itemKey}
				style={{
					opacity: this.props.suppressed ? .3 : 1
				}}
			>
				<path
					onMouseOver={this.onMouseOver}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
					ref={this.ref}
					className={"ptr-line-chart-line"}
					key={props.itemKey}
					d={`M${props.coordinates.map(point => {
						return `${point.x} ${point.y}`;
					}).join(" L")}`}
					style={{
						stroke: this.state.color,
						strokeDasharray: this.state.length,
						strokeDashoffset: this.state.length
					}}
				/>
				{props.withPoints ? this.renderPoints() : null}
			</g>
		);
	}

	renderPoints() {
		const props = this.props;

		return props.coordinates.map((point) => {
			return (
				<Point
					key={point.x + '-' + point.y}
					x={point.x}
					y={point.y}
					data={point.originalData}
					r={5}
					color={this.state.color}
					onMouseOver={this.onMouseOver}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
				/>
			);
		});
	}
}

export default Line;


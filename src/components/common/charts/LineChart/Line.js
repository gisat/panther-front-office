import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import '../style.scss';
import Point from "./Point";

class Line extends React.PureComponent {

	static propTypes = {
		itemKey: PropTypes.string,
		name: PropTypes.string,
		coordinates: PropTypes.array,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
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
			color: (!props.gray && props.defaultColor) ? props.defaultColor : null,
			length: null
		}
	}

	onMouseMove(e, data) {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.itemKey, this.props.name, e.nativeEvent.offsetX, e.nativeEvent.offsetY, data);
		}
		this.setState({
			color: this.props.highlightedColor
		});
	}

	onMouseOver(e, data) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKey, this.props.name, e.nativeEvent.offsetX, e.nativeEvent.offsetY, data);
		}
		this.setState({color: this.props.highlightedColor});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}
		this.setState({color: (!this.props.gray && this.props.defaultColor) ? this.props.defaultColor : null});
	}

	componentDidMount() {
		this.updateLength();
	}

	componentDidUpdate() {
		this.updateLength();
	}

	updateLength() {
		let length = this.ref.current.getTotalLength();
		if (length !== this.state.length) {
			this.setState({length});
		}
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


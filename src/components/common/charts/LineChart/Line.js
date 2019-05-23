import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import HoverContext from "../../HoverHandler/context";

import '../style.scss';
import Point from "./Point";

class Line extends React.PureComponent {
	static contextType = HoverContext;

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
		highlighted: PropTypes.bool,
		withPoints: PropTypes.bool,
		siblings: PropTypes.array,
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

		if (this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey]);
		}

		this.setColor(true);
	}

	onMouseOver(e, data) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKey, this.props.name, e.nativeEvent.offsetX, e.nativeEvent.offsetY, data);
		}

		if (this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey]);
		}

		this.setColor(true);
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}

		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}

		this.setColor();
	}

	componentDidMount() {
		this.updateLength();
		this.setColor();
	}

	componentDidUpdate(prevProps) {
		this.updateLength();

		if (prevProps.gray !== this.props.gray || prevProps.highlighted !== this.props.highlighted || prevProps.suppressed !== this.props.suppressed) {
			this.setColor();
		}
	}

	updateLength() {
		let length = this.ref.current.getTotalLength();
		if (length !== this.state.length) {
			this.setState({length});
		}
	}

	setColor(forceHover) {
		if (this.props.highlighted || forceHover) {
			this.setState({color: this.props.highlightedColor ? this.props.highlightedColor : null});
		} else if (this.props.gray) {
			this.setState({color: null});
		} else {
			this.setState({color: this.props.defaultColor ? this.props.defaultColor : null});
		}
	}

	render() {
		const props = this.props;

		let color = this.state.color;
		let suppressed = this.props.suppressed;
		let highlighted = this.props.highlighted;

		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			let higlightedFromContext = _.includes(this.context.hoveredItems, this.props.itemKey);
			highlighted = higlightedFromContext;

			if (this.props.siblings && !!_.intersection(this.context.hoveredItems, this.props.siblings).length) {
				suppressed = !higlightedFromContext;
			}

			if (higlightedFromContext) {
				color = this.props.highlightedColor ? this.props.highlightedColor : null;
			}
		}
		let classes = classnames("ptr-line-chart-line-wrapper", {
			gray: this.props.gray,
			highlighted
		});


		return (
			<g
				className={classes}
				id={props.itemKey}
				style={{
					opacity: suppressed ? .3 : 1
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
						stroke: color,
						strokeDasharray: this.state.length,
						strokeDashoffset: this.state.length
					}}
				/>
				{props.withPoints ? this.renderPoints(color, highlighted) : null}
			</g>
		);
	}

	renderPoints(color, highlighted) {
		const props = this.props;

		return props.coordinates.map((point) => {
			return (
				<Point
					key={point.x + '-' + point.y}
					x={point.x}
					y={point.y}
					data={point.originalData}
					r={5}
					color={color}
					highlighted={highlighted}
					onMouseOver={this.onMouseOver}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
				/>
			);
		});
	}
}

export default Line;


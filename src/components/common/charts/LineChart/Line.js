import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import HoverContext from "../../HoverHandler/context";

import '../style.scss';
import Point from "../Point";

class Line extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		itemKey: PropTypes.string,
		name: PropTypes.string,
		coordinates: PropTypes.array,
		defaultColor: PropTypes.string,
		highlightColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		highlighted: PropTypes.bool,
		withPoints: PropTypes.bool,
		siblings: PropTypes.array,
		suppressed: PropTypes.bool,
		gray: PropTypes.bool,

		pointNameSourcePath: PropTypes.string,
		pointValueSourcePath: PropTypes.string,
		yOptions: PropTypes.object
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
		if (this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey], {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent(data)
				}
			});
		}

		this.setColor(true);
	}

	onMouseOver(e, data) {
		if (this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey], {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent(data)
				}
			});
		}

		this.setColor(true);
	}

	onMouseOut(e) {
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
			this.setState({color: this.props.highlightColor ? this.props.highlightColor : null});
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
				color = this.props.highlightColor ? this.props.highlightColor : null;
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
					hidden={this.props.gray}
					highlighted={highlighted}
					onMouseOver={this.onMouseOver}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
				/>
			);
		});
	}

	getPopupContent(data) {
		const props = this.props;
		let content = null;

		if (props.name) {
			let name = props.name;
			let pointName = data ? _.get(data, props.pointNameSourcePath) : null;
			let value = data ? _.get(data, props.pointValueSourcePath).toLocaleString() : null;
			let attributeName = null;

			if (pointName) {
				name += ` (${pointName}):`;
			}

			if (value && props.yOptions) {
				if (props.yOptions.name) {
					attributeName = `${props.yOptions.name}: `;
				}

				if (props.yOptions.unit) {
					value = `${value} ${props.yOptions.unit}`;
				}
			}

			content = (
				<div>
					<div><i>{name}</i></div>
					{value ? (<div><i>{attributeName}</i>{value}</div>) : null}
				</div>
			);
		}

		return content
	}
}

export default Line;


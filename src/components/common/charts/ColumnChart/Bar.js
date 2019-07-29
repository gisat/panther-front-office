import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

import HoverContext from "../../../common/HoverHandler/context";

class Bar extends React.PureComponent {

	static contextType = HoverContext;

	static propTypes = {
		itemKeys: PropTypes.array,
		data: PropTypes.object,
		x: PropTypes.number,
		y: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,
		defaultColor: PropTypes.string,
		highlightColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		attributeName: PropTypes.string,
		attributeUnits: PropTypes.string,

		transitionDelay: PropTypes.number, // in ms
		transitionDuration: PropTypes.number, // in ms
	};

	constructor(props) {
		super(props);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);

		this.state = {
			height: 0,
			color: props.defaultColor ? props.defaultColor : null,
			hidden: props.hidden
		}
	}

	onMouseMove(e) {
		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys, {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		let color = null;
		if (this.props.highlightColor) {
			color = this.props.highlightColor;
		}

		this.setState({
			color,
			hidden: false
		});
	}

	onMouseOver(e) {
		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys, {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		let color = null;
		if (this.props.highlightColor) {
			color = this.props.highlightColor;
		}

		this.setState({
			color,
			hidden: false
		});
	}

	onMouseOut(e) {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}

		let color = null;
		if (this.props.defaultColor) {
			color = this.props.defaultColor;
		}

		this.setState({
			color,
			hidden: this.props.hidden
		});
	}

	componentDidMount() {
		this.updateHeight();
	}

	componentDidUpdate() {
		this.updateHeight();
	}

	updateHeight() {
		if (this.props.height !== this.state.height) {
			this.setState({
				height: this.props.height
			});
		}
	}

	render() {
		const props = this.props;

		let style = {};
		let highlighted = false;

		if (this.context && this.context.hoveredItems) {
			highlighted = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
		}


		if (highlighted) {
			style.fill = this.state.color
		} else if (this.state.color && !this.state.hidden) {
			style.fill = this.state.color
		}

		if (props.transitionDelay) {
			style.transitionDelay = props.transitionDelay + 'ms';
		}

		if (props.transitionDuration) {
			style.transitionDuration = props.transitionDuration + 'ms';
		}

		let classes = classnames("ptr-column-chart-bar", {
			hidden: this.state.hidden
		});

		return (
			<rect
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				className={classes}
				style={style}
				y={props.y}
				x={props.x}
				width={props.width}
				height={this.state.height}
			/>
		);
	}

	getPopupContent() {
		const props = this.props;
		let attrName = props.attributeName;
		let unit = props.attributeUnits;
		let columnName = props.name;
		let segmentName = props.data.name;
		let value = props.data.value;

		let header = null;
		if (attrName || segmentName) {
			header = (
				<div>
					<i>{segmentName || attrName}</i>
				</div>
			);
		}

		return (
			<div>
				{header}
				<div><i>{columnName}</i>: {value.toLocaleString()} {unit}</div>
			</div>
		);
	}
}

export default Bar;


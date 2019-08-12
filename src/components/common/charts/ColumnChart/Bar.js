import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

import HoverContext from "../../../common/HoverHandler/context";

const DEFAULT_COLOR = "#2aa8a3";
const HIGHLIGHT_COLOR = "#2a928e";

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

		classes: PropTypes.string,

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
			highlighted: props.highlighted,
			hidden: props.hidden
		}
	}

	onMouseMove(e) {
		this.setState({
			hidden: false,
			highlighted: true
		});
	}

	onMouseOver(e) {
		this.setState({
			hidden: false,
			highlighted: true
		});
	}

	onMouseOut(e) {
		this.setState({
			hidden: this.props.hidden,
			highlighted: false
		});
	}

	componentDidMount() {
		this.updateHeight();
	}

	componentDidUpdate(prevProps) {
		this.updateHeight();
		if (this.props.highlighted !== prevProps.highlighted) {
			this.setState({
				highlighted: this.props.highlighted
			});
		}
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
		let highlighted = this.state.highlighted;
		let defaultColor = props.defaultColor ? props.defaultColor : DEFAULT_COLOR;
		let highlightColor = props.highlightColor ? props.highlightColor : HIGHLIGHT_COLOR;

		if (this.context && (this.context.hoveredItems || this.context.selectedItems)) {
			let isHovered = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
			let isSelected = !!_.intersection(this.context.selectedItems, this.props.itemKeys).length;
			highlighted = isHovered || isSelected;
		}

		if (highlighted) {
			style.fill = highlightColor;
		} else if (!this.state.hidden) {
			style.fill = defaultColor;
		} else {
			style.fill = null;
		}

		if (props.transitionDelay) {
			style.transitionDelay = props.transitionDelay + 'ms';
		}

		if (props.transitionDuration) {
			style.transitionDuration = props.transitionDuration + 'ms';
		}

		let classes = classnames("ptr-column-chart-bar", {
			hidden: this.state.hidden
		}, props.classes);

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
}

export default Bar;


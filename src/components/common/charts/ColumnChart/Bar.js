import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import HoverContext from "../../../common/HoverHandler/context";

import '../style.scss';

class Bar extends React.PureComponent {

	static contextType = HoverContext;

	static propTypes = {
		availableHeight: PropTypes.number,
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		highlighted: PropTypes.bool,
		itemKeys: PropTypes.array,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		x: PropTypes.number,
		y: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,
		hidden: PropTypes.bool
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
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.itemKeys, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}

		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys);
		}

		let color = null;
		if (this.props.highlightedColor) {
			color = this.props.highlightedColor;
		}

		this.setState({
			color,
			hidden: false
		});
	}

	onMouseOver(e) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.itemKeys, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}

		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys);
		}

		let color = null;
		if (this.props.highlightedColor) {
			color = this.props.highlightedColor;
		}

		this.setState({
			color,
			hidden: false
		});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}

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

		if (this.context && this.context.hoveredAreas) {
			highlighted = !!_.intersection(this.context.hoveredAreas, this.props.itemKeys).length;
		}


		if (highlighted) {
			style.fill = this.props.highlightedColor ? this.props.highlightedColor : '#ff0000';
		} else if (this.state.color && !this.state.hidden) {
			style.fill = this.state.color
		}

		let placeholderClasses = classnames("ptr-column-chart-bar-placeholder", {
			visible: highlighted
		});

		let classes = classnames("ptr-column-chart-bar", {
			hidden: this.state.hidden
		});

		return (
			<g onMouseOver={this.onMouseOver}
			   onMouseMove={this.onMouseMove}
			   onMouseOut={this.onMouseOut}>
				<rect className={placeholderClasses}
					  key={this.props.itemKeys[0]+'_hover'}
					  y={props.y}
					  x={props.x}
					  width={props.width}
					  height={this.props.availableHeight}
				/>
				<rect className={classes}
					  style={style}
					  key={this.props.itemKeys[0]}
					  y={props.y}
					  x={props.x}
					  width={props.width}
					  height={this.state.height}
				/>
			</g>
		);
	}
}

export default Bar;


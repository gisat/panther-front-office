import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import '../style.scss';

class Bar extends React.PureComponent {

	static propTypes = {
		defaultColor: PropTypes.string,
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
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
		if (this.state.color && !this.state.hidden) {
			style.fill = this.state.color
		}

		let classes = classnames("ptr-column-chart-bar", {
			hidden: this.state.hidden
		});

		return (
			<rect className={classes}
				  style={style}
				  key={this.props.itemKeys[0]}
				  onMouseOver={this.onMouseOver}
				  onMouseMove={this.onMouseMove}
				  onMouseOut={this.onMouseOut}
				  y={props.y}
				  x={props.x}
				  width={props.width}
				  height={this.state.height}
			/>
		);
	}
}

export default Bar;


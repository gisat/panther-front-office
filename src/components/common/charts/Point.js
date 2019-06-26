import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import HoverContext from "../HoverHandler/context";

import './style.scss';

class Point extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		itemKey: PropTypes.string,
		data: PropTypes.object,
		name: PropTypes.string,
		x: PropTypes.number,
		y: PropTypes.number,
		r: PropTypes.number,
		onMouseMove: PropTypes.func,
		onMouseOut: PropTypes.func,
		onMouseOver: PropTypes.func,
		color: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		highlighted: PropTypes.bool,

		xSourcePath: PropTypes.string,
		ySourcePath: PropTypes.string,
		xOptions: PropTypes.object,
		yOptions: PropTypes.object,

		standalone: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);

		this.state = {
			radius: props.r
		}
	}

	onMouseMove(e) {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(e, this.props.data);
		}

		if (this.props.standalone && this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey], {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		this.setState({
			radius: this.props.r + 3
		});
	}

	onMouseOver(e) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(e, this.props.data);
		}

		if (this.props.standalone && this.context && this.context.onHover) {
			this.context.onHover([this.props.itemKey], {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		this.setState({
			radius: this.props.r + 3
		});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}

		if (this.props.standalone && this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}

		this.setState({
			radius: this.props.r
		});
	}

	render() {
		const props = this.props;
		let classes = classnames("ptr-chart-point", {
			'no-opacity': this.props.highlighted,
			'standalone': this.props.standalone
		});

		let style = {};
		if (props.color) {
			style.fill = props.color
		}

		return (
			<circle
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				className={classes}
				key={props.itemKey}
				cx={props.x}
				cy={props.y}
				r={this.state.radius}
				style={style}
			/>
		)
	}

	getPopupContent() {
		const props = this.props;
		let content = <div>No data</div>;

		if (props.data) {
			let xName = `x`;
			let yName = `y`;

			if (props.xOptions && props.xOptions.name) {
				xName = props.xOptions.name;
			}

			if (props.yOptions && props.yOptions.name) {
				yName = props.yOptions.name;
			}

			content = (
				<div>
					<div>
						<i>{`${props.name}:`}</i>
					</div>
					<div>
						<i>{`${xName}:`}</i> {`${_.get(props.data, props.xSourcePath).toLocaleString()}`}
					</div>
					<div>
						<i>{`${yName}:`}</i> {`${_.get(props.data, props.ySourcePath).toLocaleString()}`}
					</div>
				</div>
			);
		}

		return content;
	}
}

export default Point;


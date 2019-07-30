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
		if (this.context && this.context.onHover) {
			this.context.onHover(this.props.itemKeys, {
				popup: {
					x: e.pageX,
					y: e.pageY,
					content: this.getPopupContent()
				}
			});
		}

		this.setState({
			hidden: false,
			highlighted: true
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

		this.setState({
			hidden: false,
			highlighted: true
		});
	}

	onMouseOut(e) {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}

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

		if (this.context && this.context.hoveredItems) {
			highlighted = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
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

	getPopupContent() {
		const props = this.props;
		let attrName = props.attributeName;
		let segmentName = props.data.name;
		let unit = props.attributeUnits;

		if (_.isArray(props.originalData)) {
			return (
				<div className="ptr-column-chart-popup">
					{segmentName || attrName ? (<div><i>{segmentName || attrName}:&nbsp;</i></div>) : null}
					{props.originalData.map(record => {

						// TODO what if more values?
						let value = record.positive.data[0].value || record.negative.data[0].value;

						let valueString = value;
						if ((value % 1) !== 0) {
							valueString = valueString.toFixed(2);
						}

						return (
							<div key={record.name} className="ptr-column-chart-popup-values">
								{<i>{record.name}:&nbsp;</i>}
								{valueString.toLocaleString()} {unit}
							</div>
						);
					})}
				</div>
			);
		} else {
			let columnName = props.name;
			let value = props.data.value;
			let color = props.data.highlightColor;

			let valueString = value;
			if ((value % 1) !== 0) {
				valueString = valueString.toFixed(2);
			}

			return (
				<div className="ptr-column-chart-popup">
					<div><i>{columnName}</i></div>
					<div className="ptr-column-chart-popup-values">
						{color ? <div className="ptr-column-chart-popup-color" style={{background: color}}></div> : null}
						{segmentName || attrName ? (<i>{segmentName || attrName}:&nbsp;</i>) : null}
						{valueString.toLocaleString()} {unit}
					</div>
				</div>
			);
		}
	}
}

export default Bar;


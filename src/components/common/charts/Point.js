import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import HoverContext from "../HoverHandler/context";

import './style.scss';

class Point extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		itemKey: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		data: PropTypes.object,
		name: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
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

		xScaleType: PropTypes.string,

		xSourcePath: PropTypes.string,
		ySourcePath: PropTypes.string,
		zSourcePath: PropTypes.string,
		xOptions: PropTypes.object,
		yOptions: PropTypes.object,
		zOptions: PropTypes.object,

		standalone: PropTypes.bool,
		siblings: PropTypes.array
	};

	constructor(props) {
		super(props);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onClick = this.onClick.bind(this);

		this.state = {
			radius: props.r
		}
	}

	onClick() {
		if (this.context && this.context.onClick) {
			this.context.onClick([this.props.itemKey]);
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

		if (!this.props.zSourcePath) {
			this.setState({
				radius: this.props.r + 3
			});
		}
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

		if (!this.props.zSourcePath) {
			this.setState({
				radius: this.props.r + 3
			});
		}
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
		let suppressed = false;

		/* Handle context */
		if (this.context && (this.context.hoveredItems || this.context.selectedItems) && this.props.itemKey && this.props.siblings) {
			let hoverIntersection = _.intersection(this.context.hoveredItems, this.props.siblings);
			let selectIntersection = _.intersection(this.context.selectedItems, this.props.siblings);
			let isHovered = _.indexOf(hoverIntersection, this.props.itemKey);
			let isSelected = _.indexOf(selectIntersection, this.props.itemKey);

			if ((!!hoverIntersection.length || !!selectIntersection.length) && isHovered === -1 && isSelected === -1) {
				suppressed = true;
			}
		}

		let classes = classnames("ptr-chart-point", {
			'no-opacity': this.props.highlighted,
			'standalone': this.props.standalone
		});

		let style = {};
		if (props.color) {
			style.fill = props.color
		}
		if (suppressed) {
			style.opacity = .25;
		} else if (!this.props.hidden) {
			style.opacity = 1;
		}

		return (
			<circle
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				onClick={this.onClick}
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

		let style = {};
		let pointName = props.name;
		let xUnits = props.xOptions && props.xOptions.unit;
		let yUnits = props.yOptions && props.yOptions.unit;
		let zUnits = props.zOptions && props.zOptions.unit;

		let xName = props.xOptions && props.xOptions.name || 'X value';
		let yName = props.yOptions && props.yOptions.name || 'Y value';
		let zName = props.zOptions && props.zOptions.name || 'Z value';

		let color = this.props.color;

		let xValue = _.get(props.data, props.xSourcePath);
		let yValue = _.get(props.data, props.ySourcePath);
		let zValue = _.get(props.data, props.zSourcePath);

		let xValueString = xValue;
		if (props.xScaleType === "time") {
			if (props.xOptions.popupValueFormat) {
				xValueString = moment(xValueString).format(props.xOptions.popupValueFormat);
			}
		} else if (xValue && (xValue % 1) !== 0) {
			xValueString = xValueString.toFixed(2);
		}

		let yValueString = yValue;
		if (yValue && (yValue % 1) !== 0) {
			yValueString = yValueString.toFixed(2);
		}

		let zValueString = zValue;
		if (zValue && (zValue % 1) !== 0) {
			zValueString = zValueString.toFixed(2);
		}

		if (color) {
			style.background = color;
		}

		return (
			<>
				<div className="ptr-popup-header">
					<div className="ptr-popup-record-color" style={style}></div>
					{pointName}
				</div>
				<div className="ptr-popup-record-group">
					<div className="ptr-popup-record">
						{<div className="ptr-popup-record-attribute">{xName}</div> }
						<div className="ptr-popup-record-value-group">
							{xValueString || xValueString === 0 ? <span className="value">{xValueString.toLocaleString()}</span> : null}
							{xUnits ? <span className="unit">{xUnits}</span> : null}
						</div>
					</div>
				</div>
				<div className="ptr-popup-record-group">
					<div className="ptr-popup-record">
						{<div className="ptr-popup-record-attribute">{yName}</div> }
						<div className="ptr-popup-record-value-group">
							{yValueString || yValueString === 0 ? <span className="value">{yValueString.toLocaleString()}</span> : null}
							{yUnits ? <span className="unit">{yUnits}</span> : null}
						</div>
					</div>
				</div>
				{this.props.zSourcePath ? (
					<div className="ptr-popup-record-group">
						<div className="ptr-popup-record">
							{<div className="ptr-popup-record-attribute">{zName}</div> }
							<div className="ptr-popup-record-value-group">
								{zValueString || zValueString === 0 ? <span className="value">{zValueString.toLocaleString()}</span> : null}
								{zUnits ? <span className="unit">{zUnits}</span> : null}
							</div>
						</div>
					</div>
				) : null}
			</>
		);
	}
}

export default Point;


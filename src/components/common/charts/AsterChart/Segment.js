import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import HoverContext from "../../HoverHandler/context";

import './style.scss';

class Segment extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		arcEnd: PropTypes.array,
		arcStart: PropTypes.array,
		origin: PropTypes.array,
		radius: PropTypes.number,

		maxArcEnd: PropTypes.array,
		maxArcStart: PropTypes.array,
		maxRadius: PropTypes.number,

		defaultColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		highlightColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		strokeWidth: PropTypes.number,

		nameSourcePath: PropTypes.string,
		valueSourcePath: PropTypes.string,
		hoverValueSourcePath: PropTypes.string, //path for value to tooltip - by dafault same like value. Used in relative.
		data: PropTypes.object,
		relative: PropTypes.bool,
		siblings: PropTypes.array
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);

		this.state = {
			color: props.defaultColor,
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
		this.setColor();
	}

	componentDidUpdate(prevProps) {
	}

	setColor(forceHover) {
		if (forceHover) {
			this.setState({color: this.props.highlightColor ? this.props.highlightColor : null});
		} else {
			this.setState({color: this.props.defaultColor ? this.props.defaultColor : null});
		}
	}

	render() {
		const props = this.props;
		let color = this.state.color;
		let suppressed = false;
		let highlightedFromContext = false;

		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			highlightedFromContext = _.includes(this.context.hoveredItems, this.props.itemKey);

			if (this.props.siblings && !!_.intersection(this.context.hoveredItems, this.props.siblings).length) {
				suppressed = !highlightedFromContext;
			}

			if (highlightedFromContext) {
				color = this.props.highlightColor ? this.props.highlightColor : null;
			}
		}

		let placeholderClasses = classnames("ptr-aster-chart-segment-placeholder", {
			highlighted: highlightedFromContext
		});

		return (
			<g
				// key={props.itemKey}
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
			>
				<path
					className={placeholderClasses}
					d={`
						M${props.origin[0]} ${props.origin[1]}
						L${props.maxArcStart[0]} ${props.maxArcStart[1]}
						A${props.maxRadius} ${props.maxRadius} 0 0 1 ${props.maxArcEnd[0]} ${props.maxArcEnd[1]}
						L${props.origin[0]} ${props.origin[1]}
					`}
				/>
				<path
					className="ptr-aster-chart-segment"
					style={{
						fill: color,
						strokeWidth: this.props.strokeWidth ? this.props.strokeWidth : 1,
						opacity: suppressed ? .4 : 1
					}}
					d={`
						M${props.origin[0]} ${props.origin[1]}
						L${props.arcStart[0]} ${props.arcStart[1]}
						A${props.radius} ${props.radius} 0 0 1 ${props.arcEnd[0]} ${props.arcEnd[1]}
						L${props.origin[0]} ${props.origin[1]}
					`}
				/>
			</g>
		);
	}

	getPopupContent() {
		let content = <div>No data</div>;
		let symbol = this.props.relative ? '%' : null;

		if (this.props.data) {
			content = (
				<div><i>{`${_.get(this.props.data, this.props.nameSourcePath)}:`}</i> {`${_.get(this.props.data, this.props.hoverValueSourcePath).toLocaleString()}`} {symbol}</div>
			);
		}

		return content
	}
}

export default Segment;


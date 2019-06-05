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

		defaultColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		highlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		strokeWidth: PropTypes.number,

		nameSourcePath: PropTypes.string,
		valueSourcePath: PropTypes.string,
		data: PropTypes.object,
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
			this.setState({color: this.props.highlightedColor ? this.props.highlightedColor : null});
		} else {
			this.setState({color: this.props.defaultColor ? this.props.defaultColor : null});
		}
	}

	render() {
		const props = this.props;
		let color = this.state.color;
		let suppressed = false;

		/* Handle context */
		if (this.context && this.context.hoveredItems) {
			let highlightedFromContext = _.includes(this.context.hoveredItems, this.props.itemKey);

			if (this.props.siblings && !!_.intersection(this.context.hoveredItems, this.props.siblings).length) {
				suppressed = !highlightedFromContext;
			}

			if (highlightedFromContext) {
				color = this.props.highlightedColor ? this.props.highlightedColor : null;
			}
		}

		return (
			<path
				key={props.itemKey}
				className="ptr-aster-chart-segment"
				onMouseOver={this.onMouseOver}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
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
		);
	}

	getPopupContent() {
		let content = <div>No data</div>;
		if (this.props.data) {
			content = (
				<div><i>{`${_.get(this.props.data, this.props.nameSourcePath)}:`}</i> {`${_.get(this.props.data, this.props.valueSourcePath).toLocaleString()}`}</div>
			);
		}

		return content
	}
}

export default Segment;


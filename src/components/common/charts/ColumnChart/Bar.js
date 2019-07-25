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
		x: PropTypes.number,
		y: PropTypes.number,
		height: PropTypes.number,
		width: PropTypes.number,
		hidden: PropTypes.bool,

		nameSourcePath: PropTypes.string,
		valueSourcePath: PropTypes.string,
    	hoverValueSourcePath: PropTypes.string,
    	yOptions: PropTypes.object
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
		if (this.props.highlightedColor) {
			color = this.props.highlightedColor;
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
		if (this.props.highlightedColor) {
			color = this.props.highlightedColor;
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
					  y={0}
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

	getPopupContent() {
		const props = this.props;
		let data = props.data;
		let content = null;
		let unit = null;
		let attributeName = null;


		if (data) {
			if (props.yOptions) {
				if (props.yOptions.name) {
					attributeName = `${props.yOptions.name}: `;
				}

				if (props.yOptions.unit) {
					unit = `${props.yOptions.unit}`;
				}
			}
			
			
			if (data.originalData) {
				let con = [];
				if (data.originalData.length > 20) {
					let units = [];
					let values = [];
					_.map(data.originalData,(item) => {
            units.push(_.get(item, this.props.nameSourcePath));
						values.push(_.get(item, this.props.hoverValueSourcePath || this.props.valueSourcePath).toLocaleString());
					});
					content = (
						<div>
							<i>{`${units.length} items: `}</i>
							{`from ${_.min(values).toLocaleString()} ${unit} to ${_.max(values).toLocaleString()} ${unit}`}
						</div>
					);
				} else {
					_.map(data.originalData, (item) => {
            let unit = _.get(item, this.props.nameSourcePath);
						let value = _.get(item, this.props.hoverValueSourcePath || this.props.valueSourcePath);
						con.push(<div key={unit}><i>{unit}:</i> {value.toLocaleString()}</div>);
					});
					content = (<>{con}</>);
				}
			} else {
				let area = _.get(data, this.props.nameSourcePath);
				let value = _.get(data, this.props.hoverValueSourcePath || this.props.valueSourcePath);
				content = (<div key={area}><i>{area}:</i> {value.toLocaleString()} {unit}</div>);
			}
		} else {
			content = (<div key={"no-data"}><i>No data</i></div>);
		}

		return (
			<>
				{attributeName ? (<div><i>{attributeName}</i></div>) : null}
				{content}
			</>
		);
	}
}

export default Bar;


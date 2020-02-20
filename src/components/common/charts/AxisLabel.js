import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';
import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class AxisLabel extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		classes: PropTypes.string,
		maxHeight: PropTypes.number,
		maxWidth: PropTypes.number,
		text: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		textAnchor: PropTypes.string,
		originalDataKey: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	};


	constructor(props) {
		super(props);
		this.label = React.createRef();

		this.state = {
			text: props.text && _.isString(props.text) ? props.text : props.text.toString()
		}
	}

	componentDidMount() {
		this.handleText();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.text !== this.props.text) {
			this.setState({
				text: this.props.text
			});
		}
		this.handleText(prevProps.maxWidth);
	}

	handleText(prevMaxWidth) {
		let bbox = this.label.current.getBBox();

		if (bbox && bbox.width && this.props.maxWidth) {
			if (bbox.width > this.props.maxWidth) {
				let ratio = bbox.width/this.props.maxWidth;
				let adjustedTextLength = Math.floor(this.state.text.length/ratio) - 3;
				let trimmedText = this.state.text.substring(0, adjustedTextLength);
				let text = trimmedText + '...';
				this.setState({text});
			} else if (bbox.width <= this.props.maxWidth && prevMaxWidth !== this.props.maxWidth){
				this.setState({text: this.props.text})
			}
		}
	}

	render() {
		let highlighted = false;
		if (this.props.originalDataKey && this.context && (this.context.hoveredItems || this.context.selectedItems)) {
			let isHovered = _.indexOf(this.context.hoveredItems, this.props.originalDataKey) !== -1;
			let isSelected = _.indexOf(this.context.selectedItems, this.props.originalDataKey) !== -1;
			highlighted = isHovered || isSelected;
		}

		let classes = classnames(this.props.classes, {
			small: this.props.maxHeight < 20,
			highlighted: highlighted
		});

		return (
			<text
				ref={this.label}
				className={classes}
				textAnchor={this.props.textAnchor}
			>
				{this.state.text}
				<title>{this.props.text}</title>
			</text>
		);
	}
}

export default AxisLabel;


import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

class AxisCaption extends React.PureComponent {

	static propTypes = {
		classes: PropTypes.string,
		maxHeight: PropTypes.number,
		maxWidth: PropTypes.number,
		text: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		textAnchor: PropTypes.string
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
		let classes = classnames(this.props.classes, {
			small: this.props.maxHeight < 22
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

export default AxisCaption;


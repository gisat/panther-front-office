import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import './style.scss';

class AxisLabel extends React.PureComponent {

	static propTypes = {
		maxHeight: PropTypes.number,
		maxWidth: PropTypes.number,
		text: PropTypes.string,
		textAnchor: PropTypes.string
	};


	constructor(props) {
		super(props);
		this.label = React.createRef();

		this.state = {
			text: props.text
		}
	}

	componentDidMount() {
		this.handleText();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.handleText();
	}

	handleText() {
		let bbox = this.label.current.getBBox();
		if (bbox && bbox.width && this.props.maxWidth && bbox.width > this.props.maxWidth) {
			let ratio = bbox.width/this.props.maxWidth;
			let adjustedTextLength = Math.floor(this.state.text.length/ratio) - 3;
			let trimmedText = this.state.text.substring(0, adjustedTextLength);
			this.setState({
				text: trimmedText + '...'
			});
		}
	}

	render() {
		let classes = classnames("ptr-tick-caption", {
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

export default AxisLabel;


import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import '../style.scss';

class Point extends React.PureComponent {

	static propTypes = {
		itemKey: PropTypes.string,
		data: PropTypes.object,
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

		this.setState({
			radius: this.props.r + 3
		});
	}

	onMouseOver(e) {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(e, this.props.data);
		}

		this.setState({
			radius: this.props.r + 3
		});
	}

	onMouseOut(e) {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}

		this.setState({
			radius: this.props.r
		});
	}

	render() {
		const props = this.props;
		let classes = classnames("ptr-chart-point", {
		});

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
				fill={props.color}
			/>
		)
	}
}

export default Point;


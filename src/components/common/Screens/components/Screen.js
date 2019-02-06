import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

class Screen extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType(
			PropTypes.node,
			PropTypes.array
		),
		disabled: PropTypes.bool,
		onFocus: PropTypes.func,
		onCloseClick: PropTypes.func,
		onOpenClick: PropTypes.func,
		onRetractClick: PropTypes.func,
		lineage: PropTypes.string,
		width: PropTypes.number
	};

	constructor(props){
		super(props);
		this.onCloseClick = this.props.onCloseClick.bind(this, props.lineage);
		this.onFocus = this.props.onFocus.bind(this, props.lineage);
		this.onOpenClick = this.props.onOpenClick.bind(this, props.lineage);
		this.onRetractClick = this.props.onRetractClick.bind(this, props.lineage);
	}

	render() {
		let classes = classNames("ptr-screen", {
			disabled: this.props.disabled
		});

		let style = {
			width: `${this.props.width}rem`
		};

		return (
			<div className={classes} style={style}>
				<div className="ptr-screen-scroll">
					<p>{this.props.lineage}</p>
					{this.props.content}
				</div>
				<div className="ptr-screen-controls top" onClick={this.onCloseClick}>Close</div>
				{this.props.disabled ? (
					<div className="ptr-screen-controls middle" onClick={this.onOpenClick}>Open</div>
				) : (
					<div className="ptr-screen-controls middle" onClick={this.onRetractClick}>Retract</div>
				)}
			</div>
		);
	}
}

export default Screen;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

class Screen extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
		disabled: PropTypes.bool,
		onFocus: PropTypes.func,
		onCloseClick: PropTypes.func,
		onOpenClick: PropTypes.func,
		onRetractClick: PropTypes.func,
		noControls: PropTypes.bool,
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
			disabled: this.props.disabled,
			open: !this.props.disabled
		});

		let style = {};
		if (this.props.width || this.props.width === 0) {
			style.width = `${this.props.width}rem`
		}

		return (
			<div className={classes} style={style} onFocus={this.onFocus}>
				<div className="ptr-screen-scroll" tabIndex="0">
					{this.props.content}
					<p>{this.props.lineage}</p>
				</div>
				{this.props.disabled ? <div className="ptr-screen-overlay" onClick={this.onOpenClick}></div> : null}
				{!this.props.noControls ? <div className="ptr-screen-controls top" onClick={this.onCloseClick}>x</div> : null}
				{!this.props.noControls && this.props.disabled ? <div className="ptr-screen-controls middle" onClick={this.onOpenClick}>O</div> : null}
				{!this.props.noControls && !this.props.disabled ? <div className="ptr-screen-controls middle" onClick={this.onRetractClick}>R</div> : null}
			</div>
		);
	}
}

export default Screen;

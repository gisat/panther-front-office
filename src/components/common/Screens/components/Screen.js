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
		contentWidth: PropTypes.number,
		disabled: PropTypes.bool,
		onFocus: PropTypes.func,
		onCloseClick: PropTypes.func,
		onOpenClick: PropTypes.func,
		onRetractClick: PropTypes.func,
		noControls: PropTypes.bool,
		lineage: PropTypes.string,
		minWidth: PropTypes.number,
		width: PropTypes.number
	};

	constructor(props){
		super(props);

		this.screen = React.createRef();
		this.state = {
			focused: false
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.onCloseClick = this.props.onCloseClick.bind(this, props.lineage);
		this.onOpenClick = this.props.onOpenClick.bind(this, props.lineage);
		this.onRetractClick = this.props.onRetractClick.bind(this, props.lineage);
	}

	onFocus() {
		if (!this.props.disabled) {
			this.props.onFocus(this.props.lineage);
			this.setState({focused: true});
		}
	}

	onBlur() {
		this.setState({focused: false});
	}

	render() {
		let tabIndex = this.props.disabled ? -1 : 0;
		let classes = classNames("ptr-screen", {
			disabled: this.props.disabled,
			open: !this.props.disabled,
			focused: this.state.focused
		});

		let screenStyle = {};
		if (this.props.width || this.props.width === 0) {
			screenStyle.width = `${this.props.width}rem`;
		}

		let screenScrollStyle = {};
		if (this.props.minWidth) {
			screenScrollStyle.minWidth = `${this.props.minWidth}rem`;
		}

		return (
			<div className={classes} style={screenStyle} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.screen} tabIndex={tabIndex}>
				<div className="ptr-screen-scroll" style={screenScrollStyle} tabIndex={tabIndex}>
					{this.props.content}
				</div>
				<div className="ptr-screen-overlay" onClick={this.onOpenClick} tabIndex={tabIndex}/>
				{!this.props.noControls ? <div className="ptr-screen-controls top" onClick={this.onCloseClick}>x</div> : null}
				{!this.props.noControls && this.props.disabled ? <div className="ptr-screen-controls middle" onClick={this.onOpenClick}>O</div> : null}
				{!this.props.noControls && !this.props.disabled ? <div className="ptr-screen-controls middle" onClick={this.onRetractClick}>R</div> : null}
			</div>
		);
	}
}

export default Screen;

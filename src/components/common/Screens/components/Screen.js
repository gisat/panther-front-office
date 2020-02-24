import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import {Button} from '@gisatcz/ptr-atoms';

class Screen extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
		contentWidth: PropTypes.number,
		disabled: PropTypes.bool,
		focused: PropTypes.bool,
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

	componentDidMount() {
		if (this.props.disabled !== true) {
			this.screen.current.children[0].focus();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.focused && prevProps.focused !== this.props.focused && !this.props.disabled) {
			this.screen.current.children[0].focus();
		}

		if (this.props.disabled) {
			this.setState({focused: false});
		}
	}

	render() {
		let tabIndex = this.props.disabled ? -1 : 0;
		let classes = classNames("ptr-screen", {
			base: (this.props.lineage === "base"),
			disabled: this.props.disabled,
			open: !this.props.disabled,
			focused: this.state.focused
		});

		let screenStyle = {};
		if (this.props.width || this.props.width === 0) {
			screenStyle.width = `${this.props.width}rem`;
		}

		let screenScrollStyle = {};
		if (this.props.disabled) {
			screenScrollStyle.overflow = `hidden`;
		}

		let screenScrollContentStyle = {};
		if (this.props.minWidth || this.props.minWidth === 0) {
			screenScrollContentStyle.minWidth = `${this.props.minWidth}rem`;
		}

		return (
			<div className={classes} style={screenStyle} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.screen}>
				<div className="ptr-screen-scroll" style={screenScrollStyle} tabIndex={tabIndex}>
					<div style={screenScrollContentStyle}>{this.props.content}</div>
				</div>
				<div className="ptr-screen-overlay" onClick={this.onOpenClick}/>
				{!this.props.noControls ? <div className="ptr-screen-controls top">
					<Button
						ghost
						icon={"close"}
						side={"left"}
						unfocusable={this.props.disabled}
						onClick={this.onCloseClick}
					/>
				</div> : null}
				{!this.props.noControls && this.props.disabled ? <div className="ptr-screen-controls middle">
					<Button
						ghost
						icon={"chevron-left"}
						side={"left"}
						unfocusable={this.props.disabled}
						onClick={this.onOpenClick}
					/>
				</div> : null}
				{!this.props.noControls && !this.props.disabled ? <div className="ptr-screen-controls middle">
					<Button
						ghost
						icon={"chevron-right"}
						side={"left"}
						unfocusable={this.props.disabled}
						onClick={this.onRetractClick}
					/>
				</div> : null}
			</div>
		);
	}
}

export default Screen;

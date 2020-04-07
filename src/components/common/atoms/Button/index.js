import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../Icon';
import Menu from '../Menu';

import './style.scss';

class Button extends React.PureComponent {

	static propTypes = {
		circular: PropTypes.bool,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		ghost: PropTypes.bool,
		icon: PropTypes.string,
		inverted: PropTypes.bool,
		invisible: PropTypes.bool,
		large: PropTypes.bool,
		onClick: PropTypes.func.isRequired,
		primary: PropTypes.bool,
		secondary: PropTypes.bool,
		side: PropTypes.string,
		small: PropTypes.bool,
		title: PropTypes.string,
		unfocusable: PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	constructor(props) {
		super(props);
		this.state = {
			focused: false,
			menuOpen: false
		};

		this.onBlur = this.onBlur.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}


	onClick(e) {
		if (!this.props.disabled) {
			if (this.props.onClick) {
				this.props.onClick(e);
			}
			this.setState({
				menuOpen: !this.state.menuOpen
			});
		}
	}

	onBlur() {
		this.setState({
			menuOpen: false
		});
	}

	onKeyPress(e) {
		if(e.charCode === 32) {
			this.onClick(e);
		} else if (e.charCode === 13){
			this.onClick(e);
		}
	}


	render() {

		let iconInsert = null;
		if (this.props.icon) {
			// determine icon
			iconInsert = (
				<Icon icon={this.props.icon} />
			);
		}

		let hasContent = false;
		let content = React.Children.map(this.props.children, child => {
			if (child) {
				if (typeof child === 'string') {
					hasContent = true;
					return (
						<div className="ptr-button-caption">{child}</div>
					);
				} else if (typeof child === 'object' && child.type === React.Fragment) {
					hasContent = true;
					return (
						<div className="ptr-button-content">{child}</div>
					);
				} else if (typeof child === 'object' && child.type === Menu) {
					let props = {
						...child.props,
						open: !!this.state.menuOpen,
						className: classNames(child.props.className, 'ptr-button-menu')
					};
					return React.cloneElement(child, props, child.props.children);
				} else {
					hasContent = true;
					return child;
				}
			}
		});

		let classes = classNames(
			'ptr-button', {
				circular: !!this.props.circular,
				disabled: this.props.disabled,
				ghost: !!this.props.ghost,
				icon: !!iconInsert && !hasContent,
				invisible: !!this.props.invisible,
				inverted: !!this.props.inverted,
				large: !!this.props.large,
				primary: !!this.props.primary,
				secondary: !!this.props.secondary,
				side: !!this.props.side,
				'side-left': this.props.side === 'left',
				'side-right': this.props.side === 'right',
				'side-top': this.props.side === 'top',
				'side-bottom': this.props.side === 'bottom',
				small: this.props.small,
			},
			this.props.className
		);

		return (
			<div
				className={classes}
				id={this.props.id}
				onBlur={this.onBlur}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				tabIndex={(this.props.disabled || this.props.unfocusable) ? "-1" : "0"}
				title={this.props.title}
			>
				{iconInsert}
				{content}
			</div>
		);
	}
}

export default Button;

export const Buttons =  ({vertical, children}) => (<div className={classNames("ptr-buttons", {vertical})}>{children}</div>);
export const ButtonGroup =  ({vertical, className, children}) => (<div className={classNames("ptr-button-group", className, {vertical})}>{children}</div>);

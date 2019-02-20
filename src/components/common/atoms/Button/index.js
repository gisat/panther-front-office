import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Icon from '../Icon';
import Menu from '../Menu';

import './style.css';


class Button extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		primary: PropTypes.bool,
		secondary: PropTypes.bool,
		ghost: PropTypes.bool,
		invisible: PropTypes.bool,
		circular: PropTypes.bool,
		small: PropTypes.bool,
		floatingAction: PropTypes.bool,
		onClick: PropTypes.func,
		className: PropTypes.string,
		inverted: PropTypes.bool
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
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onBlur = this.onBlur.bind(this);
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

	//setFocus(focused) {
	//	this.setState({
	//		focused: focused
	//	});
	//}

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

			//if (typeof child === 'object') console.log('####', child.type === Menu, child.type.prototype instanceof Menu);

			if (child) {
				if (typeof child === 'string') {
					hasContent = true;
					return (
						<div className="ptr-button-caption">{child}</div>
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
				primary: !!this.props.primary,
				secondary: !!this.props.secondary,
				ghost: !!this.props.ghost,
				invisible: !!this.props.invisible,
				circular: !!this.props.circular,
				'floating-action': !!this.props.floatingAction,
				//hasIcon: !!this.props.icon,
				//focused: this.state.focused,
				disabled: this.props.disabled,
				icon: !!iconInsert && !hasContent,
				small: this.props.small,
				inverted: !!this.props.inverted
			},
			this.props.className
		);

		let ret = (
			<div
				className={classes}
				id={this.props.id}
				tabIndex={this.props.disabled ? "-1" : "0"}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				//onFocus={this.setFocus.bind(this, true)}
				onBlur={this.onBlur}
			>
				{iconInsert}
				{content}
			</div>
		);

		return ret;
	}

}


export default Button;
